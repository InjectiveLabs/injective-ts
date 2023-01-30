import {
  InjectiveSpotExchangeRPCClientImpl,
  MarketsRequest as SpotMarketsRequest,
  MarketRequest as SpotMarketRequest,
  OrderbookRequest as SpotOrderbookRequest,
  OrdersRequest as SpotOrdersRequest,
  OrdersHistoryRequest as SpotOrdersHistoryRequest,
  TradesRequest as SpotTradesRequest,
  SubaccountOrdersListRequest as SpotSubaccountOrdersListRequest,
  SubaccountTradesListRequest as SpotSubaccountTradesListRequest,
  OrderbooksRequest as SpotOrderbooksRequest,
} from '@injectivelabs/indexer-proto-ts/injective_spot_exchange_rpc'
import {
  TradeExecutionSide,
  TradeDirection,
  TradeExecutionType,
} from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'
import { SpotOrderSide, SpotOrderState } from '../types/spot'
import { IndexerGrpcSpotTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcSpotApi {
  protected module: string = IndexerModule.Spot

  protected client: InjectiveSpotExchangeRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveSpotExchangeRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchMarkets(params?: {
    baseDenom?: string
    marketStatus?: string
    quoteDenom?: string
  }) {
    const { baseDenom, marketStatus, quoteDenom } = params || {}
    const request = SpotMarketsRequest.create()

    if (baseDenom) {
      request.baseDenom = baseDenom
    }

    if (marketStatus) {
      request.marketStatus = marketStatus
    }

    if (quoteDenom) {
      request.quoteDenom = quoteDenom
    }

    try {
      const response = await this.client.Markets(request)

      return IndexerGrpcSpotTransformer.marketsResponseToMarkets(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchMarket(marketId: string) {
    const request = SpotMarketRequest.create()

    request.marketId = marketId

    try {
      const response = await this.client.Market(request)

      return IndexerGrpcSpotTransformer.marketResponseToMarket(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchOrderbook(marketId: string) {
    const request = SpotOrderbookRequest.create()

    request.marketId = marketId

    try {
      const response = await this.client.Orderbook(request)

      return IndexerGrpcSpotTransformer.orderbookResponseToOrderbook(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
    const { marketId, marketIds, subaccountId, orderSide, pagination } =
      params || {}
    const request = SpotOrdersRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (orderSide) {
      request.orderSide = orderSide
    }

    /*
    if (isConditional !== undefined) {
      request.isConditional =isConditional
    }
    */

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = pagination.skip.toString()
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = pagination.endTime.toString()
      }
    }

    try {
      const response = await this.client.Orders(request)

      return IndexerGrpcSpotTransformer.ordersResponseToOrders(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
      state,
      pagination,
    } = params || {}

    const request = SpotOrdersHistoryRequest.create()

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (orderTypes) {
      request.orderTypes = orderTypes
    }

    if (executionTypes) {
      request.executionTypes = executionTypes
    }

    if (direction) {
      request.direction = direction
    }

    if (state) {
      request.state = state
    }

    /*
    if (isConditional !== undefined) {
      request.isConditional =isConditional
    }
    */

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = pagination.skip.toString()
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = pagination.endTime.toString()
      }
    }

    try {
      const response = await this.client.OrdersHistory(request)

      return IndexerGrpcSpotTransformer.orderHistoryResponseToOrderHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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

    const request = SpotTradesRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (marketIds) {
      request.marketIds = marketIds
    } else {
      request.marketIds = []
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (executionTypes) {
      request.executionTypes = executionTypes
    }

    if (executionSide) {
      request.executionSide = executionSide
    }

    if (direction) {
      request.direction = direction
    }

    if (startTime) {
      request.startTime = startTime.toString()
    }

    if (endTime) {
      request.endTime = endTime.toString()
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = pagination.skip.toString()
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = pagination.endTime.toString()
      }
    }

    try {
      const response = await this.client.Trades(request)

      return IndexerGrpcSpotTransformer.tradesResponseToTrades(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountOrdersList(params?: {
    subaccountId?: string
    marketId?: string
    pagination?: PaginationOption
  }) {
    const { subaccountId, marketId, pagination } = params || {}
    const request = SpotSubaccountOrdersListRequest.create()

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = pagination.skip.toString()
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    try {
      const response = await this.client.SubaccountOrdersList(request)

      return IndexerGrpcSpotTransformer.ordersResponseToOrders(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
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
    const request = SpotSubaccountTradesListRequest.create()

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (direction) {
      request.direction = direction
    }

    if (executionType) {
      request.executionType = executionType
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = pagination.skip.toString()
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    try {
      const response = await this.client.SubaccountTradesList(request)

      return IndexerGrpcSpotTransformer.subaccountTradesListResponseToTradesList(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchOrderbooks(marketIds: string[]) {
    const request = SpotOrderbooksRequest.create()

    if (marketIds.length > 0) {
      request.marketIds = marketIds
    }

    try {
      const response = await this.client.Orderbooks(request)

      return IndexerGrpcSpotTransformer.orderbooksResponseToOrderbooks(response)
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
