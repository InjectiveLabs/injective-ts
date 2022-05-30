import { BigNumberInWei } from '@injectivelabs/utils'
import { GrpcCoin } from '../../../types/index'
import { GrpcDelegationDelegatorReward } from '../types/distribution'
import {
  GrpcDelegationResponse,
  GrpcReDelegationResponse,
  GrpcUnbondingDelegation,
  GrpcValidator,
  GrpcValidatorCommission,
  GrpcValidatorDescription,
  BondStatus,
  GrpcPool,
  Validator,
  ValidatorCommission,
  ValidatorDescription,
  Delegation,
  Reward,
  UnBondingDelegation,
  ReDelegation,
  Pool,
} from '../types/staking'
import { cosmosSdkDecToBigNumber, DUST_AMOUNT } from '../../../utils'

export const grpcValidatorDescriptionToDescription = (
  description?: GrpcValidatorDescription,
): ValidatorDescription => ({
  moniker: description ? description.getMoniker() : '',
  identity: description ? description.getIdentity() : '',
  website: description ? description.getWebsite() : '',
  securityContact: description ? description.getSecurityContact() : '',
  details: description ? description.getDetails() : '',
})

export const grpcValidatorCommissionToCommission = (
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

export const grpcValidatorStatusToStatus = (status: number) => {
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
  status: grpcValidatorStatusToStatus(validator.getStatus()),
  tokens: cosmosSdkDecToBigNumber(validator.getTokens()).toFixed(),
  delegatorShares: cosmosSdkDecToBigNumber(
    validator.getDelegatorShares(),
  ).toFixed(),
  description: grpcValidatorDescriptionToDescription(
    validator.getDescription(),
  ),
  unbondingHeight: validator.getUnbondingHeight(),
  unbondingTime: validator.getUnbondingTime(),
  commission: grpcValidatorCommissionToCommission(validator.getCommission()),
  minSelfDelegation: validator.getMinSelfDelegation(),
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

export const grpcDelegationToDelegation = (
  grpcDelegation: GrpcDelegationResponse[],
): Delegation[] =>
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
      new BigNumberInWei(delegation.balance.amount).toBase().gte(DUST_AMOUNT),
    )

export const grpcDelegationRewardToReward = (
  grpcRewards: GrpcDelegationDelegatorReward[],
): Reward[] =>
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

export const grpcDelegationRewardFromValidatorToReward = (
  grpcRewards: GrpcCoin[],
  validatorAddress: string,
): Reward => {
  const rewards = grpcRewards.map((reward) => ({
    amount: cosmosSdkDecToBigNumber(reward.getAmount()).toFixed(),
    denom: reward.getDenom(),
  }))

  return {
    rewards,
    validatorAddress,
  }
}

export const grpcUnBondingDelegationsToUnBondingDelegations = (
  grpcUnBondingDelegations: GrpcUnbondingDelegation[],
): UnBondingDelegation[] =>
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
    }, [] as UnBondingDelegation[])
    .filter((delegation) =>
      new BigNumberInWei(delegation.balance).toBase().gte(DUST_AMOUNT),
    )

export const grpcReDelegationsToReDelegations = (
  grpcReDelegations: GrpcReDelegationResponse[],
): ReDelegation[] =>
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
      }, [] as ReDelegation[])

      return [...uiReDelegator, ...uiRedelegations]
    }, [] as ReDelegation[])
    .filter((delegation) =>
      new BigNumberInWei(delegation.balance).toBase().gte(DUST_AMOUNT),
    )

export class ChainGrpcStakingTransformer {
  static grpcPoolToPool = grpcPoolToPool

  static grpcValidatorToValidator = grpcValidatorToValidator

  static grpcDelegationRewardToReward = grpcDelegationRewardToReward

  static grpcDelegationToDelegation = grpcDelegationToDelegation

  static grpcValidatorStatusToStatus = grpcValidatorStatusToStatus

  static grpcDelegationRewardFromValidatorToReward =
    grpcDelegationRewardFromValidatorToReward

  static grpcUnBondingDelegationsToUnBondingDelegations =
    grpcUnBondingDelegationsToUnBondingDelegations

  static grpcReDelegationsToReDelegations = grpcReDelegationsToReDelegations

  static grpcValidatorCommissionToCommission =
    grpcValidatorCommissionToCommission
}
