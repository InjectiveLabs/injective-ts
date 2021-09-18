import {
  AccountAddress,
  TradeDirection,
  TradeExecutionSide,
} from '@injectivelabs/ts-types'
import {
  SubaccountOrdersListRequest,
  SubaccountTradesListRequest,
  SubaccountOrdersListResponse,
  SubaccountTradesListResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPC } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'

export class SubaccountSpotConsumer extends BaseConsumer {
  async fetchTrades({
    subaccountId,
    marketId,
    executionSide,
    direction,
  }: {
    subaccountId: AccountAddress
    marketId?: string
    executionSide?: TradeExecutionSide
    direction?: TradeDirection
  }) {
    const request = new SubaccountTradesListRequest()
    request.setSubaccountId(subaccountId)

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (executionSide) {
      request.setExecutionType(executionSide)
    }

    if (direction) {
      request.setDirection(direction)
    }

    try {
      const response = await this.request<
        SubaccountTradesListRequest,
        SubaccountTradesListResponse,
        typeof InjectiveSpotExchangeRPC.SubaccountTradesList
      >(request, InjectiveSpotExchangeRPC.SubaccountTradesList)

      return response.getTradesList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchOrders({
    subaccountId,
    marketId,
  }: {
    subaccountId: AccountAddress
    marketId?: string
  }) {
    const request = new SubaccountOrdersListRequest()
    request.setSubaccountId(subaccountId)

    if (marketId) {
      request.setMarketId(marketId)
    }

    try {
      const response = await this.request<
        SubaccountOrdersListRequest,
        SubaccountOrdersListResponse,
        typeof InjectiveSpotExchangeRPC.SubaccountOrdersList
      >(request, InjectiveSpotExchangeRPC.SubaccountOrdersList)

      return response.getOrdersList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
