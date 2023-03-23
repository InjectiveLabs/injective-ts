import { GrpcCoin, Pagination } from '../../../types/index'
import { Coin } from '@injectivelabs/ts-types'
import { BankModuleParams, TotalSupply } from '../types'
import { grpcPaginationToPagination } from '../../../utils/pagination'
import { CosmosBankV1Beta1Query } from '@injectivelabs/core-proto-ts'

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
