import { ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { Web3Strategy } from '@injectivelabs/web3-strategy'

export * from './metrics'
export * from './cosmos'
export * from './common'
export * from './peggy'

export interface ServiceOptionsEndpoints {
  exchangeApi: string
  sentryGrpcApi: string
  sentryHttpApi: string
}

export interface ServiceOptions {
  chainId: ChainId
  network: Network
  metrics:
    | {
        region: string
      }
    | undefined
  endpoints?: ServiceOptionsEndpoints
}

export interface ServiceActionOptions {
  options: ServiceOptions
  web3Strategy: Web3Strategy
}
