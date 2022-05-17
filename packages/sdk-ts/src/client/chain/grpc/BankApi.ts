import { Query as BankQuery } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb_service'
import {
  QueryAllBalancesRequest,
  QueryAllBalancesResponse,
  QueryBalanceRequest,
  QueryBalanceResponse,
  QueryTotalSupplyRequest,
  QueryTotalSupplyResponse,
  QueryParamsRequest as QueryBankParamsRequest,
  QueryParamsResponse as QueryBankParamsResponse,
} from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { PaginationOption } from '../../../types/pagination'
import { paginationRequestFromPagination } from '../../../utils/pagination'

export class BankApi extends BaseConsumer {
  async fetchModuleParams() {
    const request = new QueryBankParamsRequest()

    try {
      const response = await this.request<
        QueryBankParamsRequest,
        QueryBankParamsResponse,
        typeof BankQuery.Params
      >(request, BankQuery.Params)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchBalance({
    accountAddress,
    denom,
  }: {
    accountAddress: string
    denom: string
  }) {
    const request = new QueryBalanceRequest()
    request.setAddress(accountAddress)
    request.setDenom(denom)

    try {
      const response = await this.request<
        QueryBalanceRequest,
        QueryBalanceResponse,
        typeof BankQuery.Balance
      >(request, BankQuery.Balance)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchBalances(address: string) {
    const request = new QueryAllBalancesRequest()
    request.setAddress(address)

    try {
      const response = await this.request<
        QueryAllBalancesRequest,
        QueryAllBalancesResponse,
        typeof BankQuery.AllBalances
      >(request, BankQuery.AllBalances)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchTotalSupply(pagination?: PaginationOption) {
    const request = new QueryTotalSupplyRequest()
    const paginationForRequest = paginationRequestFromPagination(pagination)

    if (paginationForRequest) {
      request.setPagination(paginationForRequest)
    }

    try {
      const response = await this.request<
        QueryTotalSupplyRequest,
        QueryTotalSupplyResponse,
        typeof BankQuery.TotalSupply
      >(request, BankQuery.TotalSupply)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
