import Eip1993Provider from 'eip1193-provider'
import { ChainId } from '@injectivelabs/ts-types'

export * from './enums'
export * from './strategy'

export interface Eip1993ProviderWithMetamask extends Eip1993Provider {
  isMetaMask: boolean
}

export interface WindowWithEip1193Provider extends Window {
  ethereum: Eip1993ProviderWithMetamask
}

export interface ConcreteStrategyOptions {
  privateKey?: string
  rpcUrls: Record<ChainId, string>
  wsRpcUrls: Record<ChainId, string>
  pollingInterval: number
}
