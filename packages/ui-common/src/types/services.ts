import { ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import type { Web3Strategy } from '@injectivelabs/web3-strategy'
import type { TxProvider } from '../providers/TxProvider'
import type { MetricsProvider } from '../providers/MetricsProvider'

export * from '../services/peggy/types'
export * from '../services/bank/types'
export * from '../services/bridge/types'
export * from '../services/derivative/types'
export * from '../services/gas/types'
export * from '../services/spot/types'
export * from '../services/subaccount/types'
export * from '../services/token/types'

export interface ServiceOptionsEndpoints {
  exchangeApi: string
  sentryGrpcApi: string
  sentryHttpApi: string
}

export interface ServiceOptions {
  chainId: ChainId
  network: Network
  metricsProvider?: MetricsProvider
  endpoints?: ServiceOptionsEndpoints
}

export interface ServiceActionOptions {
  options: ServiceOptions
  txProvider: TxProvider
}

export interface ServiceWeb3ActionOptions {
  options: ServiceOptions
  web3Strategy: Web3Strategy
}
