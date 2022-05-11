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
  SubaccountOrdersListRequest as SpotSubaccountOrdersListRequest,
  SubaccountOrdersListResponse as SpotSubaccountOrdersListResponse,
  SubaccountTradesListRequest as SpotSubaccountTradesListRequest,
  SubaccountTradesListResponse as SpotSubaccountTradesListResponse,
  OrderbooksRequest as SpotOrderbooksRequest,
  OrderbooksResponse as SpotOrderbooksResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { SpotOrderSide } from '../../../types/spot'
import {
  TradeExecutionSide,
  TradeDirection,
  TradeExecutionType,
} from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'

export class SpotApi extends BaseConsumer {
  async fetchSpotMarkets({
    baseDenom,
    marketStatus,
    quoteDenom,
  }: {
    baseDenom?: string
    marketStatus?: string
    quoteDenom?: string
  }) {
    const request = new SpotMarketsRequest()

    if (baseDenom) {
      request.setBaseDenom(baseDenom)
    }

    if (marketStatus) {
      request.setMarketStatus(marketStatus)
    }

    if (quoteDenom) {
      request.setQuoteDenom(quoteDenom)
    }

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
    pagination,
    executionSide,
    direction,
  }: {
    marketId?: string
    pagination?: PaginationOption
    subaccountId?: string
    executionSide?: TradeExecutionSide
    direction?: TradeDirection
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

    if (direction) {
      request.setDirection(direction)
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.setSkip(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.setLimit(pagination.limit)
      }
    }

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

  async fetchSpotSubaccountOrdersList({
    subaccountId,
    marketId,
  }: {
    subaccountId?: string
    marketId?: string
  }) {
    const request = new SpotSubaccountOrdersListRequest()

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (marketId) {
      request.setMarketId(marketId)
    }

    try {
      const response = await this.request<
        SpotSubaccountOrdersListRequest,
        SpotSubaccountOrdersListResponse,
        typeof InjectiveSpotExchangeRPC.SubaccountOrdersList
      >(request, InjectiveSpotExchangeRPC.SubaccountOrdersList)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSpotSubaccountTradesList({
    subaccountId,
    marketId,
    direction,
    executionType,
  }: {
    subaccountId?: string
    marketId?: string
    direction?: TradeDirection
    executionType?: TradeExecutionType
  }) {
    const request = new SpotSubaccountTradesListRequest()

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (direction) {
      request.setDirection(direction)
    }

    if (executionType) {
      request.setExecutionType(executionType)
    }

    try {
      const response = await this.request<
        SpotSubaccountTradesListRequest,
        SpotSubaccountTradesListResponse,
        typeof InjectiveSpotExchangeRPC.SubaccountTradesList
      >(request, InjectiveSpotExchangeRPC.SubaccountTradesList)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSpotOrderbooks(marketIds: string[]) {
    const request = new SpotOrderbooksRequest()

    if (marketIds.length > 0) {
      request.setMarketIdsList(marketIds)
    }

    try {
      const response = await this.request<
        SpotOrderbooksRequest,
        SpotOrderbooksResponse,
        typeof InjectiveSpotExchangeRPC.Orderbooks
      >(request, InjectiveSpotExchangeRPC.Orderbooks)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
