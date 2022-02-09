import { ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import { MetricsProvider } from '../providers/MetricsProvider'

export * from './metrics'
export * from './cosmos'
export * from './common'
export * from './peggy'

export interface ServiceOptions {
  chainId: ChainId
  network: Network
  metricsProvider: MetricsProvider
  endpoints: {
    exchangeApi: string
    sentryGrpcApi: string
    sentryHttpApi: string
  }
}

export interface ServiceActionOptions extends ServiceOptions {
  web3Strategy: Web3Strategy
}
