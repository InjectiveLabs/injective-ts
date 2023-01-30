import {
  InjectiveDerivativeExchangeRPCClientImpl,
  FundingPaymentsRequest,
  FundingRatesRequest,
  MarketsRequest as DerivativeMarketsRequest,
  BinaryOptionsMarketsRequest as BinaryOptionsMarketsRequest,
  MarketRequest as DerivativeMarketRequest,
  BinaryOptionsMarketRequest as BinaryOptionsMarketRequest,
  OrderbookRequest as DerivativeOrderbookRequest,
  OrdersRequest as DerivativeOrdersRequest,
  OrdersHistoryRequest as DerivativeOrdersHistoryRequest,
  TradesRequest as DerivativeTradesRequest,
  PositionsRequest as DerivativePositionsRequest,
  SubaccountOrdersListRequest as DerivativeSubaccountOrdersListRequest,
  SubaccountTradesListRequest as DerivativeSubaccountTradesListRequest,
  OrderbooksRequest as DerivativeOrderbooksRequest,
} from '@injectivelabs/indexer-proto-ts/injective_derivative_exchange_rpc'
import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'
import { IndexerGrpcDerivativeTransformer } from '../transformers'
import { IndexerModule } from '../types'
import { DerivativeOrderSide, DerivativeOrderState } from '../types/derivatives'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcDerivativesApi {
  protected module: string = IndexerModule.Derivatives

  protected client: InjectiveDerivativeExchangeRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveDerivativeExchangeRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchMarkets(params?: { marketStatus?: string; quoteDenom?: string }) {
    const { marketStatus, quoteDenom } = params || {}

    const request = DerivativeMarketsRequest.create()

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
    const request = DerivativeMarketRequest.create()

    request.marketId = marketId

    try {
      const response = await this.client.Market(request)

      return IndexerGrpcDerivativeTransformer.marketResponseToMarket(response)
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

  async fetchBinaryOptionsMarkets(params?: {
    marketStatus?: string
    quoteDenom?: string
    pagination?: PaginationOption
  }) {
    const { marketStatus, quoteDenom, pagination } = params || {}

    const request = BinaryOptionsMarketsRequest.create()

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
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchBinaryOptionsMarket(marketId: string) {
    const request = BinaryOptionsMarketRequest.create()

    request.marketId = marketId

    try {
      const response = await this.client.BinaryOptionsMarket(request)

      return IndexerGrpcDerivativeTransformer.binaryOptionsMarketResponseToBinaryOptionsMarket(
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

  async fetchOrderbook(marketId: string) {
    const request = DerivativeOrderbookRequest.create()

    request.marketId = marketId

    try {
      const response = await this.client.Orderbook(request)

      return IndexerGrpcDerivativeTransformer.orderbookResponseToOrderbook(
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

  async fetchOrders(params?: {
    marketId?: string
    marketIds?: string[]
    orderSide?: DerivativeOrderSide
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

    const request = DerivativeOrdersRequest.create()

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
    orderTypes?: DerivativeOrderSide[]
    executionTypes?: TradeExecutionType[]
    direction?: TradeDirection
    isConditional?: boolean
    state?: DerivativeOrderState
    pagination?: PaginationOption
  }) {
    const {
      subaccountId,
      marketId,
      orderTypes,
      executionTypes,
      direction,
      isConditional,
      state,
      pagination,
    } = params || {}

    const request = DerivativeOrdersHistoryRequest.create()

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
      if (e instanceof GrpcUnaryRequestException) {
        throw e
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

    const request = DerivativePositionsRequest.create()

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
    direction?: TradeDirection
    subaccountId?: string
    startTime?: number
    endTime?: number
    executionTypes?: TradeExecutionType[]
    executionSide?: TradeExecutionSide
    pagination?: PaginationOption
    marketIds?: string[]
  }) {
    const {
      marketId,
      subaccountId,
      startTime,
      endTime,
      direction,
      pagination,
      executionTypes,
      executionSide,
      marketIds,
    } = params || {}

    const request = DerivativeTradesRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
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
      if (e instanceof GrpcUnaryRequestException) {
        throw e
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

    const request = FundingPaymentsRequest.create()

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
      if (e instanceof GrpcUnaryRequestException) {
        throw e
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

    const request = FundingRatesRequest.create()

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
    marketId?: string
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, pagination } = params || {}

    const request = DerivativeSubaccountOrdersListRequest.create()

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
      if (e instanceof GrpcUnaryRequestException) {
        throw e
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

    const request = DerivativeSubaccountTradesListRequest.create()

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
    const request = DerivativeOrderbooksRequest.create()

    if (marketIds.length > 0) {
      request.marketIds = marketIds
    }

    try {
      const response = await this.client.Orderbooks(request)

      return IndexerGrpcDerivativeTransformer.orderbooksResponseToOrderbooks(
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
