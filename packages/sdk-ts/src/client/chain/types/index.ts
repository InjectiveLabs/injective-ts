import { ChainErrorModule } from '@injectivelabs/exceptions'

export * from './auth'
export * from './authZ'
export * from './auction'
export * from './auth-rest'
export * from './bank-rest'
export * from './tendermint-rest'
export * from './bank'
export * from './distribution'
export * from './exchange'
export * from './gov'
export * from './insurance'
export * from './mint'
export * from './oracle'
export * from './peggy'
export * from './staking'
export * from './wasm'

export interface RestApiResponse<T> {
  data: T
}

export const ChainModule = { ...ChainErrorModule }
