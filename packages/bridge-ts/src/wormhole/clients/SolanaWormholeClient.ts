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
  postVaaSolanaWithRetry,
  redeemOnSolana,
  getOriginalAssetInjective,
  redeemAndUnwrapOnSolana,
  getIsTransferCompletedSolana,
} from '@certusone/wormhole-sdk'
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token'
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionResponse,
} from '@solana/web3.js'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { TransactionSignatureAndResponse } from '@certusone/wormhole-sdk/lib/cjs/solana'
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
    args: Omit<SolanaTransferMsgArgs, 'amount' | 'recipient'> & {
      provider: BaseMessageSignerWalletAdapter
    },
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { tokenAddress, signerPubKey, provider } = args
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

  async getSignedVAAOnSolana(txResponse: TransactionResponse) {
    const { network, wormholeRpcUrl } = this

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const { solanaContractAddresses } = getSolanaContractAddresses(network)

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

    return Buffer.from(signedVAA).toString('base64')
  }

  async transferNativeSolFromSolanaToInjective(
    args: SolanaNativeSolTransferMsgArgs & {
      provider: BaseMessageSignerWalletAdapter
    },
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { amount, recipient, signerPubKey, provider } = args
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

  async transferFromSolanaToInjective(
    args: SolanaTransferMsgArgs & { provider: BaseMessageSignerWalletAdapter },
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { amount, recipient, signerPubKey, provider } = args
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
    signedVAA,
  }: {
    solanaPubKey: string
    signedVAA: string /* in base 64 */
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
      Buffer.from(signedVAA, 'base64'),
    )
  }

  async redeemNativeSolOnSolana({
    solanaPubKey,
    signedVAA,
  }: {
    solanaPubKey: string
    signedVAA: string /* in base 64 */
  }): Promise<Transaction> {
    const { network, solanaHostUrl } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const { solanaContractAddresses } = getSolanaContractAddresses(network)

    const connection = new Connection(solanaHostUrl, 'confirmed')

    return redeemAndUnwrapOnSolana(
      connection,
      solanaContractAddresses.core,
      solanaContractAddresses.token_bridge,
      new PublicKey(solanaPubKey),
      Buffer.from(signedVAA, 'base64'),
    )
  }

  async postVaaSolanaWithRetry({
    solanaPubKey,
    signedVAA,
    provider,
  }: {
    solanaPubKey: string
    signedVAA: string /* in base 64 */
    provider: BaseMessageSignerWalletAdapter
  }): Promise<TransactionSignatureAndResponse[]> {
    const { network, solanaHostUrl } = this
    const MAX_VAA_UPLOAD_RETRIES_SOLANA = 5

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const { solanaContractAddresses } = getSolanaContractAddresses(network)

    const connection = new Connection(solanaHostUrl, 'confirmed')

    return postVaaSolanaWithRetry(
      connection,
      provider.signTransaction.bind(provider),
      solanaContractAddresses.core,
      new PublicKey(solanaPubKey),
      Buffer.from(signedVAA, 'base64'),
      MAX_VAA_UPLOAD_RETRIES_SOLANA,
    )
  }

  async createAssociatedTokenAddress(
    tokenAddress: string,
    provider: BaseMessageSignerWalletAdapter,
  ) {
    const { solanaHostUrl, network } = this
    const endpoints = getEndpointsForNetwork(network)

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.sentryGrpcApi)
    const connection = new Connection(solanaHostUrl, 'confirmed')

    const solanaPublicKey = new PublicKey(provider.publicKey || '')
    const originalAsset = await getOriginalAssetInjective(
      tokenAddress,
      chainGrpcWasmApi,
    )
    const solanaMintKey = new PublicKey(originalAsset.assetAddress)
    const recipient = await getAssociatedTokenAddress(
      solanaMintKey,
      solanaPublicKey,
    )
    // create the associated token account if it doesn't exist
    const associatedAddressInfo = await connection.getAccountInfo(recipient)

    if (!associatedAddressInfo) {
      const transaction = new Transaction().add(
        await createAssociatedTokenAccountInstruction(
          solanaPublicKey,
          recipient,
          solanaPublicKey,
          solanaMintKey,
        ),
      )

      const { blockhash } = await connection.getLatestBlockhash()

      transaction.recentBlockhash = blockhash
      transaction.feePayer = solanaPublicKey

      const signed = await provider.signTransaction(transaction)
      const transactionId = await connection.sendRawTransaction(
        signed.serialize(),
      )

      const txResponse = await getSolanaTransactionInfo(
        transactionId,
        connection,
      )

      if (!txResponse) {
        throw new Error('An error occurred while fetching the transaction info')
      }
    }

    return recipient.toString()
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

  async getIsTransferCompletedSolana(signedVAA: string /* in base 64 */) {
    const { solanaHostUrl, network } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const connection = new Connection(solanaHostUrl, 'confirmed')

    const { contractAddresses } = getSolanaContractAddresses(network)

    return getIsTransferCompletedSolana(
      contractAddresses.token_bridge,
      Buffer.from(signedVAA, 'base64'),
      connection,
    )
  }

  async getTransactionResponse(transactionId: string) {
    const { solanaHostUrl } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const connection = new Connection(solanaHostUrl, 'confirmed')

    const txResponse = await getSolanaTransactionInfo(transactionId, connection)

    if (!txResponse) {
      throw new Error('An error occurred while fetching the transaction info')
    }

    return txResponse
  }
}
