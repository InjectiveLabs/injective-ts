import { Network } from '@injectivelabs/networks'
import { ChainId } from '@injectivelabs/ts-types'
import { MetricsProvider } from '../../classes/MetricsProvider'

export interface ApiOptionsEndpoints {
  indexerApi: string
  sentryGrpcApi: string
  sentryHttpApi: string
}

export interface ApiOptions {
  chainId: ChainId
  network: Network
  metricsProvider?: MetricsProvider
  endpoints: ApiOptionsEndpoints
}

export * from './account'
export * from './bank'
export * from './common'
export * from './derivatives'
export * from './explorer-rest'
export * from './markets-history-rest'
export * from './metrics'
export * from './spot'
export * from './staking'
