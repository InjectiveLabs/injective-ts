import type { Keplr, Window as KeplrWindow } from '@keplr-wallet/types'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'
import { BroadcastMode } from '@cosmjs/launchpad'
import type { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import {
  getExperimentalChainConfigBasedOnChainId,
  keplrSupportedChainIds,
  getEndpointsFromChainId,
} from './utils'

export class KeplrWallet {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  private window: KeplrWindow

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
    this.window = window as KeplrWindow
  }

  static async experimentalSuggestChainWithChainData(chainData: any) {
    if (!window) {
      throw new Error('Please install Keplr extension')
    }

    if (!window.keplr) {
      throw new Error('Please install Keplr extension')
    }

    try {
      await window.keplr.experimentalSuggestChain(chainData)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async getKeplrWallet() {
    const { window, chainId } = this

    if (!window) {
      throw new Error('Please install Keplr extension')
    }

    if (!window.keplr) {
      throw new Error('Please install Keplr extension')
    }

    try {
      await window.keplr.enable(chainId)

      return window.keplr as Keplr
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async experimentalSuggestChain() {
    const { window, chainId } = this

    if (!window) {
      throw new Error('Please install Keplr extension')
    }

    if (!window.keplr) {
      throw new Error('Please install Keplr extension')
    }

    const chainData = getExperimentalChainConfigBasedOnChainId(chainId)

    if (!chainData) {
      throw new Error(`There is no data for ${chainId}`)
    }

    try {
      await window.keplr.experimentalSuggestChain(chainData)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async getAccounts() {
    const { window, chainId } = this

    if (!window) {
      throw new Error('Please install Keplr extension')
    }

    if (!window.getOfflineSigner) {
      throw new Error('Please install Keplr extension')
    }

    try {
      return window.getOfflineSigner(chainId).getAccounts()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async getKey(): Promise<{
    name: string
    algo: string
    pubKey: Uint8Array
    address: Uint8Array
    bech32Address: string
  }> {
    const keplr = await this.getKeplrWallet()

    try {
      return keplr.getKey(this.chainId)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async getOfflineSigner(): Promise<OfflineDirectSigner> {
    const { chainId } = this
    const keplr = await this.getKeplrWallet()

    try {
      return keplr.getOfflineSigner(chainId) as unknown as OfflineDirectSigner
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async broadcastTx(txRaw: TxRaw): Promise<string> {
    const { chainId } = this
    const keplr = await this.getKeplrWallet()

    return Buffer.from(
      await keplr.sendTx(chainId, txRaw.serializeBinary(), BroadcastMode.Sync),
    ).toString('hex')
  }

  async getChainEndpoints(): Promise<{ rpc: string; rest: string }> {
    const { chainId } = this

    try {
      return getEndpointsFromChainId(chainId)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  static checkChainIdSupport = (chainId: string) =>
    keplrSupportedChainIds.includes(chainId)
}
