import { ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { Web3Strategy } from '@injectivelabs/web3-strategy'

export * from './metrics'
export * from './cosmos'
export * from './common'
export * from '../peggy/types'
export * from '../bank/types'
export * from '../bridge/types'
export * from '../derivative/types'
export * from '../gas/types'
export * from '../spot/types'
export * from '../subaccount/types'
export * from '../token/types'

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
