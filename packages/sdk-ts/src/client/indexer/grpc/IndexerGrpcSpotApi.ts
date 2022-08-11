import { InjectiveSpotExchangeRPC } from '@injectivelabs/indexer-api/injective_spot_exchange_rpc_pb_service'
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
} from '@injectivelabs/indexer-api/injective_spot_exchange_rpc_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import {
  TradeExecutionSide,
  TradeDirection,
  TradeExecutionType,
} from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'
import { SpotOrderSide } from '../types/spot'
import { IndexerGrpcSpotTransformer } from '../transformers'

export class IndexerGrpcSpotApi extends BaseConsumer {
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

      return IndexerGrpcSpotTransformer.marketsResponseToMarkets(response)
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

      return IndexerGrpcSpotTransformer.marketResponseToMarket(response)
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

      return IndexerGrpcSpotTransformer.orderbookResponseToOrderbook(response)
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

      return IndexerGrpcSpotTransformer.ordersResponseToOrders(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchTrades(params?: {
    marketId?: string
    pagination?: PaginationOption
    subaccountId?: string
    startTime?: number
    endTime?: number
    executionSide?: TradeExecutionSide
    direction?: TradeDirection
  }) {
    const {
      marketId,
      subaccountId,
      startTime,
      endTime,
      pagination,
      executionSide,
      direction,
    } = params || {}
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

    if (startTime) {
      request.setStartTime(startTime)
    }

    if (endTime) {
      request.setEndTime(endTime)
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

      return IndexerGrpcSpotTransformer.tradesResponseToTrades(response)
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

      return IndexerGrpcSpotTransformer.ordersResponseToOrders(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountTradesList(params?: {
    subaccountId?: string
    marketId?: string
    direction?: TradeDirection
    executionType?: TradeExecutionType
    pagination?: PaginationOption
  }) {
    const { subaccountId, marketId, direction, executionType, pagination } =
      params || {}
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
        SpotSubaccountTradesListRequest,
        SpotSubaccountTradesListResponse,
        typeof InjectiveSpotExchangeRPC.SubaccountTradesList
      >(request, InjectiveSpotExchangeRPC.SubaccountTradesList)
      return IndexerGrpcSpotTransformer.tradesResponseToTrades(
        response as SpotTradesResponse,
      )
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

      return IndexerGrpcSpotTransformer.orderbooksResponseToOrderbooks(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
