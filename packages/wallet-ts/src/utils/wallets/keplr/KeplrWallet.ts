/* eslint-disable class-methods-use-this */
import type {
  AminoSignResponse,
  Keplr,
  StdSignDoc,
  Window as KeplrWindow,
} from '@keplr-wallet/types'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'
import { BroadcastMode } from '@cosmjs/launchpad'
import { TxRaw } from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/tx'
import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import { TxRestApi, TxResponse } from '@injectivelabs/sdk-ts'
import {
  CosmosWalletException,
  ErrorType,
  TransactionException,
  UnspecifiedErrorCode,
  WalletErrorActionModule,
} from '@injectivelabs/exceptions'
import { getExperimentalChainConfigBasedOnChainId } from './utils'
import { getEndpointsFromChainId } from '../cosmos/endpoints'

const $window = (typeof window !== 'undefined' ? window : {}) as KeplrWindow

export class KeplrWallet {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
  }

  static async experimentalSuggestChainWithChainData(chainData: any) {
    if (!$window || ($window && !$window.keplr)) {
      throw new CosmosWalletException(
        new Error('Please install Keplr extension'),
        { code: UnspecifiedErrorCode, type: ErrorType.WalletNotInstalledError },
      )
    }

    try {
      await $window.keplr!.experimentalSuggestChain(chainData)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message))
    }
  }

  async getKeplrWallet() {
    const { chainId } = this
    const keplr = this.getKeplr()

    try {
      await keplr.enable(chainId)

      return keplr as Keplr
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message))
    }
  }

  async experimentalSuggestChain() {
    const { chainId } = this
    const keplr = this.getKeplr()

    const chainData = getExperimentalChainConfigBasedOnChainId(chainId)

    if (!chainData) {
      throw new CosmosWalletException(
        new Error(
          `Keplr doesn't support ${chainId} chainId. Please use another wallet`,
        ),
      )
    }

    try {
      await keplr.experimentalSuggestChain(chainData)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message))
    }
  }

  async getAccounts() {
    const { chainId } = this
    const keplr = this.getKeplr()

    try {
      return keplr.getOfflineSigner(chainId).getAccounts()
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: WalletErrorActionModule.GetAccounts,
      })
    }
  }

  async getKey(): Promise<{
    name: string
    algo: string
    isNanoLedger: boolean
    pubKey: Uint8Array
    address: Uint8Array
    bech32Address: string
  }> {
    const keplr = await this.getKeplrWallet()

    try {
      return keplr.getKey(this.chainId)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'Keplr',
      })
    }
  }

  async getOfflineSigner(): Promise<OfflineDirectSigner> {
    const { chainId } = this
    const keplr = await this.getKeplrWallet()

    try {
      return keplr.getOfflineSigner(chainId) as unknown as OfflineDirectSigner
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'Keplr',
      })
    }
  }

  /**
   * This method is used to broadcast a transaction to the network.
   * Since it uses the `Sync` mode, it will not wait for the transaction to be included in a block,
   * so we have to make sure the transaction is included in a block after its broadcasted
   *
   * @param txRaw - raw transaction to broadcast
   * @returns tx hash
   */
  async broadcastTx(txRaw: TxRaw): Promise<string> {
    const { chainId } = this
    const keplr = await this.getKeplrWallet()

    try {
      const result = await keplr.sendTx(
        chainId,
        TxRaw.encode(txRaw).finish(),
        BroadcastMode.Sync,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { context: 'Keplr' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'Keplr',
        contextModule: 'broadcast-tx',
      })
    }
  }

  /**
   * This method is used to broadcast a transaction to the network.
   * Since it uses the `Block` mode, and it will wait for the transaction to be included in a block,
   *
   * @param txRaw - raw transaction to broadcast
   * @returns tx hash
   */
  async broadcastTxBlock(txRaw: TxRaw): Promise<string> {
    const { chainId } = this
    const keplr = await this.getKeplrWallet()

    try {
      const result = await keplr.sendTx(
        chainId,
        TxRaw.encode(txRaw).finish(),
        BroadcastMode.Block,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { context: 'Keplr' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'Keplr',
        contextModule: 'broadcast-tx-block',
      })
    }
  }

  async waitTxBroadcasted(txHash: string): Promise<TxResponse> {
    const endpoints = await this.getChainEndpoints()

    return new TxRestApi(endpoints.rest).fetchTxPoll(txHash)
  }

  async signEIP712CosmosTx({
    eip712,
    signDoc,
  }: {
    eip712: any
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    const { chainId } = this
    const keplr = await this.getKeplrWallet()
    const key = await this.getKey()

    try {
      return keplr.experimentalSignEIP712CosmosTx_v0(
        chainId,
        key.bech32Address,
        eip712,
        signDoc,
      )
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'Keplr',
        contextModule: 'sign-eip712-cosmos-tx',
      })
    }
  }

  async getChainEndpoints(): Promise<{ rpc: string; rest: string }> {
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

  public async checkChainIdSupport() {
    const { chainId } = this
    const keplr = this.getKeplr()

    try {
      await keplr.getKey(chainId)

      // Chain exists already on Keplr
      return true
    } catch (e) {
      return false
    }
  }

  private getKeplr() {
    if (!$window) {
      throw new CosmosWalletException(
        new Error('Please install Keplr extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: 'Keplr',
        },
      )
    }

    if (!$window.keplr) {
      throw new CosmosWalletException(
        new Error('Please install Keplr extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: 'Keplr',
        },
      )
    }

    return $window.keplr!
  }
}
