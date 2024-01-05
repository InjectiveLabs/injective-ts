import {
  GeneralException,
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { OrderSide, OrderState } from '@injectivelabs/ts-types'
import { InjectiveDerivativeExchangeRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer'
import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/exchange'
import { IndexerModule } from '../types'
import { PaginationOption } from '../../../types/pagination'
import { IndexerGrpcDerivativeTransformer } from '../transformers'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcDerivativesApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Derivatives

  protected client: InjectiveDerivativeExchangeRpc.InjectiveDerivativeExchangeRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client =
      new InjectiveDerivativeExchangeRpc.InjectiveDerivativeExchangeRPCClientImpl(
        this.getGrpcWebImpl(endpoint),
      )
  }

  async fetchMarkets(params?: {
    quoteDenom?: string
    marketStatus?: string
    marketStatuses?: string[]
  }) {
    const { marketStatus, quoteDenom, marketStatuses } = params || {}

    const request = InjectiveDerivativeExchangeRpc.MarketsRequest.create()

    if (marketStatus) {
      request.marketStatus = marketStatus
    }

    if (marketStatuses) {
      request.marketStatuses = marketStatuses
    }

    if (quoteDenom) {
      request.quoteDenom = quoteDenom
    }

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.MarketsResponse>(() =>
          this.client.Markets(request),
        )

      return IndexerGrpcDerivativeTransformer.marketsResponseToMarkets(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Markets',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Markets',
        contextModule: this.module,
      })
    }
  }

  async fetchMarket(marketId: string) {
    const request = InjectiveDerivativeExchangeRpc.MarketRequest.create()

    request.marketId = marketId

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.MarketResponse>(() =>
          this.client.Market(request),
        )

      return IndexerGrpcDerivativeTransformer.marketResponseToMarket(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Market',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Market',
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
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.BinaryOptionsMarketsResponse>(
          () => this.client.BinaryOptionsMarkets(request),
        )

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
          context: 'BinaryOptionsMarkets',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'BinaryOptionsMarkets',
        contextModule: this.module,
      })
    }
  }

  async fetchBinaryOptionsMarket(marketId: string) {
    const request =
      InjectiveDerivativeExchangeRpc.BinaryOptionsMarketRequest.create()

    request.marketId = marketId

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.BinaryOptionsMarketResponse>(
          () => this.client.BinaryOptionsMarket(request),
        )

      return IndexerGrpcDerivativeTransformer.binaryOptionsMarketResponseToBinaryOptionsMarket(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'BinaryOptionsMarket',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'BinaryOptionsMarket',
        contextModule: this.module,
      })
    }
  }

  /** @deprecated - use fetchOrderbookV2 */
  async fetchOrderbook(_marketId: string) {
    throw new GeneralException(new Error('deprecated - use fetchOrderbookV2'))
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

      if (pagination.startTime !== undefined) {
        request.startTime = pagination.startTime.toString()
      }
    }

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.OrdersResponse>(() =>
          this.client.Orders(request),
        )

      return IndexerGrpcDerivativeTransformer.ordersResponseToOrders(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Orders',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Orders',
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
      request.marketIds = marketIds
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

      if (pagination.startTime !== undefined) {
        request.startTime = pagination.startTime.toString()
      }
    }

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.OrdersHistoryResponse>(
          () => this.client.OrdersHistory(request),
        )

      return IndexerGrpcDerivativeTransformer.orderHistoryResponseToOrderHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'OrdersHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'OrdersHistory',
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

      if (pagination.startTime !== undefined) {
        request.startTime = pagination.startTime.toString()
      }
    }

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.PositionsResponse>(() =>
          this.client.Positions(request),
        )

      return IndexerGrpcDerivativeTransformer.positionsResponseToPositions(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Positions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Positions',
        contextModule: this.module,
      })
    }
  }

  async fetchPositionsV2(params?: {
    address?: string,
    marketId?: string
    marketIds?: string[]
    subaccountId?: string
    direction?: TradeDirection
    pagination?: PaginationOption
  }) {
    const {
      marketId,
      marketIds,
      subaccountId,
      direction,
      pagination,
      address,
    } = params || {}

    const request = InjectiveDerivativeExchangeRpc.PositionsV2Request.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (address) {
      request.accountAddress = address
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

      if (pagination.startTime !== undefined) {
        request.startTime = pagination.startTime.toString()
      }
    }

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.PositionsV2Response>(
          () => this.client.PositionsV2(request),
        )

      return IndexerGrpcDerivativeTransformer.positionsV2ResponseToPositionsV2(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Positions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Positions',
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

      if (pagination.startTime !== undefined) {
        request.startTime = pagination.startTime.toString()
      }
    }

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.TradesResponse>(() =>
          this.client.Trades(request),
        )

      return IndexerGrpcDerivativeTransformer.tradesResponseToTrades(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Trades',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Trades',
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
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.FundingPaymentsResponse>(
          () => this.client.FundingPayments(request),
        )

      return IndexerGrpcDerivativeTransformer.fundingPaymentsResponseToFundingPayments(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'FundingPayments',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FundingPayments',
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
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.FundingRatesResponse>(
          () => this.client.FundingRates(request),
        )

      return IndexerGrpcDerivativeTransformer.fundingRatesResponseToFundingRates(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'FundingRates',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FundingRates',
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
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.SubaccountOrdersListResponse>(
          () => this.client.SubaccountOrdersList(request),
        )

      return IndexerGrpcDerivativeTransformer.ordersResponseToOrders(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'SubaccountOrdersList',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SubaccountOrdersList',
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
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.SubaccountTradesListResponse>(
          () => this.client.SubaccountTradesList(request),
        )

      return IndexerGrpcDerivativeTransformer.subaccountTradesListResponseToSubaccountTradesList(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'SubaccountTradesList',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SubaccountTradesList',
        contextModule: this.module,
      })
    }
  }

  /** @deprecated - use fetchOrderbooksV2 */
  async fetchOrderbooks(_marketIds: string[]) {
    throw new GeneralException(new Error('deprecated - use fetchOrderbooksV2'))
  }

  async fetchOrderbooksV2(marketIds: string[]) {
    const request = InjectiveDerivativeExchangeRpc.OrderbooksV2Request.create()

    if (marketIds.length > 0) {
      request.marketIds = marketIds
    }

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.OrderbooksV2Response>(
          () => this.client.OrderbooksV2(request),
        )

      return IndexerGrpcDerivativeTransformer.orderbooksV2ResponseToOrderbooksV2(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'OrderbooksV2',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'OrderbooksV2',
        contextModule: this.module,
      })
    }
  }

  async fetchOrderbookV2(marketId: string) {
    const request = InjectiveDerivativeExchangeRpc.OrderbookV2Request.create()

    request.marketId = marketId

    try {
      const response =
        await this.retry<InjectiveDerivativeExchangeRpc.OrderbookV2Response>(
          () => this.client.OrderbookV2(request),
        )

      return IndexerGrpcDerivativeTransformer.orderbookV2ResponseToOrderbookV2(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveDerivativeExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'OrderbookV2',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'OrderbooksV2',
        contextModule: this.module,
      })
    }
  }
}
