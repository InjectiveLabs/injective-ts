import { BigNumberInWei } from '@injectivelabs/utils'
import {
  QueryDelegatorDelegationsResponse,
  QueryDelegatorUnbondingDelegationsResponse,
  QueryRedelegationsResponse,
  QueryValidatorsResponse,
  QueryDelegationResponse,
  QueryValidatorResponse,
  QueryParamsResponse as QueryStakingParamsResponse,
  QueryPoolResponse,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/query_pb'
import {
  GrpcValidator,
  GrpcValidatorCommission,
  GrpcValidatorDescription,
  BondStatus,
  Validator,
  ValidatorCommission,
  ValidatorDescription,
  Delegation,
  UnBondingDelegation,
  ReDelegation,
  Pool,
  StakingModuleParams,
} from '../types/staking'
import { cosmosSdkDecToBigNumber, DUST_AMOUNT } from '../../../utils'
import { grpcPaginationToPagination } from '../../../utils/pagination'
import { Pagination } from '../../../types/index'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcStakingTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryStakingParamsResponse,
  ): StakingModuleParams {
    const params = response.getParams()!

    return {
      unbondingTime: params.getUnbondingTime()!.getSeconds(),
      maxValidators: params.getMaxValidators(),
      maxEntries: params.getMaxEntries(),
      historicalEntries: params.getHistoricalEntries(),
      bondDenom: params.getBondDenom(),
    }
  }

  static validatorResponseToValidator(
    response: QueryValidatorResponse,
  ): Validator {
    return ChainGrpcStakingTransformer.grpcValidatorToValidator(
      response.getValidator()!,
    )
  }

  static validatorsResponseToValidators(response: QueryValidatorsResponse): {
    validators: Validator[]
    pagination: Pagination
  } {
    const validators = response
      .getValidatorsList()
      .map((validator) =>
        ChainGrpcStakingTransformer.grpcValidatorToValidator(validator),
      )

    return {
      validators,
      pagination: grpcPaginationToPagination(response.getPagination()!),
    }
  }

  static delegationResponseToDelegation(
    response: QueryDelegationResponse,
  ): Delegation {
    const grpcDelegation = response.getDelegationResponse()!
    const delegation = grpcDelegation.getDelegation()
    const balance = grpcDelegation.getBalance()

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
        amount: new BigNumberInWei(balance ? balance.getAmount() : 0).toFixed(),
      },
    }
  }

  static delegationsResponseToDelegations(
    response: QueryDelegatorDelegationsResponse,
  ): { delegations: Delegation[]; pagination: Pagination } {
    const grpcDelegations = response.getDelegationResponsesList()

    const delegations = grpcDelegations
      .map((grpcDelegator) => {
        const delegation = grpcDelegator.getDelegation()
        const balance = grpcDelegator.getBalance()

        return {
          delegation: {
            delegatorAddress: delegation
              ? delegation.getDelegatorAddress()
              : '',
            validatorAddress: delegation
              ? delegation.getValidatorAddress()
              : '',
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

    return {
      delegations,
      pagination: grpcPaginationToPagination(response.getPagination()),
    }
  }

  static unBondingDelegationsResponseToUnBondingDelegations(
    response: QueryDelegatorUnbondingDelegationsResponse,
  ): {
    unbondingDelegations: UnBondingDelegation[]
    pagination: Pagination
  } {
    const grpcUnbondingDelegations = response.getUnbondingResponsesList()

    const unbondingDelegations = grpcUnbondingDelegations
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
          initialBalance: new BigNumberInWei(
            entry.getInitialBalance(),
          ).toFixed(),
          balance: new BigNumberInWei(entry.getBalance()).toFixed(),
        }))

        return [...unbondingDelegations, ...mappedEntries]
      }, [] as UnBondingDelegation[])
      .filter((delegation) =>
        new BigNumberInWei(delegation.balance).toBase().gte(DUST_AMOUNT),
      )

    return {
      unbondingDelegations,
      pagination: grpcPaginationToPagination(response.getPagination()),
    }
  }

  static reDelegationsResponseToReDelegations(
    response: QueryRedelegationsResponse,
  ): { redelegations: ReDelegation[]; pagination: Pagination } {
    const grpcReDelegations = response.getRedelegationResponsesList()

    const redelegations = grpcReDelegations
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

    return {
      redelegations,
      pagination: grpcPaginationToPagination(response.getPagination()),
    }
  }

  static grpcValidatorToValidator(validator: GrpcValidator): Validator {
    return {
      operatorAddress: validator.getOperatorAddress(),
      jailed: validator.getJailed(),
      status: ChainGrpcStakingTransformer.grpcValidatorStatusToStatus(
        validator.getStatus(),
      ),
      tokens: cosmosSdkDecToBigNumber(validator.getTokens()).toFixed(),
      delegatorShares: cosmosSdkDecToBigNumber(
        validator.getDelegatorShares(),
      ).toFixed(),
      description:
        ChainGrpcStakingTransformer.grpcValidatorDescriptionToDescription(
          validator.getDescription(),
        ),
      unbondingHeight: validator.getUnbondingHeight(),
      unbondingTime: validator.getUnbondingTime(),
      commission:
        ChainGrpcStakingTransformer.grpcValidatorCommissionToCommission(
          validator.getCommission(),
        ),
      minSelfDelegation: validator.getMinSelfDelegation(),
    }
  }

  static poolResponseToPool(response: QueryPoolResponse): Pool {
    const pool = response.getPool()

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

  static grpcValidatorDescriptionToDescription(
    description?: GrpcValidatorDescription,
  ): ValidatorDescription {
    return {
      moniker: description ? description.getMoniker() : '',
      identity: description ? description.getIdentity() : '',
      website: description ? description.getWebsite() : '',
      securityContact: description ? description.getSecurityContact() : '',
      details: description ? description.getDetails() : '',
    }
  }

  static grpcValidatorCommissionToCommission(
    commission?: GrpcValidatorCommission,
  ): ValidatorCommission {
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
