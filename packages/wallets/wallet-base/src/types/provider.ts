import type { EIP1193Provider } from 'eip1193-provider'

export interface BrowserEip1993Provider extends EIP1193Provider {
  removeAllListeners(): void
  isTrust: boolean
  isKeplr: boolean
  isRabby: boolean
  isRainbow: boolean
  isPhantom: boolean
  isMetaMask: boolean
  isOkxWallet: boolean
  isTrustWallet: boolean
}

// Use Omit to avoid conflict with viem's stricter Window.ethereum type
export interface WindowWithEip1193Provider extends Omit<Window, 'ethereum'> {
  rainbow: BrowserEip1993Provider
  rabby: BrowserEip1993Provider
  ethereum: BrowserEip1993Provider
  okxwallet: BrowserEip1993Provider
  providers: BrowserEip1993Provider[]
  trustWallet?: BrowserEip1993Provider
  bitkeep: { ethereum: BrowserEip1993Provider }
  phantom?: { ethereum?: BrowserEip1993Provider }
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
