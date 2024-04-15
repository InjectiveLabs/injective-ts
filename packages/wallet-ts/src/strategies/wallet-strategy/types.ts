import Eip1993Provider from 'eip1193-provider'
import type HDNode from 'hdkey'
import { ChainId } from '@injectivelabs/ts-types'

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

export interface SendTransactionOptions {
  address: string
  chainId: ChainId
  txTimeout?: number
  endpoints: {
    rest: string
    grpc: string
    tm?: string
  }
}
