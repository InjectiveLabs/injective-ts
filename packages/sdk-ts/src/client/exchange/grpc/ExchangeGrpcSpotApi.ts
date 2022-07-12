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
  // TradesRequest as SpotTradesRequest,
  // TradesResponse as SpotTradesResponse,
  SubaccountOrdersListRequest as SpotSubaccountOrdersListRequest,
  SubaccountOrdersListResponse as SpotSubaccountOrdersListResponse,
  // SubaccountTradesListRequest as SpotSubaccountTradesListRequest,
  // SubaccountTradesListResponse as SpotSubaccountTradesListResponse,
  OrderbooksRequest as SpotOrderbooksRequest,
  OrderbooksResponse as SpotOrderbooksResponse,
  TradesResponse,
  TradesRequest,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import {
  TradeExecutionSide,
  TradeDirection,
  TradeExecutionType,
} from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'
import { SpotOrderSide } from '../types/spot'
import { ExchangeGrpcSpotTransformer } from '../transformers'

export class ExchangeGrpcSpotApi extends BaseConsumer {
  async fetchMarkets(params?: {
    baseDenom?: string
    marketStatus?: string
    quoteDenom?: string
  }) {
    const { baseDenom, marketStatus, quoteDenom } = params || {}
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

      return ExchangeGrpcSpotTransformer.marketsResponseToMarkets(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchMarket(marketId: string) {
    const request = new SpotMarketRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        SpotMarketRequest,
        SpotMarketResponse,
        typeof InjectiveSpotExchangeRPC.Market
      >(request, InjectiveSpotExchangeRPC.Market)

      return ExchangeGrpcSpotTransformer.marketResponseToMarket(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrderbook(marketId: string) {
    const request = new SpotOrderbookRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        SpotOrderbookRequest,
        SpotOrderbookResponse,
        typeof InjectiveSpotExchangeRPC.Orderbook
      >(request, InjectiveSpotExchangeRPC.Orderbook)

      return ExchangeGrpcSpotTransformer.orderbookResponseToOrderbook(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrders(params?: {
    marketId?: string
    subaccountId?: string
    orderSide?: SpotOrderSide
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, orderSide, pagination } = params || {}
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
        SpotOrdersRequest,
        SpotOrdersResponse,
        typeof InjectiveSpotExchangeRPC.Orders
      >(request, InjectiveSpotExchangeRPC.Orders)

      return ExchangeGrpcSpotTransformer.ordersResponseToOrders(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchTrades(params?: {
    marketId?: string
    pagination?: PaginationOption
    subaccountId?: string
    executionType?: TradeExecutionType
    executionSide?: TradeExecutionSide
    direction?: TradeDirection,
    skip?: number,
    limit?: number,
    endTime?: number
  }): Promise<any> {
    const { marketId, subaccountId, pagination, executionType, executionSide, direction, skip, limit, endTime } =
      params || {}
    const request = new TradesRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (executionType) {
      request.setExecutionType(executionType)
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

    if (skip !== undefined) {
      request.setSkip(skip)
    }

    if (limit !== undefined) {
      request.setLimit(limit)
    }

    if (endTime !== undefined) {
      request.setEndTime(endTime)
    }

    try {
      const response = await this.request<
        TradesRequest,
        TradesResponse,
        typeof InjectiveSpotExchangeRPC.Trades
      >(request, InjectiveSpotExchangeRPC.Trades)

      return ExchangeGrpcSpotTransformer.tradesResponseToTrades(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountOrdersList(params?: {
    subaccountId?: string
    marketId?: string
    pagination?: PaginationOption
  }) {
    const { subaccountId, marketId, pagination } = params || {}
    const request = new SpotSubaccountOrdersListRequest()

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (marketId) {
      request.setMarketId(marketId)
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
        SpotSubaccountOrdersListRequest,
        SpotSubaccountOrdersListResponse,
        typeof InjectiveSpotExchangeRPC.SubaccountOrdersList
      >(request, InjectiveSpotExchangeRPC.SubaccountOrdersList)

      return ExchangeGrpcSpotTransformer.ordersResponseToOrders(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountTradesList(params?: {
    subaccountId?: string
    marketId?: string
    direction?: TradeDirection
    executionType?: TradeExecutionType
    executionSide?: TradeExecutionSide
    pagination?: PaginationOption
  }) {
    const { subaccountId, marketId, direction, executionType, executionSide, pagination } =
      params || {}
    const request = new TradesRequest()

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

    if (executionSide) {
      request.setExecutionSide(executionSide)
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
        TradesRequest,
        TradesResponse,
        typeof InjectiveSpotExchangeRPC.Trades
      >(request, InjectiveSpotExchangeRPC.Trades)

      return ExchangeGrpcSpotTransformer.tradesResponseToTrades(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrderbooks(marketIds: string[]) {
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

      return ExchangeGrpcSpotTransformer.orderbooksResponseToOrderbooks(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
