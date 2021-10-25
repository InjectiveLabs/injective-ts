import { Keplr, Window as KeplrWindow } from '@keplr-wallet/types'
import { getChainDataBasedOnChainId, supportedChainIds } from './chain'

export class KeplrWallet {
  private chainId: string

  private window: KeplrWindow

  constructor(chainId: string) {
    this.chainId = chainId
    this.window = window as KeplrWindow
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

    const chainData = getChainDataBasedOnChainId(chainId)

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
      console.log(e, typeof e)
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

  static checkChainIdSupport = (chainId: string) =>
    supportedChainIds.includes(chainId)
}
