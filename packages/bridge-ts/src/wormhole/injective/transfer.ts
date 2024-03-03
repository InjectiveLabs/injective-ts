import {
  ChainGrpcWasmApi,
  MsgExecuteContractCompat,
  MsgTransfer,
  makeTimeoutTimestampInNs,
} from '@injectivelabs/sdk-ts'
import { getIbcTransferDetails, parseSmartContractStateResponse } from './utils'
import {
  ChainId,
  ChainName,
  coalesceChainId,
  isNativeDenomInjective,
} from '@injectivelabs/wormhole-sdk'
import { fromUint8Array } from 'js-base64'
import { BigNumberInBase } from '@injectivelabs/utils'

/**
 * Return if the VAA has been redeemed or not
 * @param tokenBridgeAddress The Injective token bridge contract address
 * @param signedVAA The signed VAA byte array
 * @param client Holds the wallet and signing information
 * @returns true if the VAA has been redeemed.
 */
export async function getIsTransferCompletedInjective(
  tokenBridgeAddress: string,
  signedVAA: Uint8Array,
  client: ChainGrpcWasmApi,
): Promise<boolean> {
  const queryResult = await client.fetchSmartContractState(
    tokenBridgeAddress,
    Buffer.from(
      JSON.stringify({
        is_vaa_redeemed: {
          vaa: fromUint8Array(signedVAA),
        },
      }),
    ).toString('base64'),
  )
  const parsed = parseSmartContractStateResponse(queryResult)

  return parsed.is_redeemed
}

/**
 * Submits the supplied VAA to Injective
 * @param tokenBridgeAddress Address of Inj token bridge contract
 * @param walletAddress Address of wallet in inj format
 * @param signedVAA VAA with the attestation message
 * @returns Message to be broadcast
 */
export async function submitVAAOnInjective(
  tokenBridgeAddress: string,
  walletAddress: string,
  signedVAA: Uint8Array,
): Promise<MsgExecuteContractCompat> {
  return MsgExecuteContractCompat.fromJSON({
    contractAddress: tokenBridgeAddress,
    sender: walletAddress,
    exec: {
      msg: {
        data: fromUint8Array(signedVAA),
      },
      action: 'submit_vaa',
    },
  })
}

export const redeemOnInjective = submitVAAOnInjective
export const createWrappedOnInjective = submitVAAOnInjective
export const updateWrappedOnInjective = submitVAAOnInjective

/**
 * Creates the necessary messages to transfer an asset
 * @param walletAddress Address of the Inj wallet
 * @param tokenBridgeAddress Address of the token bridge contract
 * @param tokenAddress Address of the token being transferred
 * @param amount Amount of token to be transferred
 * @param recipientChain Destination chain
 * @param recipientAddress Destination wallet address
 * @param relayerFee Relayer fee
 * @param payload Optional payload
 * @returns Transfer messages to be sent on chain
 */
export async function transferFromInjective(
  walletAddress: string,
  tokenBridgeAddress: string,
  tokenAddress: string,
  amount: string,
  recipientChain: ChainId | ChainName,
  recipientAddress: Uint8Array,
  relayerFee: string = '0',
  payload: Uint8Array | null = null,
) {
  const recipientChainId = coalesceChainId(recipientChain)
  const nonce = Math.round(Math.random() * 100000)
  const isNativeAsset = isNativeDenomInjective(tokenAddress)
  const mk_action: string = payload
    ? 'initiate_transfer_with_payload'
    : 'initiate_transfer'

  const mk_initiate_transfer = (info: object) =>
    payload
      ? {
          asset: {
            amount,
            info,
          },
          recipient_chain: recipientChainId,
          recipient: Buffer.from(recipientAddress).toString('base64'),
          fee: relayerFee,
          nonce,
          payload: Buffer.from(payload).toString('base64'),
        }
      : {
          asset: {
            amount,
            info,
          },
          recipient_chain: recipientChainId,
          recipient: Buffer.from(recipientAddress).toString('base64'),
          fee: relayerFee,
          nonce,
        }

  return isNativeAsset
    ? [
        MsgExecuteContractCompat.fromJSON({
          contractAddress: tokenBridgeAddress,
          sender: walletAddress,
          exec: {
            msg: {},
            action: 'deposit_tokens',
          },
          funds: { denom: tokenAddress, amount },
        }),
        MsgExecuteContractCompat.fromJSON({
          contractAddress: tokenBridgeAddress,
          sender: walletAddress,
          exec: {
            msg: mk_initiate_transfer({
              native_token: { denom: tokenAddress },
            }),
            action: mk_action,
          },
        }),
      ]
    : [
        MsgExecuteContractCompat.fromJSON({
          contractAddress: tokenAddress,
          sender: walletAddress,
          exec: {
            msg: {
              spender: tokenBridgeAddress,
              amount,
              expires: {
                never: {},
              },
            },
            action: 'increase_allowance',
          },
        }),
        MsgExecuteContractCompat.fromJSON({
          contractAddress: tokenBridgeAddress,
          sender: walletAddress,
          exec: {
            msg: mk_initiate_transfer({
              token: { contract_addr: tokenAddress },
            }),
            action: mk_action,
          },
        }),
      ]
}

export async function transferFromInjectiveUsingIbc(
  channelId: string,
  associatedChain: ChainId,
  walletAddress: string,
  ibcTranslatorAddress: string,
  denom: string,
  amount: string,
  recipientAddress: string /* in base 64 */,
  destinationLatestBlock: any,
) {
  const memo = JSON.stringify({
    gateway_ibc_token_bridge_payload: getIbcTransferDetails(
      recipientAddress,
      associatedChain,
    ),
  })
  const timeoutTimestamp = makeTimeoutTimestampInNs()

  return MsgTransfer.fromJSON({
    port: 'transfer',
    memo: memo,
    sender: walletAddress,
    receiver: ibcTranslatorAddress,
    channelId: channelId,
    timeout: timeoutTimestamp,
    height: {
      revisionHeight: new BigNumberInBase(destinationLatestBlock.header.height)
        .plus(100)
        .toNumber(),
      revisionNumber: new BigNumberInBase(
        destinationLatestBlock.header.version.block,
      ).toNumber(),
    },
    amount: {
      denom,
      amount,
    },
  })
}
