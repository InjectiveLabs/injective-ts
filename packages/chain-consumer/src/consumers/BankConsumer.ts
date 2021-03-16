import { GrpcException } from '@injectivelabs/exceptions'
import { AccountAddress } from '@injectivelabs/ts-types'
import { Query } from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb_service'
import {
  QueryBalanceRequest,
  QueryBalanceResponse,
  QueryTotalSupplyRequest,
  QueryTotalSupplyResponse,
} from '@injectivelabs/chain-api/cosmos/bank/v1beta1/query_pb'
import BaseConsumer from '../BaseConsumer'

export class BankConsumer extends BaseConsumer {
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
