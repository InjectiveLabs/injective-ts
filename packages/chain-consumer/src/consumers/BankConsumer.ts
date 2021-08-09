import { GrpcException } from '@injectivelabs/exceptions'
import { AccountAddress } from '@injectivelabs/ts-types'
import { Query } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb_service'
import {
  QueryAllBalancesRequest,
  QueryAllBalancesResponse,
  QueryBalanceRequest,
  QueryBalanceResponse,
  QueryTotalSupplyRequest,
  QueryTotalSupplyResponse,
  QueryParamsRequest,
  QueryParamsResponse,
} from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb'
import BaseConsumer from '../BaseConsumer'
import { GrpcBankParams } from '../types'

export class BankConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryParamsRequest()

    try {
      const response = await this.request<
        QueryParamsRequest,
        QueryParamsResponse,
        typeof Query.Params
      >(request, Query.Params)

      return response.getParams() as GrpcBankParams
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchBalance({
    accountAddress,
    denom,
  }: {
    accountAddress: AccountAddress
    denom: string
  }) {
    const request = new QueryBalanceRequest()
    request.setAddress(accountAddress)
    request.setDenom(denom)

    try {
      const response = await this.request<
        QueryBalanceRequest,
        QueryBalanceResponse,
        typeof Query.Balance
      >(request, Query.Balance)

      return response.getBalance()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchBalances({ accountAddress }: { accountAddress: AccountAddress }) {
    const request = new QueryAllBalancesRequest()
    request.setAddress(accountAddress)

    try {
      const response = await this.request<
        QueryAllBalancesRequest,
        QueryAllBalancesResponse,
        typeof Query.AllBalances
      >(request, Query.AllBalances)

      return response.getBalancesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSupply() {
    const request = new QueryTotalSupplyRequest()

    try {
      const response = await this.request<
        QueryTotalSupplyRequest,
        QueryTotalSupplyResponse,
        typeof Query.TotalSupply
      >(request, Query.TotalSupply)

      return response.getSupplyList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
