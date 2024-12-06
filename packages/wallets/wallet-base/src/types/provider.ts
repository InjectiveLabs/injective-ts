import { type EIP1193Provider } from 'eip1193-provider'

export interface BrowserEip1993Provider extends EIP1193Provider {
  removeAllListeners(): void
  isMetaMask: boolean
  isTrustWallet: boolean
  isTrust: boolean
  isOkxWallet: boolean
  isPhantom: boolean
}

export interface WindowWithEip1193Provider extends Window {
  ethereum: BrowserEip1993Provider
  okxwallet: BrowserEip1993Provider
  bitkeep: { ethereum: BrowserEip1993Provider }
  providers: BrowserEip1993Provider[]
  trustWallet?: BrowserEip1993Provider
  phantom?: { ethereum?: BrowserEip1993Provider }
}
