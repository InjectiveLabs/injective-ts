import Eip1993Provider from 'eip1193-provider'
import { ChainId } from '@injectivelabs/ts-types'
import HDNode from 'hdkey'
import { Wallet } from './enums'
import { ConcreteStrategyOptions } from './strategy'

export * from './enums'
export * from './strategy'

export interface Eip1993ProviderWithMetamask extends Eip1993Provider {
  removeAllListeners(): void
  isMetaMask: boolean
}

export interface WindowWithEip1193Provider extends Window {
  ethereum: Eip1993ProviderWithMetamask
}

export interface WindowWithLedgerSupport extends Window {
  Websocket?: any
}

export interface Web3StrategyArguments {
  chainId: ChainId
  wallet: Wallet
  options: ConcreteStrategyOptions
}

export interface LedgerWalletInfo {
  address: string
  baseDerivationPath: string
  derivationPath: string
  hdKey: HDNode
}
