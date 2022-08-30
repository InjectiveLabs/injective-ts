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
  OrdersHistoryRequest as SpotOrdersHistoryRequest,
  OrdersHistoryResponse as SpotOrdersHistoryResponse,
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
import { SpotOrderSide, SpotOrderState } from '../types/spot'
import { IndexerGrpcSpotTransformer } from '../transformers'

/**
 * @category Indexer Grpc API
 */
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
    marketIds?: string[]
    subaccountId?: string
    orderSide?: SpotOrderSide
    isConditional?: boolean
    pagination?: PaginationOption
  }) {
    const {
      marketId,
      marketIds,
      subaccountId,
      orderSide,
      // isConditional,
      pagination,
    } = params || {}
    const request = new SpotOrdersRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (marketIds) {
      request.setMarketIdsList(marketIds)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (orderSide) {
      request.setOrderSide(orderSide)
    }

    // TODO: Implement this once indexer supports spot conditional orders.

    // request.setIsConditional(
    // isConditional === undefined ? '' : isConditional ? 'true' : 'false'
    // )

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.setSkip(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.setLimit(pagination.limit)
      }

      if (pagination.endTime !== undefined) {
        request.setEndTime(pagination.endTime)
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

  async fetchOrderHistory(params?: {
    subaccountId?: string
    marketId?: string
    orderTypes?: SpotOrderSide[]
    executionTypes?: TradeExecutionType[]
    direction?: TradeDirection
    isConditional?: boolean
    state?: SpotOrderState
    pagination?: PaginationOption
  }) {
    const {
      subaccountId,
      marketId,
      orderTypes,
      executionTypes,
      direction,
      // isConditional,
      state,
      pagination,
    } = params || {}

    const request = new SpotOrdersHistoryRequest()

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (orderTypes) {
      request.setOrderTypesList(orderTypes)
    }

    if (executionTypes) {
      request.setExecutionTypesList(executionTypes)
    }

    if (direction) {
      request.setDirection(direction)
    }

    if (state) {
      request.setState(state)
    }

    // TODO: Implement this once Indexer supports it.
    // if (isConditional) {
    //   request.setIsConditional(isConditional)
    // }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.setSkip(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.setLimit(pagination.limit)
      }

      if (pagination.endTime !== undefined) {
        request.setEndTime(pagination.endTime)
      }
    }

    try {
      const response = await this.request<
        SpotOrdersHistoryRequest,
        SpotOrdersHistoryResponse,
        typeof InjectiveSpotExchangeRPC.OrdersHistory
      >(request, InjectiveSpotExchangeRPC.OrdersHistory)

      return IndexerGrpcSpotTransformer.orderHistoryResponseToOrderHistory(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchTrades(params?: {
    marketId?: string
    pagination?: PaginationOption
    subaccountId?: string
    executionTypes?: TradeExecutionType[]
    executionSide?: TradeExecutionSide
    startTime?: number
    endTime?: number
    direction?: TradeDirection
    marketIds?: string[]
  }) {
    const {
      marketId,
      pagination,
      subaccountId,
      executionTypes,
      executionSide,
      startTime,
      endTime,
      direction,
      marketIds,
    } = params || {}

    const request = new SpotTradesRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (marketIds) {
      request.setMarketIdsList(marketIds)
    } else {
      request.setMarketIdsList([])
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (executionTypes) {
      request.setExecutionTypesList(executionTypes)
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

      if (pagination.endTime !== undefined) {
        request.setEndTime(pagination.endTime)
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

      return IndexerGrpcSpotTransformer.subaccountTradesListResponseToTradesList(
        response,
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
