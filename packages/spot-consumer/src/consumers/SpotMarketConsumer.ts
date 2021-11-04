import {
  MarketsRequest,
  MarketsResponse,
  MarketRequest,
  MarketResponse,
  OrderbookRequest,
  OrderbookResponse,
  OrdersRequest,
  OrdersResponse,
  TradesRequest,
  TradesResponse,
  SpotMarketInfo,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPC } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import { AccountAddress, TradeExecutionSide } from '@injectivelabs/ts-types'
import BaseConsumer from '../BaseConsumer'
import { SpotOrderSide } from '../types'

export class SpotMarketConsumer extends BaseConsumer {
  async fetchMarkets() {
    const request = new MarketsRequest()

    try {
      const response = await this.request<
        MarketsRequest,
        MarketsResponse,
        typeof InjectiveSpotExchangeRPC.Markets
      >(request, InjectiveSpotExchangeRPC.Markets)

      return response.getMarketsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchMarket(marketId: string): Promise<SpotMarketInfo> {
    const request = new MarketRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        MarketRequest,
        MarketResponse,
        typeof InjectiveSpotExchangeRPC.Market
      >(request, InjectiveSpotExchangeRPC.Market)

      const market = response.getMarket()

      if (!market) {
        throw new GrpcException(`Market with marketId ${marketId} not found`)
      }

      return market
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchOrderbook(marketId: string) {
    const request = new OrderbookRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        OrderbookRequest,
        OrderbookResponse,
        typeof InjectiveSpotExchangeRPC.Orderbook
      >(request, InjectiveSpotExchangeRPC.Orderbook)

      const orderbook = response.getOrderbook()

      return {
        buys: orderbook ? orderbook.getBuysList() : [],
        sells: orderbook ? orderbook.getSellsList() : [],
      }
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchOrders({
    marketId,
    subaccountId,
    orderSide,
  }: {
    marketId?: string
    subaccountId?: AccountAddress
    orderSide?: SpotOrderSide
  }) {
    const request = new OrdersRequest()

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
        OrdersRequest,
        OrdersResponse,
        typeof InjectiveSpotExchangeRPC.Orders
      >(request, InjectiveSpotExchangeRPC.Orders)

      return response.getOrdersList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchTrades({
    marketId,
    subaccountId,
    skip = 0,
    executionSide,
  }: {
    marketId?: string
    skip?: number
    subaccountId?: AccountAddress
    executionSide?: TradeExecutionSide
  }) {
    const request = new TradesRequest()

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
        TradesRequest,
        TradesResponse,
        typeof InjectiveSpotExchangeRPC.Trades
      >(request, InjectiveSpotExchangeRPC.Trades)

      return response.getTradesList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
