import Eip1993Provider from 'eip1193-provider'

export interface BrowserEip1993Provider extends Eip1993Provider {
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
