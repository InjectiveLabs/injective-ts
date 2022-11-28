import { getEndpointsForNetwork, Network } from '@injectivelabs/networks'
import { isBrowser, ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  tryNativeToHexString,
  transferFromSolana,
  tryNativeToUint8Array,
  parseSequenceFromLogSolana,
  getEmitterAddressSolana,
  getSignedVAAWithRetry,
  redeemOnInjective,
  getForeignAssetInjective,
  attestFromSolana,
  createWrappedOnInjective,
  hexToUint8Array,
  transferNativeSol,
} from '@certusone/wormhole-sdk'
import { getAssociatedTokenAddress, NATIVE_MINT } from '@solana/spl-token'
import { Connection, PublicKey, TransactionResponse } from '@solana/web3.js'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import {
  WORMHOLE_CHAINS,
  WORMHOLE_CONTRACT_BY_NETWORK,
  WORMHOLE_SOLANA_CONTRACT_BY_NETWORK,
} from '../constants'
import {
  TransferMsgArgs,
  WormholeContractAddresses,
  WormholeSolanaContractAddresses,
} from '../types'
import { getSolanaTransactionInfo } from '../utils'
import { WormholeClient } from '../WormholeClient'

export class SolanaWormholeClient extends WormholeClient {
  public solanaHostUrl?: string

  constructor({
    network,
    solanaHostUrl,
    wormholeRpcUrl,
  }: {
    network: Network
    solanaHostUrl?: string
    wormholeRpcUrl?: string
  }) {
    super({ network, wormholeRpcUrl })
    this.solanaHostUrl = solanaHostUrl
  }

  async getBalances(address: PublicKey) {
    const { solanaHostUrl } = this
    const connection = new Connection(solanaHostUrl || '')

    return connection.getBalance(address)
  }

  async getBridgedAssetBalance(
    injectiveAddress: string,
    tokenAddress: string = NATIVE_MINT.toString(),
  ) {
    const { network } = this
    const endpoints = getEndpointsForNetwork(network)

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

    if (!contractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Injective not found`),
      )
    }

    if (!solanaContractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Solana not found`),
      )
    }

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
    const originAssetHex = tryNativeToHexString(
      tokenAddress,
      WORMHOLE_CHAINS.solana,
    )
    const foreignAsset = await getForeignAssetInjective(
      contractAddresses.token_bridge,
      chainGrpcWasmApi,
      WORMHOLE_CHAINS.solana,
      hexToUint8Array(originAssetHex),
    )

    if (!foreignAsset) {
      throw new GeneralException(new Error(`Foreign asset not found`))
    }

    const response = await chainGrpcWasmApi.fetchSmartContractState(
      foreignAsset,
      Buffer.from(
        JSON.stringify({
          balance: {
            address: injectiveAddress,
          },
        }),
      ).toString('base64'),
    )

    if (typeof response.data === 'string') {
      const state = JSON.parse(
        Buffer.from(response.data, 'base64').toString('utf-8'),
      ) as { balance: string }

      return { address: foreignAsset, balance: state.balance } as {
        address: string
        balance: string
      }
    }

    throw new GeneralException(
      new Error(`Could not get the balance from the token bridge contract`),
    )
  }

  async attestFromSolanaToInjective(
    args: Omit<TransferMsgArgs, 'address' | 'amount'>,
    provider: BaseMessageSignerWalletAdapter,
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { tokenAddress, recipient, signerPubKey } = args
    const pubKey = provider.publicKey || signerPubKey || new PublicKey('')

    if (!tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (pubKey.toBuffer().length === 0) {
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

    if (!contractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Injective not found`),
      )
    }

    if (!solanaContractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Solana not found`),
      )
    }

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

    const connection = new Connection(solanaHostUrl, 'confirmed')
    const transaction = await attestFromSolana(
      connection,
      solanaContractAddresses.core,
      solanaContractAddresses.token_bridge,
      pubKey,
      tokenAddress,
    )

    const signed = await provider.signTransaction(transaction)
    const transactionId = await connection.sendRawTransaction(
      signed.serialize(),
    )

    const info = await getSolanaTransactionInfo(transactionId, connection)

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

    return createWrappedOnInjective(
      contractAddresses.token_bridge,
      recipient,
      signedVAA,
    )
  }

  async transferNativeSolFromSolanaToInjective(
    args: TransferMsgArgs,
    provider: BaseMessageSignerWalletAdapter,
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { amount, recipient, signerPubKey } = args
    const pubKey = provider.publicKey || signerPubKey || new PublicKey('')

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (pubKey.toBuffer().length === 0) {
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

    if (!contractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Injective not found`),
      )
    }

    if (!solanaContractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Solana not found`),
      )
    }

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

    const connection = new Connection(solanaHostUrl, 'confirmed')
    const transaction = await transferNativeSol(
      connection,
      solanaContractAddresses.core,
      solanaContractAddresses.token_bridge,
      pubKey,
      BigInt(amount),
      tryNativeToUint8Array(recipient, WORMHOLE_CHAINS.injective),
      WORMHOLE_CHAINS.injective,
    )

    const signed = await provider.signTransaction(transaction)
    const transactionId = await connection.sendRawTransaction(
      signed.serialize(),
    )

    const info = await getSolanaTransactionInfo(transactionId, connection)

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

    return redeemOnInjective(
      contractAddresses.token_bridge,
      recipient,
      signedVAA,
    )
  }

  async transferFromSolanaToInjective(
    args: TransferMsgArgs,
    provider: BaseMessageSignerWalletAdapter,
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { amount, recipient, signerPubKey } = args
    const endpoints = getEndpointsForNetwork(network)
    const pubKey = provider.publicKey || signerPubKey || new PublicKey('')

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (pubKey.toBuffer().length === 0) {
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

    if (!contractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Injective not found`),
      )
    }

    if (!solanaContractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Solana not found`),
      )
    }

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

    const originAssetHex = tryNativeToHexString(
      args.tokenAddress,
      WORMHOLE_CHAINS.solana,
    )
    const foreignAsset = await getForeignAssetInjective(
      contractAddresses.token_bridge,
      chainGrpcWasmApi,
      WORMHOLE_CHAINS.solana,
      hexToUint8Array(originAssetHex),
    )

    if (!foreignAsset) {
      throw new GeneralException(new Error(`Foreign Injective asset not found`))
    }

    const connection = new Connection(solanaHostUrl, 'confirmed')
    const fromAddress = (
      await getAssociatedTokenAddress(new PublicKey(args.tokenAddress), pubKey)
    ).toString()

    const transaction = await transferFromSolana(
      connection,
      solanaContractAddresses.core,
      solanaContractAddresses.token_bridge,
      pubKey,
      fromAddress,
      args.tokenAddress,
      BigInt(amount),
      tryNativeToUint8Array(recipient, WORMHOLE_CHAINS.injective),
      WORMHOLE_CHAINS.injective,
    )

    const signed = await provider.signTransaction(transaction)
    const transactionId = await connection.sendRawTransaction(
      signed.serialize(),
    )

    const info = await getSolanaTransactionInfo(transactionId, connection)

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

    return redeemOnInjective(
      contractAddresses.token_bridge,
      recipient,
      signedVAA,
    )
  }
}
