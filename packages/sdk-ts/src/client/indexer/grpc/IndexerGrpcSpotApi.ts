import {
  GeneralException,
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { OrderSide, OrderState } from '@injectivelabs/ts-types'
import { InjectiveSpotExchangeRpc } from '@injectivelabs/indexer-proto-ts'
import {
  TradeExecutionSide,
  TradeDirection,
  TradeExecutionType,
} from '../../../types/exchange.js'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'
import { PaginationOption } from '../../../types/pagination.js'
import { IndexerGrpcSpotTransformer } from '../transformers/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcSpotApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Spot

  protected client: InjectiveSpotExchangeRpc.InjectiveSpotExchangeRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)
    this.client =
      new InjectiveSpotExchangeRpc.InjectiveSpotExchangeRPCClientImpl(
        this.getGrpcWebImpl(endpoint),
      )
  }

  async fetchMarkets(params?: {
    baseDenom?: string
    marketStatus?: string
    quoteDenom?: string
    marketStatuses?: string[]
  }) {
    const { baseDenom, marketStatus, quoteDenom, marketStatuses } = params || {}
    const request = InjectiveSpotExchangeRpc.MarketsRequest.create()

    if (baseDenom) {
      request.baseDenom = baseDenom
    }

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
        await this.retry<InjectiveSpotExchangeRpc.MarketsResponse>(() =>
          this.client.Markets(request),
        )

      return IndexerGrpcSpotTransformer.marketsResponseToMarkets(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
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
    const request = InjectiveSpotExchangeRpc.MarketRequest.create()

    request.marketId = marketId

    try {
      const response =
        await this.retry<InjectiveSpotExchangeRpc.MarketResponse>(() =>
          this.client.Market(request),
        )

      return IndexerGrpcSpotTransformer.marketResponseToMarket(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
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

  /** @deprecated - use fetchOrderbookV2 */
  async fetchOrderbook(_marketId: string) {
    throw new GeneralException(new Error('deprecated - use fetchOrderbookV2'))
  }

  async fetchOrders(params?: {
    marketId?: string
    marketIds?: string[]
    subaccountId?: string
    orderSide?: OrderSide
    isConditional?: boolean
    pagination?: PaginationOption
  }) {
    const { marketId, marketIds, subaccountId, orderSide, pagination } =
      params || {}
    const request = InjectiveSpotExchangeRpc.OrdersRequest.create()

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

      if (pagination.startTime !== undefined) {
        request.startTime = pagination.startTime.toString()
      }
    }

    try {
      const response =
        await this.retry<InjectiveSpotExchangeRpc.OrdersResponse>(() =>
          this.client.Orders(request),
        )

      return IndexerGrpcSpotTransformer.ordersResponseToOrders(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
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
      state,
      pagination,
    } = params || {}

    const request = InjectiveSpotExchangeRpc.OrdersHistoryRequest.create()

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

      if (pagination.startTime !== undefined) {
        request.startTime = pagination.startTime.toString()
      }
    }

    try {
      const response =
        await this.retry<InjectiveSpotExchangeRpc.OrdersHistoryResponse>(() =>
          this.client.OrdersHistory(request),
        )

      return IndexerGrpcSpotTransformer.orderHistoryResponseToOrderHistory(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
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

    const request = InjectiveSpotExchangeRpc.TradesRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (accountAddress) {
      request.accountAddress = accountAddress
    }

    if (tradeId) {
      request.tradeId = tradeId
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
        await this.retry<InjectiveSpotExchangeRpc.TradesResponse>(() =>
          this.client.Trades(request),
        )

      return IndexerGrpcSpotTransformer.tradesResponseToTrades(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
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

  async fetchSubaccountOrdersList(params?: {
    subaccountId?: string
    marketId?: string
    pagination?: PaginationOption
  }) {
    const { subaccountId, marketId, pagination } = params || {}
    const request =
      InjectiveSpotExchangeRpc.SubaccountOrdersListRequest.create()

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
      const response =
        await this.retry<InjectiveSpotExchangeRpc.SubaccountOrdersListResponse>(
          () => this.client.SubaccountOrdersList(request),
        )

      return IndexerGrpcSpotTransformer.ordersResponseToOrders(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
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

  async fetchSubaccountTradesList(params?: {
    subaccountId?: string
    marketId?: string
    direction?: TradeDirection
    executionType?: TradeExecutionType
    pagination?: PaginationOption
  }) {
    const { subaccountId, marketId, direction, executionType, pagination } =
      params || {}
    const request =
      InjectiveSpotExchangeRpc.SubaccountTradesListRequest.create()

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
      const response =
        await this.retry<InjectiveSpotExchangeRpc.SubaccountTradesListResponse>(
          () => this.client.SubaccountTradesList(request),
        )

      return IndexerGrpcSpotTransformer.subaccountTradesListResponseToTradesList(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
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
    const request = InjectiveSpotExchangeRpc.OrderbooksV2Request.create()

    if (marketIds.length > 0) {
      request.marketIds = marketIds
    }

    try {
      const response =
        await this.retry<InjectiveSpotExchangeRpc.OrderbooksV2Response>(() =>
          this.client.OrderbooksV2(request),
        )

      return IndexerGrpcSpotTransformer.orderbooksV2ResponseToOrderbooksV2(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
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
    const request = InjectiveSpotExchangeRpc.OrderbookV2Request.create()

    request.marketId = marketId

    try {
      const response =
        await this.retry<InjectiveSpotExchangeRpc.OrderbookV2Response>(() =>
          this.client.OrderbookV2(request),
        )

      return IndexerGrpcSpotTransformer.orderbookV2ResponseToOrderbookV2(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'OrderbookV2',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: '',
        contextModule: this.module,
      })
    }
  }

  async fetchAtomicSwapHistory(params: {
    address: string
    contractAddress: string
    pagination?: PaginationOption
  }) {
    const { address, contractAddress, pagination } = params || {}
    const request = InjectiveSpotExchangeRpc.AtomicSwapHistoryRequest.create()

    request.address = address
    request.contractAddress = contractAddress

    if (pagination) {
      if (pagination.fromNumber !== undefined) {
        request.fromNumber = pagination.fromNumber
      }

      if (pagination.toNumber !== undefined) {
        request.toNumber = pagination.toNumber
      }

      if (pagination.skip !== undefined) {
        request.skip = pagination.skip
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    try {
      const response =
        await this.retry<InjectiveSpotExchangeRpc.AtomicSwapHistoryResponse>(
          () => this.client.AtomicSwapHistory(request),
        )

      return IndexerGrpcSpotTransformer.grpcAtomicSwapHistoryListToAtomicSwapHistoryList(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveSpotExchangeRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'AtomicSwapHistory',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AtomicSwapHistory',
        contextModule: this.module,
      })
    }
  }
}
