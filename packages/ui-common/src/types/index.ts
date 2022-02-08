import { ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import { MetricProviderOptions } from '../providers/MetricsProvider'

export * from './metrics'
export * from './cosmos'
export * from './peggy'

export interface ServiceOptions {
  chainId: ChainId
  network: Network
  web3Strategy?: Web3Strategy
  endpoints: {
    exchangeApi: string
    sentryGrpcApi: string
    sentryHttpApi: string
  }
  metrics?: MetricProviderOptions
}

export interface BankServiceOptions extends ServiceOptions {
  web3Strategy: Web3Strategy
}

export interface TokenServiceOptions extends ServiceOptions {
  web3Strategy: Web3Strategy
}

export interface PeggyServiceOptions extends ServiceOptions {
  web3Strategy: Web3Strategy
}
