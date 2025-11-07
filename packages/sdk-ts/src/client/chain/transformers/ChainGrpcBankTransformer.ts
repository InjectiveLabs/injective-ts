import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type { Coin } from '@injectivelabs/ts-types'
import type * as CosmosBankV1Beta1BankPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/bank_pb.mjs'
import type * as CosmosBankV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/query_pb.mjs'
import type { Pagination } from '../../../types/index.js'
import type { Metadata, TotalSupply, BankModuleParams } from '../types/index.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcBankTransformer {
  static metadataToMetadata(
    metadata: CosmosBankV1Beta1BankPb.Metadata,
  ): Metadata {
    return metadata
  }

  static moduleParamsResponseToModuleParams(
    response: CosmosBankV1Beta1QueryPb.QueryParamsResponse,
  ): BankModuleParams {
    const params = response.params!

    return {
      sendEnabledList: params.sendEnabled,
      defaultSendEnabled: params.defaultSendEnabled,
    }
  }

  static denomOwnersResponseToDenomOwners(
    response: CosmosBankV1Beta1QueryPb.QueryDenomOwnersResponse,
  ): {
    denomOwners: { address: string; balance: Coin | undefined }[]
    pagination: Pagination
  } {
    const denomOwners = response.denomOwners
    const pagination = response.pagination

    return {
      denomOwners: denomOwners.map((denomOwner) => ({
        address: denomOwner.address,
        balance: denomOwner.balance
          ? ChainGrpcCommonTransformer.grpcCoinToCoin(denomOwner.balance)
          : undefined,
      })),
      pagination:
        ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(pagination),
    }
  }

  static totalSupplyResponseToTotalSupply(
    response: CosmosBankV1Beta1QueryPb.QueryTotalSupplyResponse,
  ): {
    supply: TotalSupply
    pagination: Pagination
  } {
    const balances = response.supply
    const pagination = response.pagination

    return {
      supply: balances.map(ChainGrpcCommonTransformer.grpcCoinToCoin),
      pagination:
        ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(pagination),
    }
  }

  static denomsMetadataResponseToDenomsMetadata(
    response: CosmosBankV1Beta1QueryPb.QueryDenomsMetadataResponse,
  ): {
    metadatas: Metadata[]
    pagination: Pagination
  } {
    const metadatas = response.metadatas
    const pagination = response.pagination

    return {
      metadatas: metadatas.map(ChainGrpcBankTransformer.metadataToMetadata),
      pagination:
        ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(pagination),
    }
  }

  static balanceResponseToBalance(
    response: CosmosBankV1Beta1QueryPb.QueryBalanceResponse,
  ): Coin {
    return ChainGrpcCommonTransformer.grpcCoinToCoin(response.balance!)
  }

  static balancesResponseToBalances(
    response: CosmosBankV1Beta1QueryPb.QueryAllBalancesResponse,
  ): {
    balances: Coin[]
    pagination: Pagination
  } {
    const balances = response.balances
    const pagination = response.pagination

    return {
      balances: balances.map(ChainGrpcCommonTransformer.grpcCoinToCoin),
      pagination:
        ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(pagination),
    }
  }
}
