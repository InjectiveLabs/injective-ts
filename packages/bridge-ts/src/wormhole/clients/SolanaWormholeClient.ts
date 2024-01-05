import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { getGrpcTransport, ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  cosmos,
  getSignedVAA,
  redeemOnSolana,
  hexToUint8Array,
  uint8ArrayToHex,
  transferNativeSol,
  transferFromSolana,
  tryNativeToHexString,
  parseSequenceFromLogSolana,
  getEmitterAddressSolana,
  getSignedVAAWithRetry,
  postVaaSolanaWithRetry,
  redeemAndUnwrapOnSolana,
  getIsTransferCompletedSolana,
  tryNativeToUint8Array,
  ChainId,
  getForeignAssetSolana,
} from '@injectivelabs/wormhole-sdk'
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token'
import {
  getForeignAssetInjective,
  getOriginalAssetInjective,
} from '../injective'
import {
  PublicKey,
  Connection,
  Transaction,
  TransactionResponse,
} from '@solana/web3.js'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { TransactionSignatureAndResponse } from '@injectivelabs/wormhole-sdk/lib/cjs/solana'
import { zeroPad } from 'ethers/lib/utils'
import { sleep } from '@injectivelabs/utils'
import { WORMHOLE_CHAINS } from '../constants'
import { TransferMsgArgs, WormholeClient, WormholeSource } from '../types'
import { getContractAddresses, getSolanaTransactionInfo } from '../utils'
import { BaseWormholeClient } from '../WormholeClient'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

const TIMEOUT_BETWEEN_RETRIES = 5000

export class SolanaWormholeClient
  extends BaseWormholeClient
  implements WormholeClient<TransactionResponse, Transaction>
{
  public solanaHostUrl: string

  public provider: PhantomWalletAdapter

  constructor({
    network,
    provider,
    solanaHostUrl,
    wormholeRpcUrl,
    wormholeRestUrl,
  }: {
    network: Network
    provider: PhantomWalletAdapter
    solanaHostUrl: string
    wormholeRpcUrl?: string
    wormholeRestUrl?: string
  }) {
    super({ network, wormholeRestUrl, wormholeRpcUrl })
    this.solanaHostUrl = solanaHostUrl
    this.provider = provider
  }

  async getAddress() {
    try {
      const provider = await this.getProvider()

      return provider.publicKey?.toString() || ''
    } catch (e) {
      return ''
    }
  }

  async getBalance(address: string | PublicKey, tokenAddress?: string) {
    return tokenAddress
      ? this.getSplTokenBalance(address, tokenAddress)
      : this.getNativeTokenBalance(address)
  }

  async transfer(args: TransferMsgArgs) {
    return args.tokenAddress
      ? this.transferToken(args)
      : this.transferNative(args)
  }

  async getTxResponse(txHash: string) {
    const { solanaHostUrl } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    try {
      const connection = new Connection(solanaHostUrl, 'confirmed')
      const txResponse = await connection.getTransaction(txHash)

      if (!txResponse) {
        throw new GeneralException(
          new Error('An error occurred while fetching the transaction info'),
        )
      }

      if (txResponse.meta?.err) {
        throw new GeneralException(new Error(txResponse.meta?.err.toString()))
      }

      return txResponse
    } catch (e) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }
  }

  async getSignedVAA(txResponse: TransactionResponse) {
    const { network, wormholeRpcUrl } = this

    if (!wormholeRpcUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl`),
      )
    }
    const { associatedChainContractAddresses } = getContractAddresses(network)

    const sequence = parseSequenceFromLogSolana(
      txResponse as TransactionResponse,
    )
    const emitterAddress = await getEmitterAddressSolana(
      associatedChainContractAddresses.token_bridge,
    )

    try {
      const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
        [wormholeRpcUrl],
        WORMHOLE_CHAINS.solana,
        emitterAddress,
        sequence,
        {
          transport: getGrpcTransport(),
        },
        TIMEOUT_BETWEEN_RETRIES,
      )

      return Buffer.from(signedVAA).toString('base64')
    } catch (e) {
      throw new GeneralException(
        new Error(
          `Could not get the signed VAA. Is the transaction confirmed?`,
        ),
      )
    }
  }

  async getSignedVAANoRetry(txResponse: TransactionResponse) {
    const { network, wormholeRpcUrl } = this

    if (!wormholeRpcUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl`),
      )
    }
    const { associatedChainContractAddresses } = getContractAddresses(network)

    const sequence = parseSequenceFromLogSolana(
      txResponse as TransactionResponse,
    )
    const emitterAddress = await getEmitterAddressSolana(
      associatedChainContractAddresses.token_bridge,
    )

    try {
      const { vaaBytes: signedVAA } = await getSignedVAA(
        wormholeRpcUrl,
        WORMHOLE_CHAINS.solana,
        emitterAddress,
        sequence,
        {
          transport: getGrpcTransport(),
        },
      )

      return Buffer.from(signedVAA).toString('base64')
    } catch (e) {
      throw new GeneralException(
        new Error(
          `Could not get the signed VAA. Is the transaction confirmed?`,
        ),
      )
    }
  }

  async getIsTransferCompleted(signedVAA: string /* in base 64 */) {
    const { solanaHostUrl, network } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const connection = new Connection(solanaHostUrl, 'confirmed')

    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      WormholeSource.Solana,
    )

    return getIsTransferCompletedSolana(
      associatedChainContractAddresses.token_bridge,
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

  async redeem({
    signedVAA,
    recipient,
  }: {
    recipient: string
    signedVAA: string /* in base 64 */
  }) {
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
      new PublicKey(recipient),
      Buffer.from(signedVAA, 'base64'),
    )
  }

  async redeemNative({
    signedVAA,
    recipient,
  }: {
    recipient: string
    signedVAA: string /* in base 64 */
  }) {
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
      new PublicKey(recipient),
      Buffer.from(signedVAA, 'base64'),
    )
  }

  async getForeignAsset(originChain: ChainId, originAddress: string) {
    const { network, solanaHostUrl } = this

    const { associatedChainContractAddresses } = getContractAddresses(network)
    const connection = new Connection(solanaHostUrl, 'confirmed')

    const originAssetBinary = tryNativeToUint8Array(
      originAddress,
      originChain as ChainId,
    )
    const targetAsset = await getForeignAssetSolana(
      connection,
      associatedChainContractAddresses.token_bridge,
      originChain as ChainId,
      originAssetBinary,
    )

    return targetAsset || ''
  }

  async postVAAWithRetry({
    solanaPubKey,
    signedVAA,
  }: {
    solanaPubKey: string
    signedVAA: string /* in base 64 */
  }): Promise<TransactionSignatureAndResponse[]> {
    const { network, solanaHostUrl } = this
    const MAX_VAA_UPLOAD_RETRIES_SOLANA = 5

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const provider = await this.getProvider()
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

  async createAssociatedTokenAddress(tokenAddress: string) {
    const { solanaHostUrl, network } = this
    const endpoints = getNetworkEndpoints(network)

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const provider = await this.getProvider()
    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)
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
        throw new GeneralException(
          new Error('An error occurred while fetching the transaction info'),
        )
      }
    }

    return recipient.toString()
  }

  async signSendAndConfirmTransaction(transaction: Transaction) {
    const { solanaHostUrl } = this

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    const provider = await this.getProvider()
    const connection = new Connection(solanaHostUrl, 'confirmed')

    const signed = await provider.signTransaction(transaction)
    const transactionId = await connection.sendRawTransaction(
      signed.serialize(),
    )

    const txResponse = await getSolanaTransactionInfo(transactionId, connection)

    if (!txResponse) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }

    return { txHash: transactionId, ...txResponse } as TransactionResponse & {
      txHash: string
    }
  }

  private async getNativeTokenBalance(address: string | PublicKey) {
    const { solanaHostUrl } = this
    const connection = new Connection(solanaHostUrl || '')

    try {
      const balance = (
        await connection.getBalance(new PublicKey(address))
      ).toString()

      return balance
    } catch (e) {
      return '0'
    }
  }

  private async getSplTokenBalance(
    address: string | PublicKey,
    tokenAddress: string,
  ) {
    const { solanaHostUrl } = this
    const connection = new Connection(solanaHostUrl || '')

    try {
      const tokenAddressPubKey = new PublicKey(tokenAddress)
      const tokenAccount = await connection.getTokenAccountsByOwner(
        new PublicKey(address),
        { mint: tokenAddressPubKey },
      )

      if (!tokenAccount || (tokenAccount && tokenAccount.value.length === 0)) {
        return '0'
      }

      const balance = (
        await connection.getTokenAccountBalance(tokenAccount.value[0].pubkey)
      ).value.amount

      return balance
    } catch (e) {
      return '0'
    }
  }

  private async transferToken(args: TransferMsgArgs) {
    const { network, solanaHostUrl, wormholeRestUrl, wormholeRpcUrl } = this
    const { amount, recipient, signer } = args
    const endpoints = getNetworkEndpoints(network)

    const provider = await this.getProvider()
    const pubKey = provider.publicKey || new PublicKey(signer || '')

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
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
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }

    return { txHash: transactionId, ...txResponse } as TransactionResponse & {
      txHash: string
    }
  }

  private async transferNative(args: TransferMsgArgs) {
    const { network, solanaHostUrl, wormholeRestUrl, wormholeRpcUrl } = this
    const { amount, recipient, signer } = args

    const provider = await this.getProvider()
    const pubKey = provider.publicKey || new PublicKey(signer || '')

    if (!solanaHostUrl) {
      throw new GeneralException(new Error(`Please provide solanaHostUrl`))
    }

    if (pubKey.toBuffer().length === 0) {
      throw new GeneralException(new Error(`Please provide signerPubKey`))
    }

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
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
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }

    return { txHash: transactionId, ...txResponse } as TransactionResponse & {
      txHash: string
    }
  }

  private async getProvider(): Promise<
    BaseMessageSignerWalletAdapter<'Phantom'>
  > {
    try {
      return await new Promise((resolve, reject) => {
        this.provider
          .connect()
          .then(() => {
            resolve(
              this
                .provider as unknown as BaseMessageSignerWalletAdapter<'Phantom'>,
            )
          })
          .catch(reject)
      })
    } catch (e) {
      throw new GeneralException(new Error(e as any))
    }
  }
}
