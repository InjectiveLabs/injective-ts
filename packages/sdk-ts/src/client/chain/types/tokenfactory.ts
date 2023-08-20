import { Coin } from '@injectivelabs/ts-types'

export interface TokenFactoryModuleParams {
  denomCreationFee: Coin[]
}

export interface TokenFactoryModuleState {
  denomCreationFee: Coin[]
  factoryDenoms: Denom[]
}

interface Denom {
  denom: string
  authorityMetadata: AuthorityMetadata
}

export interface AuthorityMetadata {
  admin: string | undefined
}
