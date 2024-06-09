import { Validator } from '@injectivelabs/sdk-ts'
import { UiValidator } from '../types/staking'

export class UiStakingTransformer {
  static validatorsToUiValidators(validators: Validator[]): UiValidator[] {
    return validators.map((validator: Validator) => {
      return {
        jailed: validator.jailed,
        status: validator.status,
        unbondingTime: Math.floor(validator.unbondingTime.getTime() / 1000),
        delegatorShares: validator.delegatorShares,
        tokens: validator.tokens,
        unbondingHeight: validator.unbondingHeight,
        commissionRate: validator.commission.commissionRates.rate,
        commission: validator.commission,
        description: validator.description,
        name: validator.description.moniker,
        address: validator.operatorAddress,
      }
    })
  }
}
