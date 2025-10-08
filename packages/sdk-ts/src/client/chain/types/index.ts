import { ChainErrorModule } from '@injectivelabs/exceptions'

export * from './gov.js'
export * from './wasm.js'
export * from './staking.js'
export * from './exchange.js'
export type * from './evm.js'
export type * from './auth.js'
export type * from './bank.js'
export type * from './mint.js'
export * from './insurance.js'
export type * from './authZ.js'
export type * from './peggy.js'
export type * from './erc20.js'
export type * from './txFees.js'
export type * from './oracle.js'
export * from './permissions.js'
export type * from './auction.js'
export type * from './auth-rest.js'
export type * from './bank-rest.js'
export type * from './distribution.js'
export type * from './tokenfactory.js'
export type * from './tendermint-rest.js'

export interface RestApiResponse<T> {
  data: T
}

export const ChainModule = { ...ChainErrorModule }
