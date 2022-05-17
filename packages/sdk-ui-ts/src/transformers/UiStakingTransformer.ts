import { GrpcValidator } from '@injectivelabs/sdk-ts/dist/client/chain/types/staking'
import { StakingGrpcTransformer } from '@injectivelabs/sdk-ts/dist/client/chain'
import { UiValidator } from '../types/staking'

export const validatorsToUiValidators = (
  grpcValidators: GrpcValidator[],
): UiValidator[] =>
  grpcValidators.map((grpcValidator: GrpcValidator) => {
    const validator =
      StakingGrpcTransformer.grpcValidatorToValidator(grpcValidator)

    return {
      jailed: validator.jailed,
      status: validator.status,
      unbondingTime: validator.unbondingTime.getSeconds(),
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

export class UiStakingTransformer {
  static validatorsToUiValidators = validatorsToUiValidators
}
