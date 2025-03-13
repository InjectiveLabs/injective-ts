import { ChainErrorModule } from '@injectivelabs/exceptions'

export * from './gov.js'
export * from './auth.js'
export * from './bank.js'
export * from './mint.js'
export * from './wasm.js'
export * from './authZ.js'
export * from './peggy.js'
export * from './oracle.js'
export * from './auction.js'
export * from './staking.js'
export * from './exchange.js'
export * from './auth-rest.js'
export * from './bank-rest.js'
export * from './insurance.js'
export * from './distribution.js'
export * from './tokenfactory.js'
export * from './tendermint-rest.js'
export * from './permissions.js'

export interface RestApiResponse<T> {
  data: T
}

export const ChainModule = { ...ChainErrorModule }
