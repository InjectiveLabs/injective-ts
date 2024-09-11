/* eslint-disable class-methods-use-this */
import type { Keplr as Fox } from '@keplr-wallet/types'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'
import { BroadcastMode } from '@cosmjs/launchpad'
import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import {
  ErrorType,
  CosmosWalletException,
  TransactionException,
  UnspecifiedErrorCode,
  WalletErrorActionModule,
} from '@injectivelabs/exceptions'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/sdk-ts'

const $window = (typeof window !== 'undefined' ? window : {}) as Window & {
  foxwallet?: { cosmos?: Fox }
}

export class FoxWallet {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
  }

  static async isChainIdSupported(chainId: CosmosChainId): Promise<boolean> {
    return new FoxWallet(chainId).checkChainIdSupport()
  }

  async getFoxWallet() {
    const { chainId } = this
    const foxwallet = this.getFox()

    try {
      await foxwallet.enable(chainId)

      return foxwallet as Fox
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message))
    }
  }

  async getAccounts() {
    const { chainId } = this
    const foxwallet = this.getFox()

    try {
      return foxwallet.getOfflineSigner(chainId).getAccounts()
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
    const foxwallet = await this.getFoxWallet()

    try {
      return foxwallet.getKey(this.chainId)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: 'FoxWallet',
      })
    }
  }

  async getOfflineSigner(): Promise<OfflineDirectSigner> {
    const { chainId } = this
    const foxwallet = await this.getFoxWallet()

    try {
      return foxwallet.getOfflineSigner(
        chainId,
      ) as unknown as OfflineDirectSigner
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: 'FoxWallet',
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
    const foxwallet = await this.getFoxWallet()

    try {
      const result = await foxwallet.sendTx(
        chainId,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        BroadcastMode.Sync,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { contextModule: 'FoxWallet' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'broadcast-tx',
        contextModule: 'FoxWallet',
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
    const foxwallet = await this.getFoxWallet()

    try {
      const result = await foxwallet.sendTx(
        chainId,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        BroadcastMode.Block,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { contextModule: 'FoxWallet' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'broadcast-tx',
        contextModule: 'FoxWallet',
      })
    }
  }

  public async checkChainIdSupport() {
    const { chainId } = this
    const foxwallet = this.getFox()

    try {
      return !!(await foxwallet.getKey(chainId))
    } catch (e) {
      throw new CosmosWalletException(
        new Error(
          `FoxWallet doesn't support ${chainId} network. Please use another Cosmos wallet`,
        ),
      )
    }
  }

  private getFox() {
    if (!$window) {
      throw new CosmosWalletException(
        new Error('Please install FoxWallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: 'FoxWallet',
        },
      )
    }

    if (!$window.foxwallet?.cosmos) {
      throw new CosmosWalletException(
        new Error('Please install FoxWallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: 'FoxWallet',
        },
      )
    }

    return $window.foxwallet.cosmos!
  }
}
