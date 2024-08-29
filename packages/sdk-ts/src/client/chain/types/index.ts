import { ChainErrorModule } from '@injectivelabs/exceptions'

export * from './gov'
export * from './auth'
export * from './bank'
export * from './mint'
export * from './wasm'
export * from './authZ'
export * from './peggy'
export * from './oracle'
export * from './auction'
export * from './staking'
export * from './exchange'
export * from './auth-rest'
export * from './bank-rest'
export * from './insurance'
export * from './distribution'
export * from './tokenfactory'
export * from './tendermint-rest'
export * from './permissions'

export interface RestApiResponse<T> {
  data: T
}

export const ChainModule = { ...ChainErrorModule }
