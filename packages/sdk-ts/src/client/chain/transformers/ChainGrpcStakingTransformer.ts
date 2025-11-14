import { toBigNumber, toHumanReadable } from '@injectivelabs/utils'
import { BondStatus } from '../types/staking.js'
import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import {
  protobufTimestampToDate,
  protobufTimestampToUnixSeconds,
} from '../../../utils/time.js'
import type * as CosmosStakingV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/query_pb'
import type { Pagination } from '../../../types/index.js'
import type {
  Pool,
  Validator,
  Delegation,
  ReDelegation,
  GrpcValidator,
  ValidatorCommission,
  UnBondingDelegation,
  StakingModuleParams,
  ValidatorDescription,
  GrpcValidatorCommission,
  GrpcValidatorDescription,
  GrpcUnbondingDelegationEntry,
  GrpcReDelegationEntryResponse,
} from '../types/staking.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcStakingTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosStakingV1Beta1QueryPb.QueryParamsResponse,
  ): StakingModuleParams {
    const params = response.params

    return {
      unbondingTime: protobufTimestampToUnixSeconds(params!.unbondingTime),
      minCommissionRate: params!.minCommissionRate,
      maxValidators: params!.maxValidators,
      maxEntries: params!.maxEntries,
      historicalEntries: params!.historicalEntries,
      bondDenom: params!.bondDenom,
    }
  }

  static validatorResponseToValidator(
    response: CosmosStakingV1Beta1QueryPb.QueryValidatorResponse,
  ): Validator {
    return ChainGrpcStakingTransformer.grpcValidatorToValidator(
      response.validator!,
    )
  }

  static validatorsResponseToValidators(
    response: CosmosStakingV1Beta1QueryPb.QueryValidatorsResponse,
  ): {
    validators: Validator[]
    pagination: Pagination
  } {
    const validators = response.validators.map((validator) =>
      ChainGrpcStakingTransformer.grpcValidatorToValidator(validator),
    )

    return {
      validators,
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination!,
      ),
    }
  }

  static delegationResponseToDelegation(
    response: CosmosStakingV1Beta1QueryPb.QueryDelegationResponse,
  ): Delegation {
    const grpcDelegation = response.delegationResponse!
    const delegation = grpcDelegation.delegation
    const balance = grpcDelegation.balance

    return {
      delegation: {
        delegatorAddress: delegation ? delegation.delegatorAddress : '',
        validatorAddress: delegation ? delegation.validatorAddress : '',
        shares: toHumanReadable(delegation ? delegation.shares : 0).toFixed(),
      },
      balance: {
        denom: balance ? balance.denom : '',
        amount: toBigNumber(balance ? balance.amount : 0).toFixed(),
      },
    }
  }

  static delegationsResponseToDelegations(
    response: CosmosStakingV1Beta1QueryPb.QueryDelegatorDelegationsResponse,
  ): { delegations: Delegation[]; pagination: Pagination } {
    const grpcDelegations = response.delegationResponses

    const delegations = grpcDelegations.map((grpcDelegator) => {
      const delegation = grpcDelegator.delegation
      const balance = grpcDelegator.balance

      return {
        delegation: {
          delegatorAddress: delegation ? delegation.delegatorAddress : '',
          validatorAddress: delegation ? delegation.validatorAddress : '',
          shares: toHumanReadable(delegation ? delegation.shares : 0).toFixed(),
        },
        balance: {
          denom: balance ? balance.denom : '',
          amount: toBigNumber(balance ? balance.amount : 0).toFixed(),
        },
      }
    })

    return {
      delegations,
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }

  static unBondingDelegationsResponseToUnBondingDelegations(
    response: CosmosStakingV1Beta1QueryPb.QueryDelegatorUnbondingDelegationsResponse,
  ): {
    unbondingDelegations: UnBondingDelegation[]
    pagination: Pagination
  } {
    const grpcUnbondingDelegations = response.unbondingResponses

    const unbondingDelegations = grpcUnbondingDelegations.reduce(
      (
        unbondingDelegations: UnBondingDelegation[],
        grpcUnBondingDelegation,
      ) => {
        const entries = grpcUnBondingDelegation.entries

        const mappedEntries = entries.map(
          (entry: GrpcUnbondingDelegationEntry) => ({
            delegatorAddress: grpcUnBondingDelegation
              ? grpcUnBondingDelegation.delegatorAddress
              : '',
            validatorAddress: grpcUnBondingDelegation
              ? grpcUnBondingDelegation.validatorAddress
              : '',
            creationHeight: parseInt(entry.creationHeight.toString(), 10),
            completionTime: protobufTimestampToUnixSeconds(
              entry.completionTime,
            ),
            initialBalance: toBigNumber(entry.initialBalance).toFixed(),
            balance: toBigNumber(entry.balance).toFixed(),
          }),
        )

        return [...unbondingDelegations, ...mappedEntries]
      },
      [] as UnBondingDelegation[],
    )

    return {
      unbondingDelegations,
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }

  static reDelegationsResponseToReDelegations(
    response: CosmosStakingV1Beta1QueryPb.QueryRedelegationsResponse,
  ): { redelegations: ReDelegation[]; pagination: Pagination } {
    const grpcReDelegations = response.redelegationResponses

    const redelegations = grpcReDelegations.reduce(
      (uiReDelegator: ReDelegation[], grpcReDelegationCurrent) => {
        const grpcRedelegation = grpcReDelegationCurrent.redelegation

        if (!grpcRedelegation) {
          return uiReDelegator
        }

        const uiRedelegations = grpcReDelegationCurrent.entries.reduce(
          (acc: ReDelegation[], entry: GrpcReDelegationEntryResponse) => {
            return [
              ...acc,
              {
                delegation: {
                  completionTime: protobufTimestampToUnixSeconds(
                    entry.redelegationEntry?.completionTime,
                  ),
                  delegatorAddress: grpcRedelegation.delegatorAddress || '',
                  sourceValidatorAddress:
                    grpcRedelegation.validatorSrcAddress || '',
                  destinationValidatorAddress:
                    grpcRedelegation?.validatorDstAddress || '',
                },
                balance: toBigNumber(entry.balance).toFixed(),
              },
            ]
          },
          [] as ReDelegation[],
        )

        return [...uiReDelegator, ...uiRedelegations]
      },
      [] as ReDelegation[],
    )

    return {
      redelegations,
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }

  static grpcValidatorToValidator(validator: GrpcValidator): Validator {
    return {
      operatorAddress: validator.operatorAddress,
      jailed: validator.jailed,
      status: ChainGrpcStakingTransformer.grpcValidatorStatusToStatus(
        validator.status,
      ),
      tokens: toHumanReadable(validator.tokens).toFixed(),
      delegatorShares: toHumanReadable(validator.delegatorShares).toFixed(),
      description:
        ChainGrpcStakingTransformer.grpcValidatorDescriptionToDescription(
          validator.description,
        ),
      unbondingHeight: Number(validator.unbondingHeight),
      unbondingTime: validator.unbondingTime,
      commission:
        ChainGrpcStakingTransformer.grpcValidatorCommissionToCommission(
          validator.commission,
        ),
      minSelfDelegation: validator.minSelfDelegation,
    }
  }

  static poolResponseToPool(
    response: CosmosStakingV1Beta1QueryPb.QueryPoolResponse,
  ): Pool {
    const pool = response.pool

    if (!pool) {
      return {
        notBondedTokens: '0',
        bondedTokens: '0',
      }
    }

    return {
      notBondedTokens: toHumanReadable(pool.notBondedTokens).toFixed(),
      bondedTokens: toHumanReadable(pool.bondedTokens).toFixed(),
    }
  }

  static grpcValidatorDescriptionToDescription(
    description?: GrpcValidatorDescription,
  ): ValidatorDescription {
    return {
      moniker: description ? description.moniker : '',
      identity: description ? description.identity : '',
      website: description ? description.website : '',
      securityContact: description ? description.securityContact : '',
      details: description ? description.details : '',
    }
  }

  static grpcValidatorCommissionToCommission(
    commission?: GrpcValidatorCommission,
  ): ValidatorCommission {
    const commissionRates = commission ? commission.commissionRates : null

    return {
      commissionRates: {
        rate: toHumanReadable(
          commissionRates ? commissionRates.rate : '0',
        ).toFixed(),
        maxRate: toHumanReadable(
          commissionRates ? commissionRates.maxRate : '0',
        ).toFixed(),
        maxChangeRate: toHumanReadable(
          commissionRates ? commissionRates.maxChangeRate : '0',
        ).toFixed(),
      },
      updateTime: protobufTimestampToDate(commission?.updateTime) ?? new Date(),
    }
  }

  static grpcValidatorStatusToStatus(status: number) {
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
}
