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
  getForeignAssetInjective,
  attestFromSolana,
  hexToUint8Array,
  transferNativeSol,
  // getIsTransferCompletedSolana,
  redeemOnSolana,
} from '@certusone/wormhole-sdk'
import { getAssociatedTokenAddress } from '@solana/spl-token'
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionResponse,
} from '@solana/web3.js'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { WORMHOLE_CHAINS } from '../constants'
import { SolanaNativeSolTransferMsgArgs, SolanaTransferMsgArgs } from '../types'
import { getSolanaContractAddresses, getSolanaTransactionInfo } from '../utils'
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

  async attestFromSolanaToInjective(
    args: Omit<SolanaTransferMsgArgs, 'amount' | 'recipient'>,
    provider: BaseMessageSignerWalletAdapter,
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { tokenAddress, signerPubKey } = args
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

    const { solanaContractAddresses } = getSolanaContractAddresses(network)

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

    const txResponse = await getSolanaTransactionInfo(transactionId, connection)

    if (!txResponse) {
      throw new Error('An error occurred while fetching the transaction info')
    }

    return txResponse as TransactionResponse
  }

  async confirmAttestFromSolanaToInjective(txResponse: TransactionResponse) {
    const { network, wormholeRpcUrl } = this

    const { solanaContractAddresses } = getSolanaContractAddresses(network)

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const sequence = parseSequenceFromLogSolana(txResponse)
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

    return Buffer.from(signedVAA).toString('base64')
  }

  async transferNativeSolFromSolanaToInjective(
    args: SolanaNativeSolTransferMsgArgs,
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

    const { solanaContractAddresses } = getSolanaContractAddresses(network)

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

    const txResponse = await getSolanaTransactionInfo(transactionId, connection)

    if (!txResponse) {
      throw new Error('An error occurred while fetching the transaction info')
    }

    return txResponse as TransactionResponse
  }

  async confirmTransferNativeSolFromSolanaToInjective(
    txResponse: TransactionResponse,
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const { solanaContractAddresses } = getSolanaContractAddresses(network)

    // const connection = new Connection(solanaHostUrl, 'confirmed')

    const sequence = parseSequenceFromLogSolana(
      txResponse as TransactionResponse,
    )
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

    /*
    const transferIsCompleted = await getIsTransferCompletedSolana(
      solanaContractAddresses.token_bridge,
      signedVAA,
      connection,
    )

    if (!transferIsCompleted) {
      throw new Error('The transfer has not been completed')
    } */

    return Buffer.from(signedVAA).toString('base64')
  }

  async transferFromSolanaToInjective(
    args: SolanaTransferMsgArgs,
    provider: BaseMessageSignerWalletAdapter,
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { amount, recipient, signerPubKey } = args
    const endpoints = getEndpointsForNetwork(network)
    const pubKey = provider.publicKey || signerPubKey || new PublicKey('')

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (pubKey.toBuffer().length === 0) {
      throw new GeneralException(new Error(`Please provide signerPubKey`))
    }

    const { contractAddresses, solanaContractAddresses } =
      getSolanaContractAddresses(network)

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

    const txResponse = await getSolanaTransactionInfo(transactionId, connection)

    if (!txResponse) {
      throw new Error('An error occurred while fetching the transaction info')
    }

    return txResponse as TransactionResponse
  }

  async confirmTransferFromSolanaToInjective(txResponse: TransactionResponse) {
    const { network, wormholeRpcUrl, solanaHostUrl } = this

    const { solanaContractAddresses } = getSolanaContractAddresses(network)

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    // const connection = new Connection(solanaHostUrl, 'confirmed')

    const sequence = parseSequenceFromLogSolana(txResponse)
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

    /*
    const transferIsCompleted = await getIsTransferCompletedSolana(
      solanaContractAddresses.token_bridge,
      signedVAA,
      connection,
    )

    if (!transferIsCompleted) {
      throw new Error('The transfer has not been completed')
    } */

    return Buffer.from(signedVAA).toString('base64')
  }

  async redeemOnSolana({
    solanaPubKey,
    signed,
  }: {
    solanaPubKey: string
    signed: string /* in base 64 */
  }): Promise<Transaction> {
    const { network, solanaHostUrl } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const { solanaContractAddresses } = getSolanaContractAddresses(network)

    const connection = new Connection(solanaHostUrl, 'confirmed')

    return redeemOnSolana(
      connection,
      solanaContractAddresses.core,
      solanaContractAddresses.token_bridge,
      new PublicKey(solanaPubKey),
      Buffer.from(signed, 'base64'),
    )
  }

  async signSendAndConfirmTransactionOnSolana(
    transaction: Transaction,
    provider: BaseMessageSignerWalletAdapter,
  ) {
    const { solanaHostUrl } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const connection = new Connection(solanaHostUrl, 'confirmed')

    const signed = await provider.signTransaction(transaction)
    const transactionId = await connection.sendRawTransaction(
      signed.serialize(),
    )

    const txResponse = await getSolanaTransactionInfo(transactionId, connection)

    if (!txResponse) {
      throw new Error('An error occurred while fetching the transaction info')
    }

    return txResponse as TransactionResponse
  }
}
