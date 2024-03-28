import { GrpcCoin, Pagination } from '../../../types'
import { Coin } from '@injectivelabs/ts-types'
import { BankModuleParams, Metadata, TotalSupply } from '../types'
import { grpcPaginationToPagination } from '../../../utils/pagination'
import { CosmosBankV1Beta1Query } from '@injectivelabs/core-proto-ts'
import { CosmosBankV1Beta1Bank } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcBankTransformer {
  static grpcCoinToCoin(coin: GrpcCoin): Coin {
    return {
      denom: coin.denom,
      amount: coin.amount,
    }
  }

  static metadataToMetadata(
    metadata: CosmosBankV1Beta1Bank.Metadata,
  ): Metadata {
    return metadata
  }

  static grpcCoinsToCoins(coins: GrpcCoin[]): Coin[] {
    return coins.map(ChainGrpcBankTransformer.grpcCoinToCoin)
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
      supply: balances.map(ChainGrpcBankTransformer.grpcCoinToCoin),
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
    return ChainGrpcBankTransformer.grpcCoinToCoin(response.balance!)
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
      balances: ChainGrpcBankTransformer.grpcCoinsToCoins(balances),
      pagination: grpcPaginationToPagination(pagination),
    }
  }
}
