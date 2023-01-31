import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { getGrpcTransport, ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  tryNativeToHexString,
  transferFromSolana,
  parseSequenceFromLogSolana,
  getEmitterAddressSolana,
  getSignedVAAWithRetry,
  getForeignAssetInjective,
  hexToUint8Array,
  transferNativeSol,
  postVaaSolanaWithRetry,
  redeemOnSolana,
  getOriginalAssetInjective,
  redeemAndUnwrapOnSolana,
  getIsTransferCompletedSolana,
  uint8ArrayToHex,
  cosmos,
} from '@injectivelabs/wormhole-sdk'
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
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { TransactionSignatureAndResponse } from '@injectivelabs/wormhole-sdk/lib/cjs/solana'
import { zeroPad } from 'ethers/lib/utils'
import { sleep } from '@injectivelabs/utils'
import { WORMHOLE_CHAINS } from '../constants'
import { SolanaNativeSolTransferMsgArgs, SolanaTransferMsgArgs } from '../types'
import { getContractAddresses, getSolanaTransactionInfo } from '../utils'
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

  async getNativeSolBalance(address: PublicKey | string) {
    const { solanaHostUrl } = this
    const connection = new Connection(solanaHostUrl || '')

    return connection.getBalance(new PublicKey(address))
  }

  async transferNativeSolToInjective(
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

    const { associatedChainContractAddresses } = getContractAddresses(network)

    const connection = new Connection(solanaHostUrl, 'confirmed')
    const transaction = await transferNativeSol(
      connection,
      associatedChainContractAddresses.core,
      associatedChainContractAddresses.token_bridge,
      pubKey,
      BigInt(amount),
      hexToUint8Array(
        uint8ArrayToHex(zeroPad(cosmos.canonicalAddress(recipient), 32)),
      ),
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

    return { txHash: transactionId, ...txResponse } as TransactionResponse & {
      txHash: string
    }
  }

  async transferToInjective(
    args: SolanaTransferMsgArgs & { provider: BaseMessageSignerWalletAdapter },
  ) {
    const { network, solanaHostUrl, wormholeRpcUrl } = this
    const { amount, recipient, signerPubKey, provider } = args
    const endpoints = getNetworkEndpoints(network)
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

    const { injectiveContractAddresses, associatedChainContractAddresses } =
      getContractAddresses(network)

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

    const originAssetHex = tryNativeToHexString(
      args.tokenAddress,
      WORMHOLE_CHAINS.solana,
    )
    const foreignAsset = await getForeignAssetInjective(
      injectiveContractAddresses.token_bridge,
      // @ts-ignore
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
      associatedChainContractAddresses.core,
      associatedChainContractAddresses.token_bridge,
      pubKey,
      fromAddress,
      args.tokenAddress,
      BigInt(amount),
      hexToUint8Array(
        uint8ArrayToHex(zeroPad(cosmos.canonicalAddress(recipient), 32)),
      ),
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

    return { txHash: transactionId, ...txResponse } as TransactionResponse & {
      txHash: string
    }
  }

  async getSignedVAA(txResponse: TransactionResponse) {
    const { network, wormholeRpcUrl } = this

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const { associatedChainContractAddresses } = getContractAddresses(network)

    const sequence = parseSequenceFromLogSolana(
      txResponse as TransactionResponse,
    )
    const emitterAddress = await getEmitterAddressSolana(
      associatedChainContractAddresses.token_bridge,
    )

    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      [wormholeRpcUrl],
      WORMHOLE_CHAINS.solana,
      emitterAddress,
      sequence,
      {
        transport: getGrpcTransport(),
      },
    )

    return Buffer.from(signedVAA).toString('base64')
  }

  async redeem(
    solanaPubKey: string,
    signedVAA: string /* in base 64 */,
  ): Promise<Transaction> {
    const { network, solanaHostUrl } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const { associatedChainContractAddresses } = getContractAddresses(network)

    const connection = new Connection(solanaHostUrl, 'confirmed')

    return redeemOnSolana(
      connection,
      associatedChainContractAddresses.core,
      associatedChainContractAddresses.token_bridge,
      new PublicKey(solanaPubKey),
      Buffer.from(signedVAA, 'base64'),
    )
  }

  async redeemNativeSol(
    solanaPubKey: string,
    signedVAA: string /* in base 64 */,
  ): Promise<Transaction> {
    const { network, solanaHostUrl } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const { associatedChainContractAddresses } = getContractAddresses(network)

    const connection = new Connection(solanaHostUrl, 'confirmed')

    return redeemAndUnwrapOnSolana(
      connection,
      associatedChainContractAddresses.core,
      associatedChainContractAddresses.token_bridge,
      new PublicKey(solanaPubKey),
      Buffer.from(signedVAA, 'base64'),
    )
  }

  async postVAAWithRetry({
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

    const { associatedChainContractAddresses } = getContractAddresses(network)

    const connection = new Connection(solanaHostUrl, 'confirmed')

    return postVaaSolanaWithRetry(
      connection,
      provider.signTransaction.bind(provider),
      associatedChainContractAddresses.core,
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
    const endpoints = getNetworkEndpoints(network)

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)
    const connection = new Connection(solanaHostUrl, 'confirmed')

    const solanaPublicKey = new PublicKey(provider.publicKey || '')
    const originalAsset = await getOriginalAssetInjective(
      tokenAddress,
      // @ts-ignore
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

  async signSendAndConfirmTransaction(
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

    return { txHash: transactionId, ...txResponse } as TransactionResponse & {
      txHash: string
    }
  }

  async getIsTransferCompleted(signedVAA: string /* in base 64 */) {
    const { solanaHostUrl, network } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const connection = new Connection(solanaHostUrl, 'confirmed')

    const { injectiveContractAddresses } = getContractAddresses(network)

    return getIsTransferCompletedSolana(
      injectiveContractAddresses.token_bridge,
      Buffer.from(signedVAA, 'base64'),
      connection,
    )
  }

  async getIsTransferCompletedRetry(signedVAA: string /* in base 64 */) {
    const RETRIES = 2
    const TIMEOUT_BETWEEN_RETRIES = 2000

    for (let i = 0; i < RETRIES; i += 1) {
      if (await this.getIsTransferCompleted(signedVAA)) {
        return true
      }

      await sleep(TIMEOUT_BETWEEN_RETRIES)
    }

    return false
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

    return { txHash: transactionId, ...txResponse } as TransactionResponse & {
      txHash: string
    }
  }
}
