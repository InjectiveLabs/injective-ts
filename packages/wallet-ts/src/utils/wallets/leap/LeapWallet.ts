/* eslint-disable class-methods-use-this */
import type { Keplr as Leap } from '@keplr-wallet/types'
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
import { getEndpointsFromChainId } from '../cosmos/endpoints'

const $window = (typeof window !== 'undefined' ? window : {}) as Window & {
  leap?: Leap
}

export class LeapWallet {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
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
  async broadcastTx(txRaw: TxRaw): Promise<string> {
    const { chainId } = this
    const leap = await this.getLeapWallet()

    try {
      const result = await leap.sendTx(
        chainId,
        TxRaw.encode(txRaw).finish(),
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
  async broadcastTxBlock(txRaw: TxRaw): Promise<string> {
    const { chainId } = this
    const leap = await this.getLeapWallet()

    try {
      const result = await leap.sendTx(
        chainId,
        TxRaw.encode(txRaw).finish(),
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
        contextModule: 'Keplr',
      })
    }
  }

  async waitTxBroadcasted(txHash: string): Promise<TxResponse> {
    const endpoints = await this.getChainEndpoints()

    return new TxRestApi(endpoints.rest).fetchTxPoll(txHash)
  }

  async getChainEndpoints(): Promise<{ rpc: string; rest: string }> {
    const { chainId } = this

    try {
      return getEndpointsFromChainId(chainId)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: 'Leap',
      })
    }
  }

  public checkChainIdSupport = async () => {
    const { chainId } = this
    const leap = this.getLeap()

    try {
      await leap.getKey(chainId)

      // Chain exists already on Leap
      return true
    } catch (e) {
      return false
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

    if (!$window.keplr) {
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
