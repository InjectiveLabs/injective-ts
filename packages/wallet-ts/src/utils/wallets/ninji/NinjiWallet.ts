/* eslint-disable class-methods-use-this */
import type { Keplr as Ninji } from '@keplr-wallet/types'
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
  ninji?: Ninji
}

export class NinjiWallet {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
  }

  static async isChainIdSupported(chainId: CosmosChainId): Promise<boolean> {
    return new NinjiWallet(chainId).checkChainIdSupport()
  }

  async getNinjiWallet() {
    const { chainId } = this
    const ninji = this.getNinji()

    try {
      await ninji.enable(chainId)

      return ninji as Ninji
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message))
    }
  }

  async getAccounts() {
    const { chainId } = this
    const ninji = this.getNinji()

    try {
      return ninji.getOfflineSigner(chainId).getAccounts()
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
    const ninji = await this.getNinjiWallet()

    try {
      return ninji.getKey(this.chainId)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: 'Ninji',
      })
    }
  }

  async getOfflineSigner(): Promise<OfflineDirectSigner> {
    const { chainId } = this
    const ninji = await this.getNinjiWallet()

    try {
      return ninji.getOfflineSigner(chainId) as unknown as OfflineDirectSigner
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: 'Ninji',
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
    const ninji = await this.getNinjiWallet()

    try {
      const result = await ninji.sendTx(
        chainId,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        BroadcastMode.Sync,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { contextModule: 'Ninji' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'broadcast-tx',
        contextModule: 'Ninji',
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
    const ninji = await this.getNinjiWallet()

    try {
      const result = await ninji.sendTx(
        chainId,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        BroadcastMode.Block,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { contextModule: 'Ninji' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'broadcast-tx',
        contextModule: 'Ninji',
      })
    }
  }

  public async checkChainIdSupport() {
    const { chainId } = this
    const ninji = this.getNinji()
    const chainName = chainId.split('-')

    try {
      return !!(await ninji.getKey(chainId))
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

  private getNinji() {
    if (!$window) {
      throw new CosmosWalletException(
        new Error('Please install Ninji extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: 'Ninji',
        },
      )
    }

    if (!$window.ninji) {
      throw new CosmosWalletException(
        new Error('Please install Ninji extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: 'Ninji',
        },
      )
    }

    return $window.ninji! as Ninji
  }
}
