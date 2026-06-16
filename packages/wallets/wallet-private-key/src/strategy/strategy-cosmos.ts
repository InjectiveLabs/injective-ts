import { WalletAction } from '@injectivelabs/wallet-base'
import { TxGrpcApi } from '@injectivelabs/sdk-ts/core/tx'
import { uint8ArrayToBase64 } from '@injectivelabs/sdk-ts/utils'
import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  CosmosTxV1Beta1TxPb,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts/core/tx'
import { PrivateKeyWallet } from './strategy.js'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type { TxRaw, DirectSignResponse } from '@injectivelabs/sdk-ts/types'
import type {
  ConcreteWalletStrategy,
  SendTransactionOptions,
} from '@injectivelabs/wallet-base'

export class PrivateKeyCosmosWallet
  extends PrivateKeyWallet
  implements ConcreteWalletStrategy
{
  async sendTransaction(
    transaction: TxRaw | DirectSignResponse,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    const { endpoints, txTimeout, txInclusion, onBroadcast } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints within the options for using Ethereum native wallets',
        ),
      )
    }

    const txRaw = createTxRawFromSigResponse(transaction)
    const txApi = new TxGrpcApi(endpoints.grpc)
    const response = await txApi.broadcast(txRaw, {
      txTimeout,
      ...txInclusion,
      onBroadcast,
    })

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
        contextCode: response.code,
        contextModule: response.codespace,
      })
    }

    return response
  }

  async signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    const privateKey = this.getPrivateKey()
    const publicKey = privateKey.toPublicKey()
    const injectiveAddress = privateKey.toAddress().toBech32()

    if (transaction.address !== injectiveAddress) {
      throw new WalletException(
        new Error('Signer address does not match the private key address'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SignTransaction,
        },
      )
    }

    try {
      const signDoc = createSignDocFromTransaction(transaction)
      const signBytes = CosmosTxV1Beta1TxPb.SignDoc.toBinary(signDoc)
      const signature = await privateKey.sign(signBytes)

      return {
        signed: signDoc,
        signature: {
          pub_key: {
            type: 'tendermint/PubKeyEthSecp256k1',
            value: publicKey.toBase64(),
          },
          signature: uint8ArrayToBase64(signature),
        },
      }
    } catch (e: unknown) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }
}
