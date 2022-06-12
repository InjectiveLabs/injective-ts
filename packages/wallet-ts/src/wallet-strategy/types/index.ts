import Eip1993Provider from 'eip1193-provider'
import { EthereumChainId, ChainId } from '@injectivelabs/ts-types'
import HDNode from 'hdkey'
import { Wallet } from './enums'
import { WalletOptions } from './strategy'

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

export interface WalletStrategyArguments {
  ethereumChainId: EthereumChainId
  chainId: ChainId
  wallet?: Wallet
  options: WalletOptions
}

export interface LedgerWalletInfo {
  address: string
  baseDerivationPath: string
  derivationPath: string
  hdKey: HDNode
}

export interface TrezorWalletInfo {
  address: string
  hdKey: HDNode
  derivationPath: string
}
