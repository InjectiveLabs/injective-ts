import { Coin } from '@injectivelabs/ts-types'
import { Pagination } from '../../../types/index.js'
import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import { BankModuleParams, Metadata, TotalSupply } from '../types/index.js'
import { grpcPaginationToPagination } from '../../../utils/pagination.js'
import { CosmosBankV1Beta1Bank, CosmosBankV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcBankTransformer {
  static metadataToMetadata(
    metadata: CosmosBankV1Beta1Bank.Metadata,
  ): Metadata {
    return metadata
  }

  static moduleParamsResponseToModuleParams(
    response: CosmosBankV1Beta1Query.QueryParamsResponse,
  ): BankModuleParams {
    const params = response.params!

    return {
      sendEnabledList: params.sendEnabled,
      defaultSendEnabled: params.defaultSendEnabled,
    }
  }

  static denomOwnersResponseToDenomOwners(
    response: CosmosBankV1Beta1Query.QueryDenomOwnersResponse,
  ): {
    denomOwners: { address: string; balance: Coin | undefined }[]
    pagination: Pagination
  } {
    const denomOwners = response.denomOwners
    const pagination = response.pagination

    return {
      denomOwners,
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static totalSupplyResponseToTotalSupply(
    response: CosmosBankV1Beta1Query.QueryTotalSupplyResponse,
  ): {
    supply: TotalSupply
    pagination: Pagination
  } {
    const balances = response.supply
    const pagination = response.pagination

    return {
      supply: balances.map(ChainGrpcCommonTransformer.grpcCoinToCoin),
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static denomsMetadataResponseToDenomsMetadata(
    response: CosmosBankV1Beta1Query.QueryDenomsMetadataResponse,
  ): {
    metadatas: Metadata[]
    pagination: Pagination
  } {
    const metadatas = response.metadatas
    const pagination = response.pagination

    return {
      metadatas: metadatas.map(ChainGrpcBankTransformer.metadataToMetadata),
      pagination: grpcPaginationToPagination(pagination),
    }
  }

  static balanceResponseToBalance(
    response: CosmosBankV1Beta1Query.QueryBalanceResponse,
  ): Coin {
    return ChainGrpcCommonTransformer.grpcCoinToCoin(response.balance!)
  }

  static balancesResponseToBalances(
    response: CosmosBankV1Beta1Query.QueryAllBalancesResponse,
  ): {
    balances: Coin[]
    pagination: Pagination
  } {
    const balances = response.balances
    const pagination = response.pagination

    return {
      balances: balances.map(ChainGrpcCommonTransformer.grpcCoinToCoin),
      pagination: grpcPaginationToPagination(pagination),
    }
  }
}
