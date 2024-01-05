/* eslint-disable class-methods-use-this */
import type { Keplr as Leap } from '@keplr-wallet/types'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'
import { BroadcastMode } from '@cosmjs/launchpad'
import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import { TxGrpcApi, TxRestApi, TxResponse } from '@injectivelabs/sdk-ts'
import {
  ErrorType,
  CosmosWalletException,
  TransactionException,
  UnspecifiedErrorCode,
  WalletErrorActionModule,
} from '@injectivelabs/exceptions'
import { getEndpointsFromChainId } from '../cosmos/endpoints'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/sdk-ts'

const $window = (typeof window !== 'undefined' ? window : {}) as Window & {
  leap?: Leap
}

export class LeapWallet {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  private endpoints: { rest: string; rpc?: string }

  constructor(
    chainId: CosmosChainId | TestnetCosmosChainId | ChainId,
    endpoints?: { rest: string; rpc?: string },
  ) {
    this.chainId = chainId
    this.endpoints = endpoints || getEndpointsFromChainId(chainId)
  }

  static async isChainIdSupported(chainId: CosmosChainId): Promise<boolean> {
    return new LeapWallet(chainId).checkChainIdSupport()
  }

  async getLeapWallet() {
    const { chainId } = this
    const leap = this.getLeap()

    try {
      await leap.enable(chainId)

      return leap as Leap
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message))
    }
  }

  async getAccounts() {
    const { chainId } = this
    const leap = this.getLeap()

    try {
      return leap.getOfflineSigner(chainId).getAccounts()
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: WalletErrorActionModule.GetAccounts,
      })
    }
  }

  async getKey(): Promise<{
    name: string
    algo: string
    pubKey: Uint8Array
    address: Uint8Array
    bech32Address: string
  }> {
    const leap = await this.getLeapWallet()

    try {
      return leap.getKey(this.chainId)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: 'Leap',
      })
    }
  }

  async getOfflineSigner(): Promise<OfflineDirectSigner> {
    const { chainId } = this
    const leap = await this.getLeapWallet()

    try {
      return leap.getOfflineSigner(chainId) as unknown as OfflineDirectSigner
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: 'Leap',
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
  async broadcastTx(txRaw: CosmosTxV1Beta1Tx.TxRaw): Promise<string> {
    const { chainId } = this
    const leap = await this.getLeapWallet()

    try {
      const result = await leap.sendTx(
        chainId,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        BroadcastMode.Sync,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { contextModule: 'Leap' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'broadcast-tx',
        contextModule: 'Leap',
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
  async broadcastTxBlock(txRaw: CosmosTxV1Beta1Tx.TxRaw): Promise<string> {
    const { chainId } = this
    const leap = await this.getLeapWallet()

    try {
      const result = await leap.sendTx(
        chainId,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        BroadcastMode.Block,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { contextModule: 'Leap' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'broadcast-tx',
        contextModule: 'Leap',
      })
    }
  }

  async waitTxBroadcasted(
    txHash: string,
    endpoint?: string,
  ): Promise<TxResponse> {
    return endpoint
      ? new TxGrpcApi(endpoint).fetchTxPoll(txHash)
      : new TxRestApi(this.endpoints.rest).fetchTxPoll(txHash)
  }

  public async checkChainIdSupport() {
    const { chainId } = this
    const leap = this.getLeap()
    const chainName = chainId.split('-')

    try {
      return !!(await leap.getKey(chainId))
    } catch (e) {
      throw new CosmosWalletException(
        new Error(
          `Leap doesn't support ${
            chainName[0] || chainId
          } network. Please use another Cosmos wallet`,
        ),
      )
    }
  }

  private getLeap() {
    if (!$window) {
      throw new CosmosWalletException(
        new Error('Please install Leap extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: 'Leap',
        },
      )
    }

    if (!$window.leap) {
      throw new CosmosWalletException(
        new Error('Please install Leap extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: 'Leap',
        },
      )
    }

    return $window.leap!
  }
}
