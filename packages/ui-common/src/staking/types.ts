import { Pool as GrpcPool } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/staking_pb'

export interface UiDelegation {
  delegation: {
    delegatorAddress: string
    validatorAddress: string
    shares: string // BigNumberInWei
  }
  balance: {
    denom: string
    amount: string // BigNumberInBase
  }
}

export interface UiReDelegation {
  delegation: {
    delegatorAddress: string
    sourceValidatorAddress: string
    completionTime: number
    destinationValidatorAddress: string
  }
  balance: string // BigNumberInBase
}

export interface UiUnBondingDelegation {
  delegatorAddress: string
  validatorAddress: string
  creationHeight: number
  completionTime: number
  initialBalance: string // BigNumberInWei
  balance: string // BigNumberInWei
}

export interface UiReward {
  validatorAddress: string
  rewards: {
    denom: string
    amount: string // BigNumberInWei
  }[]
}

export interface Pool {
  notBondedTokens: string
  bondedTokens: string
}

export enum BondStatus {
  UnBonded = 'UnBonded',
  UnBonding = 'UnBonding',
  Bonded = 'Bonded',
}

export interface ValidatorDescription {
  moniker: string
  identity: string
  website: string
  securityContact: string
  details: string
}

export interface ValidatorCommission {
  commissionRates: {
    rate: string
    maxRate: string
    maxChangeRate: string
  }
  updateTime: Date
}

export interface Validator {
  operatorAddress: string
  consensusPubKey?: string
  jailed: boolean
  status: BondStatus
  tokens: string
  delegatorShares: string
  description: ValidatorDescription
  unbondingHeight: number
  unbondingTime: any
  commission: ValidatorCommission
  minSelfDelegation: string
}

export interface UiValidator {
  jailed: boolean
  status: BondStatus
  unbondingTime: number
  unbondingHeight: number
  commissionRate: string
  delegatorShares: string
  tokens: string
  description: ValidatorDescription
  commission: ValidatorCommission
  name: string
  address: string
}

export { GrpcPool }
