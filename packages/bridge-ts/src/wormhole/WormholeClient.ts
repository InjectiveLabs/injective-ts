import { Network } from '@injectivelabs/networks'
import {
  MsgExecuteContract,
  binaryToBase64,
  INJ_DENOM,
  isBrowser,
} from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  tryNativeToHexString,
  getForeignAssetSolana,
  hexToUint8Array,
  transferFromSolana,
  tryNativeToUint8Array,
  parseSequenceFromLogSolana,
  getEmitterAddressSolana,
  getSignedVAAWithRetry,
  redeemOnInjective,
} from '@certusone/wormhole-sdk'
import {
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import {
  Connection,
  PublicKey as SolanaPublicKey,
  Signer,
  sendAndConfirmTransaction,
  TransactionResponse,
} from '@solana/web3.js'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import {
  WORMHOLE_CHAINS,
  WORMHOLE_CONTRACT_BY_NETWORK,
  WORMHOLE_SOLANA_CONTRACT_BY_NETWORK,
} from './constants'
import {
  TransferMsgArgs,
  WormholeContractAddresses,
  WormholeSolanaContractAddresses,
} from './types'
import { createTransferContractMsgExec } from './utils'

export class WormholeClient {
  public network: Network

  public solanaHostUrl: string

  public wormholeRpcUrl: string

  constructor({
    network,
    solanaHostUrl,
    wormholeRpcUrl,
  }: {
    network: Network
    solanaHostUrl: string
    wormholeRpcUrl: string
  }) {
    this.network = network
    this.solanaHostUrl = solanaHostUrl
    this.wormholeRpcUrl = wormholeRpcUrl
  }

  async getRedeemOnInjectiveMsg({
    address,
    signed,
  }: {
    address: string
    signed: Uint8Array | string
  }) {
    const { network } = this
    const contractAddresses = (
      WORMHOLE_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeContractAddresses
      }
    )[network] as WormholeContractAddresses

    if (!contractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} not found`),
      )
    }

    return MsgExecuteContract.fromJSON({
      contractAddress: contractAddresses.token_bridge,
      sender: address,
      msg: {
        data: binaryToBase64(signed),
      },
      action: 'submit_vaa',
    })
  }

  async getFromInjectiveTransferMsg(args: TransferMsgArgs) {
    const { network } = this
    const { amount, address, tokenAddress, payload } = args

    const contractAddresses = (
      WORMHOLE_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeContractAddresses
      }
    )[network] as WormholeContractAddresses

    if (!contractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} not found`),
      )
    }

    const recipientAddress = tryNativeToHexString(
      args.recipient,
      WORMHOLE_CHAINS.injective,
    )
    const action = payload
      ? 'initiate_transfer_with_payload'
      : 'initiate_transfer'

    if (tokenAddress.startsWith('peggy') || tokenAddress === INJ_DENOM) {
      return [
        MsgExecuteContract.fromJSON({
          sender: address,
          action: 'deposit_tokens',
          contractAddress: contractAddresses.token_bridge,
          funds: { denom: tokenAddress, amount },
          msg: {},
        }),
        MsgExecuteContract.fromJSON({
          action,
          sender: address,
          contractAddress: contractAddresses.token_bridge,
          msg: createTransferContractMsgExec(
            { ...args, recipient: recipientAddress },
            {
              native_token: { denom: tokenAddress },
            },
          ),
        }),
      ]
    }

    return [
      MsgExecuteContract.fromJSON({
        sender: address,
        contractAddress: contractAddresses.token_bridge,
        msg: {
          amount,
          spender: contractAddresses.token_bridge,
          expires: {
            never: {},
          },
        },
        action: 'increase_allowance',
      }),
      MsgExecuteContract.fromJSON({
        action,
        sender: address,
        contractAddress: contractAddresses.token_bridge,
        msg: createTransferContractMsgExec(
          { ...args, recipient: recipientAddress },
          {
            token: { contract_addr: tokenAddress },
          },
        ),
      }),
    ]
  }

  async transferFromSolanaToInjective(args: TransferMsgArgs, signer: Signer) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { amount, address, tokenAddress, pubKey } = args

    const solanaContractAddresses = (
      WORMHOLE_SOLANA_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeSolanaContractAddresses
      }
    )[network] as WormholeSolanaContractAddresses

    const contractAddresses = (
      WORMHOLE_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeContractAddresses
      }
    )[network] as WormholeContractAddresses

    if (!contractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} not found`),
      )
    }

    if (!solanaContractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} not found`),
      )
    }

    const connection = new Connection(solanaHostUrl, 'confirmed')
    const foreignSolanaAsset = await getForeignAssetSolana(
      connection,
      solanaContractAddresses.token_bridge,
      WORMHOLE_CHAINS.injective,
      hexToUint8Array(
        tryNativeToHexString(tokenAddress, WORMHOLE_CHAINS.injective) || '',
      ),
    )

    if (!foreignSolanaAsset) {
      throw new GeneralException(new Error(`Foreign Solana asset not found`))
    }

    const solanaMintKey = new SolanaPublicKey(foreignSolanaAsset)
    const ownerKey = new SolanaPublicKey(Buffer.from(pubKey, 'base64'))
    const recipientAddress = await getAssociatedTokenAddress(
      solanaMintKey,
      ownerKey,
      false,
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
    )

    const transaction = await transferFromSolana(
      connection,
      solanaContractAddresses.core,
      solanaContractAddresses.token_bridge,
      ownerKey,
      recipientAddress,
      solanaMintKey,
      BigInt(amount),
      tryNativeToUint8Array(address, WORMHOLE_CHAINS.injective),
      WORMHOLE_CHAINS.injective,
    )

    // sign, send, and confirm transaction
    transaction.partialSign(signer)

    const transactionId = await sendAndConfirmTransaction(
      connection,
      transaction,
      [signer],
    )

    const info = await connection.getTransaction(transactionId, {
      commitment: 'finalized',
      maxSupportedTransactionVersion: 0,
    })

    if (!info) {
      throw new Error('An error occurred while fetching the transaction info')
    }

    const sequence = parseSequenceFromLogSolana(info as TransactionResponse)
    const emitterAddress = await getEmitterAddressSolana(
      solanaContractAddresses.token_bridge,
    )

    // poll until the guardian(s) witness and sign the vaa
    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      [wormholeRpcUrl],
      WORMHOLE_CHAINS.solana,
      emitterAddress,
      sequence,
      {
        transport: isBrowser() ? undefined : NodeHttpTransport(),
      },
    )

    return redeemOnInjective(contractAddresses.token_bridge, address, signedVAA)
  }
}
