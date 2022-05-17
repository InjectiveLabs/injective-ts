import { Network } from '@injectivelabs/networks'
import { ChainId } from '@injectivelabs/ts-types'
import { MetricsProvider } from '../classes/MetricsProvider'

export interface ApiOptionsEndpoints {
  exchangeApi: string
  sentryGrpcApi: string
  sentryHttpApi: string
}

export interface ApiOptions {
  chainId: ChainId
  network: Network
  metricsProvider?: MetricsProvider
  endpoints: ApiOptionsEndpoints
}
