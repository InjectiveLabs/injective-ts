import { Coin } from '@injectivelabs/ts-types'

export interface TokenFactoryModuleParams {
  denomCreationFee: Coin[]
}

export interface TokenFactoryModuleState {
  denomCreationFee: Coin[]
  factoryDenoms: FactoryDenomWithMetadata[]
}

export interface FactoryDenomWithMetadata {
  denom: string
  authorityMetadata: AuthorityMetadata
}

export interface AuthorityMetadata {
  admin: string | undefined
}
