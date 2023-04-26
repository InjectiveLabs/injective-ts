/* eslint-disable class-methods-use-this */
import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import { TxResponse, TxRestApi, CosmosTxV1Beta1Tx } from '@injectivelabs/sdk-ts'
import { DirectSignResponse, makeSignBytes } from '@cosmjs/proto-signing'
import { encodeSecp256k1Pubkey } from '@cosmjs/amino'
import {
  ErrorType,
  UnspecifiedErrorCode,
  CosmosWalletException,
  WalletErrorActionModule,
} from '@injectivelabs/exceptions'
import { getEndpointsFromChainId } from '../cosmos/endpoints'
import { WalletProvider } from './welldone'

const $window = (typeof window !== 'undefined' ? window : {}) as Window & {
  dapp?: WalletProvider
}

export class WelldoneWallet {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
  }

  async getAccounts(): Promise<{ address: string; pubKey: string }> {
    const welldone = this.getWelldone()
    try {
      const accounts = await welldone.request('injective', {
        method: 'dapp:accounts',
      })
      if (Object.keys(accounts).length === 0) {
        throw new Error(
          'Please make the Injective account in the WELLDONE wallet',
        )
      }
      return accounts.injective
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: WalletErrorActionModule.GetAccounts,
      })
    }
  }

  public async broadcastTx(txRaw: CosmosTxV1Beta1Tx.TxRaw): Promise<string> {
    const welldone = await this.getWelldone()
    try {
      const serializedTx = Buffer.from(
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
      ).toString('base64')

      const hash = await welldone.request('injective', {
        method: 'dapp:sendSignedTransaction',
        params: [`0x${serializedTx}`],
      })

      return hash
    } catch (e) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'WELLDONE',
        contextModule: 'bradcast-tx',
      })
    }
  }

  public async waitTxBroadcasted(txHash: string): Promise<TxResponse> {
    const endpoints = await this.getChainEndpoints()

    return new TxRestApi(endpoints.rest).fetchTxPoll(txHash)
  }

  public async signTransaction(
    signDoc: Omit<CosmosTxV1Beta1Tx.SignDoc, 'accountNumber'> & {
      accountNumber: Long
    },
  ): Promise<DirectSignResponse> {
    const welldone = await this.getWelldone()
    try {
      const signBytes = makeSignBytes(signDoc)
      const response = await welldone.request('injective', {
        method: 'dapp:signTransaction',
        params: [`0x${Buffer.from(signBytes).toString('hex')}`],
      })
      return {
        signed: signDoc,
        signature: {
          pub_key: encodeSecp256k1Pubkey(
            Buffer.from(response.publicKey.replace('0x', ''), 'hex'),
          ),
          signature: Buffer.from(
            response.signature.replace('0x', ''),
            'hex',
          ).toString('base64'),
        },
      }
    } catch (e) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'WELLDONE',
        contextModule: 'sign-tx',
      })
    }
  }

  public async getKey() {
    const account = await this.getAccounts()
    return account.pubKey
  }

  public async getChainEndpoints(): Promise<{ rpc: string; rest: string }> {
    const { chainId } = this

    try {
      return getEndpointsFromChainId(chainId)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'Keplr',
        contextModule: 'get-chain-endpoints',
      })
    }
  }

  private getWelldone() {
    if (!$window) {
      throw new CosmosWalletException(
        new Error('Please install WELLDONE extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: 'WELLDONE',
        },
      )
    }

    if (!$window.dapp) {
      throw new CosmosWalletException(
        new Error('Please install WELLDONE extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: 'WELLDONE',
        },
      )
    }

    return $window.dapp!
  }
}
