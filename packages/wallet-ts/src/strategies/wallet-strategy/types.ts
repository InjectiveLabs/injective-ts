import Eip1993Provider from 'eip1193-provider'
import HDNode from 'hdkey'

export interface BrowserEip1993Provider extends Eip1993Provider {
  removeAllListeners(): void
  isMetaMask: boolean
  isTrust: boolean
}

export interface WindowWithEip1193Provider extends Window {
  ethereum: BrowserEip1993Provider
  providers: BrowserEip1993Provider[]
  trustWallet?: BrowserEip1993Provider
}

export interface WindowWithLedgerSupport extends Window {
  Websocket?: any
}

export interface LedgerWalletInfo {
  address: string
  baseDerivationPath: string
  derivationPath: string
  hdKey?: HDNode
  publicKey?: string
}

export interface TrezorWalletInfo {
  address: string
  hdKey: HDNode
  derivationPath: string
}

export enum LedgerDerivationPathType {
  LedgerLive = 'ledger-live',
  LedgerMew = 'ledger-mew',
}
