/* eslint-disable class-methods-use-this */
import type {
  AminoSignResponse,
  Keplr,
  StdSignDoc,
  Window as KeplrWindow,
} from '@keplr-wallet/types'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'
import { BroadcastMode } from '@cosmjs/launchpad'
import type { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import { TxRestApi } from '@injectivelabs/sdk-ts'
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
        contextModule: WalletErrorActionModule.GetAccounts,
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
        contextModule: 'Keplr',
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
        contextModule: 'Keplr',
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
    const result = await keplr.sendTx(
      chainId,
      txRaw.serializeBinary(),
      BroadcastMode.Sync,
    )

    if (!result || result.length === 0) {
      throw new TransactionException(
        new Error('Transaction failed to be broadcasted'),
        { contextModule: 'Keplr' },
      )
    }

    return Buffer.from(result).toString('hex')
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
    const result = await keplr.sendTx(
      chainId,
      txRaw.serializeBinary(),
      BroadcastMode.Block,
    )

    if (!result || result.length === 0) {
      throw new TransactionException(
        new Error('Transaction failed to be broadcasted'),
        { contextModule: 'Keplr' },
      )
    }

    return Buffer.from(result).toString('hex')
  }

  async waitTxBroadcasted(txHash: string): Promise<string> {
    const endpoints = await this.getChainEndpoints()
    const result = await new TxRestApi(endpoints.rest).fetchTxPoll(txHash)

    return result.txHash
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
        contextModule: 'Keplr',
      })
    }
  }

  async getChainEndpoints(): Promise<{ rpc: string; rest: string }> {
    const { chainId } = this

    try {
      return getEndpointsFromChainId(chainId)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: 'Keplr',
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
          contextModule: 'Keplr',
        },
      )
    }

    if (!$window.keplr) {
      throw new CosmosWalletException(
        new Error('Please install Keplr extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: 'Keplr',
        },
      )
    }

    return $window.keplr!
  }
}
