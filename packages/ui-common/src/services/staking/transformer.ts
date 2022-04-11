import {
  GrpcDelegationDelegatorReward,
  GrpcDelegationResponse,
  GrpcReDelegationResponse,
  GrpcUnbondingDelegation,
  GrpcValidator,
  GrpcValidatorCommission,
  GrpcValidatorDescription,
} from '@injectivelabs/chain-consumer'
import { BigNumberInWei } from '@injectivelabs/utils'
import { DecCoin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { cosmosSdkDecToBigNumber } from '../../utils'
import {
  BondStatus,
  UiValidator,
  Validator,
  ValidatorCommission,
  ValidatorDescription,
  GrpcPool,
  Pool,
  UiDelegation,
  UiReDelegation,
  UiReward,
  UiUnBondingDelegation,
} from './types'
import { UI_MINIMAL_AMOUNT } from '../../constants'

export const grpcValidatorDescriptionToUiDescription = (
  description?: GrpcValidatorDescription,
): ValidatorDescription => ({
  moniker: description ? description.getMoniker() : '',
  identity: description ? description.getIdentity() : '',
  website: description ? description.getWebsite() : '',
  securityContact: description ? description.getSecurityContact() : '',
  details: description ? description.getDetails() : '',
})

export const grpcValidatorCommissionToUiCommission = (
  commission?: GrpcValidatorCommission,
): ValidatorCommission => {
  const commissionRates = commission ? commission.getCommissionRates() : null

  return {
    commissionRates: {
      rate: cosmosSdkDecToBigNumber(
        commissionRates ? commissionRates.getRate() : '0',
      ).toFixed(),
      maxRate: cosmosSdkDecToBigNumber(
        commissionRates ? commissionRates.getMaxRate() : '0',
      ).toFixed(),
      maxChangeRate: cosmosSdkDecToBigNumber(
        commissionRates ? commissionRates.getMaxChangeRate() : '0',
      ).toFixed(),
    },

    updateTime: commission
      ? new Date(commission.getUpdateTime()!.getSeconds())
      : new Date(),
  }
}

export const grpcValidatorStatusToUiStatus = (status: number) => {
  switch (status) {
    case 1:
      return BondStatus.UnBonded
    case 2:
      return BondStatus.UnBonding
    case 3:
      return BondStatus.Bonded
    default:
      return BondStatus.UnBonded
  }
}

export const grpcValidatorToValidator = (
  validator: GrpcValidator,
): Validator => ({
  operatorAddress: validator.getOperatorAddress(),
  jailed: validator.getJailed(),
  status: grpcValidatorStatusToUiStatus(validator.getStatus()),
  tokens: cosmosSdkDecToBigNumber(validator.getTokens()).toFixed(),
  delegatorShares: cosmosSdkDecToBigNumber(
    validator.getDelegatorShares(),
  ).toFixed(),
  description: grpcValidatorDescriptionToUiDescription(
    validator.getDescription(),
  ),
  unbondingHeight: validator.getUnbondingHeight(),
  unbondingTime: validator.getUnbondingTime(),
  commission: grpcValidatorCommissionToUiCommission(validator.getCommission()),
  minSelfDelegation: validator.getMinSelfDelegation(),
})

export const validatorsToUiValidators = (
  grpcValidators: GrpcValidator[],
): UiValidator[] =>
  grpcValidators.map((grpcValidator: GrpcValidator) => {
    const validator = grpcValidatorToValidator(grpcValidator)

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

export const grpcPoolToPool = (pool: GrpcPool | undefined): Pool => {
  if (!pool) {
    return {
      notBondedTokens: '0',
      bondedTokens: '0',
    }
  }

  return {
    notBondedTokens: cosmosSdkDecToBigNumber(
      pool.getNotBondedTokens(),
    ).toFixed(),
    bondedTokens: cosmosSdkDecToBigNumber(pool.getBondedTokens()).toFixed(),
  }
}

export const grpcDelegationToUiDelegation = (
  grpcDelegation: GrpcDelegationResponse[],
): UiDelegation[] =>
  grpcDelegation
    .map((grpcDelegator) => {
      const delegation = grpcDelegator.getDelegation()
      const balance = grpcDelegator.getBalance()

      return {
        delegation: {
          delegatorAddress: delegation ? delegation.getDelegatorAddress() : '',
          validatorAddress: delegation ? delegation.getValidatorAddress() : '',
          shares: cosmosSdkDecToBigNumber(
            delegation ? delegation.getShares() : 0,
          ).toFixed(),
        },
        balance: {
          denom: balance ? balance.getDenom() : '',
          amount: new BigNumberInWei(
            balance ? balance.getAmount() : 0,
          ).toFixed(),
        },
      }
    })
    .filter((delegation) =>
      new BigNumberInWei(delegation.balance.amount)
        .toBase()
        .gte(UI_MINIMAL_AMOUNT),
    )

export const grpcDelegationRewardToUiReward = (
  grpcRewards: GrpcDelegationDelegatorReward[],
): UiReward[] =>
  grpcRewards.map((grpcReward) => {
    const rewards = grpcReward.getRewardList().map((reward) => ({
      amount: cosmosSdkDecToBigNumber(reward.getAmount()).toFixed(),
      denom: reward.getDenom(),
    }))

    return {
      rewards,
      validatorAddress: grpcReward.getValidatorAddress(),
    }
  })

export const grpcDelegationRewardFromValidatorToUiReward = (
  grpcRewards: DecCoin[],
  validatorAddress: string,
): UiReward => {
  const rewards = grpcRewards.map((reward) => ({
    amount: cosmosSdkDecToBigNumber(reward.getAmount()).toFixed(),
    denom: reward.getDenom(),
  }))

  return {
    rewards,
    validatorAddress,
  }
}

export const grpcUnBondingDelegationsToUiUnBondingDelegations = (
  grpcUnBondingDelegations: GrpcUnbondingDelegation[],
): UiUnBondingDelegation[] =>
  grpcUnBondingDelegations
    .reduce((unbondingDelegations, grpcUnBondingDelegation) => {
      const entries = grpcUnBondingDelegation.getEntriesList()
      const mappedEntries = entries.map((entry) => ({
        delegatorAddress: grpcUnBondingDelegation
          ? grpcUnBondingDelegation.getDelegatorAddress()
          : '',
        validatorAddress: grpcUnBondingDelegation
          ? grpcUnBondingDelegation.getValidatorAddress()
          : '',
        creationHeight: entry.getCreationHeight(),
        completionTime: entry.getCompletionTime()!.getSeconds(),
        initialBalance: new BigNumberInWei(entry.getInitialBalance()).toFixed(),
        balance: new BigNumberInWei(entry.getBalance()).toFixed(),
      }))

      return [...unbondingDelegations, ...mappedEntries]
    }, [] as UiUnBondingDelegation[])
    .filter((delegation) =>
      new BigNumberInWei(delegation.balance).toBase().gte(UI_MINIMAL_AMOUNT),
    )

export const grpcReDelegationsToUiReDelegations = (
  grpcReDelegations: GrpcReDelegationResponse[],
): UiReDelegation[] =>
  grpcReDelegations
    .reduce((uiReDelegator, grpcReDelegation) => {
      const grpcRedelegation = grpcReDelegation.getRedelegation()!
      const entries = grpcReDelegation.getEntriesList()

      if (!grpcReDelegation) {
        return uiReDelegator
      }

      const uiRedelegations = entries.reduce((acc, redelegation) => {
        const entry = redelegation.getRedelegationEntry()

        return [
          ...acc,
          {
            delegation: {
              completionTime: entry
                ? entry.getCompletionTime()!.getSeconds()
                : 0,
              delegatorAddress: grpcRedelegation.getDelegatorAddress() || '',
              sourceValidatorAddress:
                grpcRedelegation.getValidatorSrcAddress() || '',
              destinationValidatorAddress:
                grpcRedelegation?.getValidatorDstAddress() || '',
            },
            balance: new BigNumberInWei(redelegation.getBalance()).toFixed(),
          },
        ]
      }, [] as UiReDelegation[])

      return [...uiReDelegator, ...uiRedelegations]
    }, [] as UiReDelegation[])
    .filter((delegation) =>
      new BigNumberInWei(delegation.balance).toBase().gte(UI_MINIMAL_AMOUNT),
    )

export class StakingTransformer {
  static validatorsToUiValidators = validatorsToUiValidators

  static grpcPoolToPool = grpcPoolToPool

  static grpcValidatorToValidator = grpcValidatorToValidator

  static grpcDelegationRewardToUiReward = grpcDelegationRewardToUiReward

  static grpcDelegationToUiDelegation = grpcDelegationToUiDelegation

  static grpcValidatorStatusToUiStatus = grpcValidatorStatusToUiStatus

  static grpcDelegationRewardFromValidatorToUiReward =
    grpcDelegationRewardFromValidatorToUiReward

  static grpcUnBondingDelegationsToUiUnBondingDelegations =
    grpcUnBondingDelegationsToUiUnBondingDelegations

  static grpcReDelegationsToUiReDelegations = grpcReDelegationsToUiReDelegations

  static grpcValidatorCommissionToUiCommission =
    grpcValidatorCommissionToUiCommission
}
