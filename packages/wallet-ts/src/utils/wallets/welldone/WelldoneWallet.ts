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

  private chainName: string

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
    this.chainName = chainId.split('-')[0]
  }

  async getAccounts(): Promise<{ address: string; pubKey: string }> {
    const welldone = await this.getWelldoneWallet()

    try {
      const accounts = await welldone.request(this.chainName, {
        method: 'dapp:accounts',
      })

      if (Object.keys(accounts).length === 0) {
        throw new Error(
          `Please make the ${this.chainName} account in the WELLDONE wallet`,
        )
      }

      return accounts[this.chainName]
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: WalletErrorActionModule.GetAccounts,
      })
    }
  }

  public async broadcastTx(txRaw: CosmosTxV1Beta1Tx.TxRaw): Promise<string> {
    const welldone = await this.getWelldoneWallet()

    try {
      const { hash } = await welldone.request(this.chainName, {
        method: 'dapp:sendSignedTransaction',
        params: [
          `0x${Buffer.from(
            CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
          ).toString('hex')}`,
        ],
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

  private changePubKeyType(authInfoBytes: Uint8Array) {
    const authInfo = CosmosTxV1Beta1Tx.AuthInfo.decode(authInfoBytes)

    authInfo.signerInfos.forEach((signerInfo) => {
      if (signerInfo.publicKey) {
        signerInfo.publicKey.typeUrl = '/cosmos.crypto.secp256k1.PubKey'
      }
    })

    return CosmosTxV1Beta1Tx.AuthInfo.encode(authInfo).finish()
  }

  public async signTransaction(
    signDoc: Omit<CosmosTxV1Beta1Tx.SignDoc, 'accountNumber'> & {
      accountNumber: Long
    },
  ): Promise<DirectSignResponse> {
    const authInfoBytes = this.changePubKeyType(signDoc.authInfoBytes)
    signDoc.authInfoBytes = authInfoBytes

    const welldone = await this.getWelldoneWallet()

    try {
      const signBytes = makeSignBytes(signDoc)
      const response = await welldone.request(this.chainName, {
        method: 'dapp:signTransaction',
        params: [`0x${Buffer.from(signBytes).toString('hex')}`],
      })

      return {
        signed: signDoc,
        signature: {
          pub_key: encodeSecp256k1Pubkey(
            Buffer.from(response[0].publicKey.replace('0x', ''), 'hex'),
          ),
          signature: Buffer.from(
            response[0].signature.replace('0x', ''),
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
        context: 'WELLDONE',
        contextModule: 'get-chain-endpoints',
      })
    }
  }

  // WELLDONE Wallet only supports injective, cosmos, juno netoworks.
  public async checkChainIdSupport() {
    const { chainId } = this

    return ['injective', 'cosmoshub', 'juno'].some((cosmosChainId) =>
      chainId.includes(cosmosChainId),
    )
  }

  private async checkNetwork() {
    const welldone = this.getWelldone()

    try {
      const { node_info } = await welldone.request(this.chainName, {
        method: 'status',
      })

      return node_info.network === this.chainId
    } catch (e) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'WELLDONE',
        contextModule: 'check-network',
      })
    }
  }

  public async getWelldoneWallet() {
    const { chainId } = this
    const welldone = this.getWelldone()

    if (!(await this.checkNetwork())) {
      throw new Error(`Change the WELLDONE Wallet Network to ${chainId}`)
    }

    return welldone
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
