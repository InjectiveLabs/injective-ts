import { InjectiveSpotExchangeRPC } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb_service'
import {
  MarketsRequest as SpotMarketsRequest,
  MarketsResponse as SpotMarketsResponse,
  MarketRequest as SpotMarketRequest,
  MarketResponse as SpotMarketResponse,
  OrderbookRequest as SpotOrderbookRequest,
  OrderbookResponse as SpotOrderbookResponse,
  OrdersRequest as SpotOrdersRequest,
  OrdersResponse as SpotOrdersResponse,
  TradesRequest as SpotTradesRequest,
  TradesResponse as SpotTradesResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { SpotOrderSide } from '../../../types/spot'
import { TradeExecutionSide } from '../../../types/exchange'

export class SpotApi extends BaseConsumer {
  async fetchSpotMarkets() {
    const request = new SpotMarketsRequest()

    try {
      const response = await this.request<
        SpotMarketsRequest,
        SpotMarketsResponse,
        typeof InjectiveSpotExchangeRPC.Markets
      >(request, InjectiveSpotExchangeRPC.Markets)

      return response.getMarketsList()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSpotMarket(marketId: string) {
    const request = new SpotMarketRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        SpotMarketRequest,
        SpotMarketResponse,
        typeof InjectiveSpotExchangeRPC.Market
      >(request, InjectiveSpotExchangeRPC.Market)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSpotOrderbook(marketId: string) {
    const request = new SpotOrderbookRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        SpotOrderbookRequest,
        SpotOrderbookResponse,
        typeof InjectiveSpotExchangeRPC.Orderbook
      >(request, InjectiveSpotExchangeRPC.Orderbook)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSpotOrders({
    marketId,
    subaccountId,
    orderSide,
  }: {
    marketId?: string
    subaccountId?: string
    orderSide?: SpotOrderSide
  }) {
    const request = new SpotOrdersRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (orderSide) {
      request.setOrderSide(orderSide)
    }

    try {
      const response = await this.request<
        SpotOrdersRequest,
        SpotOrdersResponse,
        typeof InjectiveSpotExchangeRPC.Orders
      >(request, InjectiveSpotExchangeRPC.Orders)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSpotTrades({
    marketId,
    subaccountId,
    skip = 0,
    executionSide,
  }: {
    marketId?: string
    skip?: number
    subaccountId?: string
    executionSide?: TradeExecutionSide
  }) {
    const request = new SpotTradesRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (executionSide) {
      request.setExecutionSide(executionSide)
    }

    request.setSkip(skip)

    try {
      const response = await this.request<
        SpotTradesRequest,
        SpotTradesResponse,
        typeof InjectiveSpotExchangeRPC.Trades
      >(request, InjectiveSpotExchangeRPC.Trades)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
