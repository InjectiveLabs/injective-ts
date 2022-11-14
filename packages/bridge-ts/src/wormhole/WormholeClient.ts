import { getEndpointsForNetwork, Network } from '@injectivelabs/networks'
import {
  MsgExecuteContract,
  binaryToBase64,
  INJ_DENOM,
  isBrowser,
  ChainGrpcWasmApi,
} from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  tryNativeToHexString,
  transferFromSolana,
  tryNativeToUint8Array,
  parseSequenceFromLogSolana,
  getEmitterAddressSolana,
  getSignedVAAWithRetry,
  redeemOnInjective,
  transferFromEth,
  getForeignAssetInjective,
  approveEth,
  parseSequenceFromLogEth,
  getEmitterAddressEth,
  getIsTransferCompletedInjective,
} from '@certusone/wormhole-sdk'
import {
  getAssociatedTokenAddress,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import {
  Connection,
  PublicKey as SolanaPublicKey,
  TransactionResponse,
} from '@solana/web3.js'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ethers } from 'ethers'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import {
  WORMHOLE_CHAINS,
  WORMHOLE_CONTRACT_BY_NETWORK,
  WORMHOLE_SOLANA_CONTRACT_BY_NETWORK,
} from './constants'
import {
  SolanaTransferMsgArgs,
  EthereumTransferMsgArgs,
  WormholeContractAddresses,
  WormholeSolanaContractAddresses,
  WormholeEthereumContractAddresses,
} from './types'
import { createTransferContractMsgExec } from './utils'

export class WormholeClient {
  public network: Network

  public solanaHostUrl?: string

  public wormholeRpcUrl?: string

  constructor({
    network,
    solanaHostUrl,
    wormholeRpcUrl,
  }: {
    network: Network
    solanaHostUrl?: string
    wormholeRpcUrl?: string
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

  async getFromInjectiveTransferMsg(
    args: (SolanaTransferMsgArgs | EthereumTransferMsgArgs) & {
      address: string
    },
  ) {
    const { network } = this
    const { amount, recipient, address, tokenAddress, payload } = args

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
          sender: recipient,
          action: 'deposit_tokens',
          contractAddress: contractAddresses.token_bridge,
          funds: { denom: tokenAddress, amount },
          msg: {},
        }),
        MsgExecuteContract.fromJSON({
          action,
          sender: recipient,
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

  async transferFromEthereumToInjective(
    args: EthereumTransferMsgArgs,
    provider: ethers.providers.Web3Provider,
  ) {
    const { network, wormholeRpcUrl } = this
    const { amount, recipient } = args
    const endpoints = getEndpointsForNetwork(network)

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const ethereumContractAddresses = (
      WORMHOLE_SOLANA_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeEthereumContractAddresses
      }
    )[network] as WormholeEthereumContractAddresses

    const contractAddresses = (
      WORMHOLE_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeContractAddresses
      }
    )[network] as WormholeContractAddresses

    if (!contractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} on Injective not found`),
      )
    }

    if (!ethereumContractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} on Ethereum not found`),
      )
    }

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.sentryGrpcApi)
    const foreignAsset = await getForeignAssetInjective(
      contractAddresses.token_bridge,
      chainGrpcWasmApi,
      WORMHOLE_CHAINS.ethereum,
      new Uint8Array(
        Buffer.from(tryNativeToHexString(args.tokenAddress, 'injective')),
      ),
    )

    if (!foreignAsset) {
      throw new GeneralException(new Error(`Foreign Injective asset not found`))
    }

    await approveEth(
      ethereumContractAddresses.token_bridge,
      args.tokenAddress,
      provider.getSigner(),
      amount,
    )

    const receipt = await transferFromEth(
      ethereumContractAddresses.token_bridge,
      provider.getSigner(),
      args.tokenAddress,
      amount,
      WORMHOLE_CHAINS.injective,
      tryNativeToUint8Array(args.recipient, WORMHOLE_CHAINS.injective),
    )

    const sequence = parseSequenceFromLogEth(
      receipt,
      ethereumContractAddresses.core,
    )
    const emitterAddress = getEmitterAddressEth(
      ethereumContractAddresses.token_bridge,
    )

    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      [wormholeRpcUrl],
      WORMHOLE_CHAINS.ethereum,
      emitterAddress,
      sequence,
      {
        transport: isBrowser() ? undefined : NodeHttpTransport(),
      },
    )

    const result = await getIsTransferCompletedInjective(
      contractAddresses.token_bridge,
      signedVAA,
      chainGrpcWasmApi,
    )

    if (!result) {
      throw new GeneralException(
        new Error(`Transfer has not been completed on Injective`),
      )
    }

    return redeemOnInjective(
      contractAddresses.token_bridge,
      recipient,
      signedVAA,
    )
  }

  async transferFromSolanaToInjective(
    args: SolanaTransferMsgArgs,
    provider: BaseMessageSignerWalletAdapter,
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { amount, recipient, signerPubKey } = args
    const endpoints = getEndpointsForNetwork(network)
    const pubKey = provider.publicKey || signerPubKey

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (!pubKey) {
      throw new GeneralException(new Error(`Please provide signerPubKey`))
    }

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

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
        new Error(`Token Bridge Address for ${network} on Injective not found`),
      )
    }

    if (!solanaContractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} on Solana not found`),
      )
    }

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.sentryGrpcApi)
    const foreignAsset = await getForeignAssetInjective(
      contractAddresses.token_bridge,
      chainGrpcWasmApi,
      WORMHOLE_CHAINS.solana,
      new Uint8Array(
        Buffer.from(tryNativeToHexString(args.tokenAddress, 'injective')),
      ),
    )

    if (!foreignAsset) {
      throw new GeneralException(new Error(`Foreign Injective asset not found`))
    }

    const connection = new Connection(solanaHostUrl, 'confirmed')
    const solanaMintKey = new SolanaPublicKey(foreignAsset)
    const ownerKey = new SolanaPublicKey(pubKey.toBytes())
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
      tryNativeToUint8Array(recipient, WORMHOLE_CHAINS.injective),
      WORMHOLE_CHAINS.injective,
    )

    const signed = await provider.signTransaction(transaction)
    const transactionId = await connection.sendRawTransaction(
      signed.serialize(),
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

    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      [wormholeRpcUrl],
      WORMHOLE_CHAINS.solana,
      emitterAddress,
      sequence,
      {
        transport: isBrowser() ? undefined : NodeHttpTransport(),
      },
    )

    const result = await getIsTransferCompletedInjective(
      contractAddresses.token_bridge,
      signedVAA,
      chainGrpcWasmApi,
    )

    if (!result) {
      throw new GeneralException(
        new Error(`Transfer has not been completed on Injective`),
      )
    }

    return redeemOnInjective(
      contractAddresses.token_bridge,
      recipient,
      signedVAA,
    )
  }
}
