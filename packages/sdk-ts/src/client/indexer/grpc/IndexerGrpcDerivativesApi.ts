import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'
import { IndexerGrpcDerivativeTransformer } from '../transformers'
import { IndexerModule } from '../types'
import { OrderSide, OrderState } from '@injectivelabs/ts-types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { InjectiveDerivativeExchangeRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcDerivativesApi {
  protected module: string = IndexerModule.Derivatives

  protected client: InjectiveDerivativeExchangeRpc.InjectiveDerivativeExchangeRPCClientImpl

  constructor(endpoint: string) {
    this.client =
      new InjectiveDerivativeExchangeRpc.InjectiveDerivativeExchangeRPCClientImpl(
        getGrpcIndexerWebImpl(endpoint),
      )
  }

  async fetchMarkets(params?: { marketStatus?: string; quoteDenom?: string }) {
    const { marketStatus, quoteDenom } = params || {}

    const request = InjectiveDerivativeExchangeRpc.MarketsRequest.create()

    if (marketStatus) {
      request.marketStatus = marketStatus
    }

    if (quoteDenom) {
      request.quoteDenom = quoteDenom
    }

    try {
      const response = await this.client.Markets(request)

      return IndexerGrpcDerivativeTransformer.marketsResponseToMarkets(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchMarket(marketId: string) {
    const request = InjectiveDerivativeExchangeRpc.MarketRequest.create()

    request.marketId = marketId

    try {
      const response = await this.client.Market(request)

      return IndexerGrpcDerivativeTransformer.marketResponseToMarket(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchBinaryOptionsMarkets(params?: {
    marketStatus?: string
    quoteDenom?: string
    pagination?: PaginationOption
  }) {
    const { marketStatus, quoteDenom, pagination } = params || {}

    const request =
      InjectiveDerivativeExchangeRpc.BinaryOptionsMarketsRequest.create()

    if (marketStatus) {
      request.marketStatus = marketStatus
    }

    if (quoteDenom) {
      request.quoteDenom = quoteDenom
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
      const response = await this.client.BinaryOptionsMarkets(request)

      return pagination
        ? IndexerGrpcDerivativeTransformer.binaryOptionsMarketResponseWithPaginationToBinaryOptionsMarket(
            response,
          )
        : IndexerGrpcDerivativeTransformer.binaryOptionsMarketsResponseToBinaryOptionsMarkets(
            response,
          )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchBinaryOptionsMarket(marketId: string) {
    const request =
      InjectiveDerivativeExchangeRpc.BinaryOptionsMarketRequest.create()

    request.marketId = marketId

    try {
      const response = await this.client.BinaryOptionsMarket(request)

      return IndexerGrpcDerivativeTransformer.binaryOptionsMarketResponseToBinaryOptionsMarket(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchOrderbook(marketId: string) {
    const request = InjectiveDerivativeExchangeRpc.OrderbookRequest.create()

    request.marketId = marketId

    try {
      const response = await this.client.Orderbook(request)

      return IndexerGrpcDerivativeTransformer.orderbookResponseToOrderbook(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
    orderSide?: OrderSide
    isConditional?: boolean
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const {
      marketId,
      marketIds,
      subaccountId,
      orderSide,
      isConditional,
      pagination,
    } = params || {}

    const request = InjectiveDerivativeExchangeRpc.OrdersRequest.create()

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

    if (isConditional !== undefined) {
      request.isConditional = isConditional ? 'true' : 'false'
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
      const response = await this.client.Orders(request)

      return IndexerGrpcDerivativeTransformer.ordersResponseToOrders(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
    marketIds?: string[]
    orderTypes?: OrderSide[]
    executionTypes?: TradeExecutionType[]
    direction?: TradeDirection
    isConditional?: boolean
    state?: OrderState
    pagination?: PaginationOption
  }) {
    const {
      subaccountId,
      marketId,
      marketIds,
      orderTypes,
      executionTypes,
      direction,
      isConditional,
      state,
      pagination,
    } = params || {}

    const request = InjectiveDerivativeExchangeRpc.OrdersHistoryRequest.create()

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (marketIds) {
      // request.marketIds = marketIds
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

    if (isConditional !== undefined) {
      request.isConditional = isConditional ? 'true' : 'false'
    }

    if (state) {
      request.state = state
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
      const response = await this.client.OrdersHistory(request)

      return IndexerGrpcDerivativeTransformer.orderHistoryResponseToOrderHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchPositions(params?: {
    marketId?: string
    marketIds?: string[]
    subaccountId?: string
    direction?: TradeDirection
    pagination?: PaginationOption
  }) {
    const { marketId, marketIds, subaccountId, direction, pagination } =
      params || {}

    const request = InjectiveDerivativeExchangeRpc.PositionsRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (direction) {
      request.direction = direction
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
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
      const response = await this.client.Positions(request)

      return IndexerGrpcDerivativeTransformer.positionsResponseToPositions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchTrades(params?: {
    endTime?: number
    tradeId?: string
    marketId?: string
    startTime?: number
    marketIds?: string[]
    subaccountId?: string
    accountAddress?: string
    direction?: TradeDirection
    pagination?: PaginationOption
    executionSide?: TradeExecutionSide
    executionTypes?: TradeExecutionType[]
  }) {
    const {
      endTime,
      tradeId,
      marketId,
      startTime,
      direction,
      marketIds,
      pagination,
      subaccountId,
      executionSide,
      executionTypes,
      accountAddress,
    } = params || {}

    const request = InjectiveDerivativeExchangeRpc.TradesRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (tradeId) {
      request.tradeId = tradeId
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (marketIds) {
      request.marketIds = marketIds
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

      return IndexerGrpcDerivativeTransformer.tradesResponseToTrades(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchFundingPayments(params?: {
    marketId?: string
    marketIds?: string[]
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, marketIds, subaccountId, pagination } = params || {}

    const request =
      InjectiveDerivativeExchangeRpc.FundingPaymentsRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketIds) {
      request.marketIds = marketIds
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
      const response = await this.client.FundingPayments(request)

      return IndexerGrpcDerivativeTransformer.fundingPaymentsResponseToFundingPayments(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchFundingRates(params?: {
    marketId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, pagination } = params || {}

    const request = InjectiveDerivativeExchangeRpc.FundingRatesRequest.create()

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
      const response = await this.client.FundingRates(request)

      return IndexerGrpcDerivativeTransformer.fundingRatesResponseToFundingRates(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountOrdersList(params?: {
    marketId?: string
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, pagination } = params || {}

    const request =
      InjectiveDerivativeExchangeRpc.SubaccountOrdersListRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
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

      return IndexerGrpcDerivativeTransformer.ordersResponseToOrders(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountTradesList(params: {
    marketId?: string
    subaccountId?: string
    direction?: TradeDirection
    executionType?: TradeExecutionType
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, direction, executionType, pagination } =
      params || {}

    const request =
      InjectiveDerivativeExchangeRpc.SubaccountTradesListRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
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

      return IndexerGrpcDerivativeTransformer.subaccountTradesListResponseToSubaccountTradesList(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchOrderbooks(marketIds: string[]) {
    const request = InjectiveDerivativeExchangeRpc.OrderbooksRequest.create()

    if (marketIds.length > 0) {
      request.marketIds = marketIds
    }

    try {
      const response = await this.client.Orderbooks(request)

      return IndexerGrpcDerivativeTransformer.orderbooksResponseToOrderbooks(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchOrderbooksV2(marketIds: string[]) {
    const request = InjectiveDerivativeExchangeRpc.OrderbooksV2Request.create()

    if (marketIds.length > 0) {
      request.marketIds = marketIds
    }

    try {
      const response = await this.client.OrderbooksV2(request)

      return IndexerGrpcDerivativeTransformer.orderbooksV2ResponseToOrderbooksV2(
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

  async fetchOrderbookV2(marketId: string) {
    const request = InjectiveDerivativeExchangeRpc.OrderbookV2Request.create()

    request.marketId = marketId

    try {
      const response = await this.client.OrderbookV2(request)

      return IndexerGrpcDerivativeTransformer.orderbookV2ResponseToOrderbookV2(
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
}
