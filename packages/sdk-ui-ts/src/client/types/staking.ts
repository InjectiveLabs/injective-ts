import {
  BondStatus,
  ValidatorCommission,
  ValidatorDescription,
} from '@injectivelabs/sdk-ts'

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
