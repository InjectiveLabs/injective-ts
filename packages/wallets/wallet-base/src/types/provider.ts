import type { EIP1193Provider } from 'viem'

export interface BrowserEip1993Provider extends EIP1193Provider {
  removeAllListeners(): void
  providers?: BrowserEip1993Provider[]
  isTrust: boolean
  isKeplr: boolean
  isRabby: boolean
  isRainbow: boolean
  isPhantom: boolean
  isBitGet?: boolean
  isBitKeep?: boolean
  isMetaMask: boolean
  isOkxWallet: boolean
  isTrustWallet: boolean
}

// Use Omit to avoid conflict with viem's stricter Window.ethereum type
// and @keplr-wallet/types' Window.keplr type
export interface WindowWithEip1193Provider extends Omit<
  Window,
  'ethereum' | 'keplr'
> {
  rainbow: BrowserEip1993Provider
  rabby: BrowserEip1993Provider
  ethereum: BrowserEip1993Provider
  okxwallet: BrowserEip1993Provider
  providers: BrowserEip1993Provider[]
  trustWallet?: BrowserEip1993Provider
  bitkeep: { ethereum: BrowserEip1993Provider }
  phantom?: { ethereum?: BrowserEip1993Provider }
  keplr?: { ethereum?: BrowserEip1993Provider }
}

export interface EIP6963ProviderInfo {
  rdns: string
  uuid: string
  name: string
  icon: string
}

export interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo
  provider: BrowserEip1993Provider
}

export type EIP6963AnnounceProviderEvent = {
  detail: EIP6963ProviderDetail
}
