import Eip1993Provider from 'eip1193-provider'
import { EthereumChainId, ChainId } from '@injectivelabs/ts-types'
import HDNode from 'hdkey'
import Web3 from 'web3'
import { Wallet } from '../../types/enums'

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

export interface WalletStrategyEthereumOptions {
  ethereumChainId: EthereumChainId
  rpcUrl: string
  wsRpcUrl: string
}

export interface EthereumWalletStrategyArgs {
  chainId: ChainId
  ethereumOptions: WalletStrategyEthereumOptions
  web3: Web3
}

export interface WalletStrategyArguments {
  chainId: ChainId
  ethereumOptions?: WalletStrategyEthereumOptions
  disabledWallets?: Wallet[]
  wallet?: Wallet
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
