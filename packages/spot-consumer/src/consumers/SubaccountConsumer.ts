import { AccountAddress } from '@injectivelabs/ts-types'
import {
  SubaccountsListRequest,
  SubaccountsListResponse,
  SubaccountBalanceRequest,
  SubaccountBalanceResponse,
  SubaccountBalancesListRequest,
  SubaccountOrdersListRequest,
  SubaccountTradesListRequest,
  SubaccountOrdersListResponse,
  SubaccountTradesListResponse,
  SubaccountHistoryRequest,
  SubaccountHistoryResponse,
  SubaccountBalancesListResponse,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'
import { InjectiveSpotMarketsRPC } from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'
import { TradeDirection, TradeExecutionType } from '../types'

export class SubaccountConsumer extends BaseConsumer {
  async fetchSubaccounts(address: AccountAddress) {
    const request = new SubaccountsListRequest()
    request.setAccountAddress(address)

    try {
      const response = await this.request<
        SubaccountsListRequest,
        SubaccountsListResponse,
        typeof InjectiveSpotMarketsRPC.SubaccountsList
      >(request, InjectiveSpotMarketsRPC.SubaccountsList)

      return response.getSubaccountsList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSubaccountBalance(address: AccountAddress, denom: string) {
    const request = new SubaccountBalanceRequest()
    request.setSubaccountId(address)
    request.setDenom(denom)

    try {
      const response = await this.request<
        SubaccountBalanceRequest,
        SubaccountBalanceResponse,
        typeof InjectiveSpotMarketsRPC.SubaccountBalanceEndpoint
      >(request, InjectiveSpotMarketsRPC.SubaccountBalanceEndpoint)

      return response.getBalance()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSubaccountBalances(address: AccountAddress) {
    const request = new SubaccountBalancesListRequest()
    request.setSubaccountId(address)

    try {
      const response = await this.request<
        SubaccountBalancesListRequest,
        SubaccountBalancesListResponse,
        typeof InjectiveSpotMarketsRPC.SubaccountBalancesList
      >(request, InjectiveSpotMarketsRPC.SubaccountBalancesList)

      return response.getBalancesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSubaccountHistory(address: AccountAddress) {
    const request = new SubaccountHistoryRequest()
    request.setSubaccountId(address)

    try {
      const response = await this.request<
        SubaccountHistoryRequest,
        SubaccountHistoryResponse,
        typeof InjectiveSpotMarketsRPC.SubaccountHistory
      >(request, InjectiveSpotMarketsRPC.SubaccountHistory)

      return response.getTransfersList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSubaccountTrades({
    address,
    marketId,
    executionType,
    direction,
  }: {
    address: AccountAddress
    marketId: string
    executionType?: TradeExecutionType
    direction?: TradeDirection
  }) {
    const request = new SubaccountTradesListRequest()
    request.setSubaccountId(address)
    request.setMarketId(marketId)

    if (executionType) {
      request.setExecutionType(executionType)
    }

    if (direction) {
      request.setDirection(direction)
    }

    try {
      const response = await this.request<
        SubaccountTradesListRequest,
        SubaccountTradesListResponse,
        typeof InjectiveSpotMarketsRPC.SubaccountTradesList
      >(request, InjectiveSpotMarketsRPC.SubaccountTradesList)

      return response.getTradesList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async fetchSubaccountOrders(address: AccountAddress, marketId: string) {
    const request = new SubaccountOrdersListRequest()
    request.setSubaccountId(address)
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        SubaccountOrdersListRequest,
        SubaccountOrdersListResponse,
        typeof InjectiveSpotMarketsRPC.SubaccountOrdersList
      >(request, InjectiveSpotMarketsRPC.SubaccountOrdersList)

      return response.getOrdersList()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
