import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveDerivativeExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcDerivativeTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../types'
import type {
  OrderSide,
  OrderState,
  TradeDirection,
  PaginationOption,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcDerivativesApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Derivatives

  private client: InjectiveDerivativeExchangeRPCClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)

    this.client = new InjectiveDerivativeExchangeRPCClient(this.transport)
  }

  async fetchMarkets(params?: {
    quoteDenom?: string
    marketStatus?: string
    marketStatuses?: string[]
  }) {
    const { marketStatus, quoteDenom, marketStatuses } = params || {}

    const request = InjectiveDerivativeExchangeRpcPb.MarketsRequest.create()

    if (marketStatus) {
      request.marketStatus = marketStatus
    }

    if (marketStatuses) {
      request.marketStatuses = marketStatuses
    }

    if (quoteDenom) {
      request.quoteDenom = quoteDenom
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.MarketsRequest,
      InjectiveDerivativeExchangeRpcPb.MarketsResponse
    >(request, this.client.markets.bind(this.client))

    return IndexerGrpcDerivativeTransformer.marketsResponseToMarkets(response)
  }

  async fetchMarket(marketId: string) {
    const request = InjectiveDerivativeExchangeRpcPb.MarketRequest.create()

    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.MarketRequest,
      InjectiveDerivativeExchangeRpcPb.MarketResponse
    >(request, this.client.market.bind(this.client))

    return IndexerGrpcDerivativeTransformer.marketResponseToMarket(response)
  }

  async fetchBinaryOptionsMarkets(params?: {
    marketStatus?: string
    quoteDenom?: string
    pagination?: PaginationOption
  }) {
    const { marketStatus, quoteDenom, pagination } = params || {}

    const request =
      InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketsRequest.create()

    if (marketStatus) {
      request.marketStatus = marketStatus
    }

    if (quoteDenom) {
      request.quoteDenom = quoteDenom
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketsRequest,
      InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketsResponse
    >(request, this.client.binaryOptionsMarkets.bind(this.client))

    return IndexerGrpcDerivativeTransformer.binaryOptionsMarketResponseWithPaginationToBinaryOptionsMarket(
      response,
    )
  }

  async fetchBinaryOptionsMarket(marketId: string) {
    const request =
      InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketRequest.create()

    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketRequest,
      InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketResponse
    >(request, this.client.binaryOptionsMarket.bind(this.client))

    return IndexerGrpcDerivativeTransformer.binaryOptionsMarketResponseToBinaryOptionsMarket(
      response,
    )
  }

  /** @deprecated - use fetchOrderbookV2 */
  async fetchOrderbook(_marketId: string) {
    throw new GeneralException(new Error('deprecated - use fetchOrderbookV2'))
  }

  async fetchOrders(params?: {
    cid?: string
    tradeId?: string
    marketId?: string
    marketIds?: string[]
    orderSide?: OrderSide
    pagination?: PaginationOption
    subaccountId?: string
    isConditional?: boolean
  }) {
    const {
      cid,
      marketId,
      marketIds,
      orderSide,
      pagination,
      isConditional,
      subaccountId,
      tradeId,
    } = params || {}

    const request = InjectiveDerivativeExchangeRpcPb.OrdersRequest.create()

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

    if (cid) {
      request.cid = cid
    }

    if (tradeId) {
      request.tradeId = tradeId
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime)
      }

      if (pagination.startTime !== undefined) {
        request.startTime = BigInt(pagination.startTime)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.OrdersRequest,
      InjectiveDerivativeExchangeRpcPb.OrdersResponse
    >(request, this.client.orders.bind(this.client))

    return IndexerGrpcDerivativeTransformer.ordersResponseToOrders(response)
  }

  async fetchOrderHistory(params?: {
    cid?: string
    state?: OrderState
    tradeId?: string
    marketId?: string
    marketIds?: string[]
    orderTypes?: OrderSide[]
    direction?: TradeDirection
    pagination?: PaginationOption
    subaccountId?: string
    isConditional?: boolean
    executionTypes?: TradeExecutionType[]
  }) {
    const {
      cid,
      state,
      tradeId,
      marketId,
      marketIds,
      direction,
      pagination,
      orderTypes,
      subaccountId,
      isConditional,
      executionTypes,
    } = params || {}

    const request =
      InjectiveDerivativeExchangeRpcPb.OrdersHistoryRequest.create()

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

    if (cid) {
      request.cid = cid
    }

    if (tradeId) {
      request.tradeId = tradeId
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime)
      }

      if (pagination.startTime !== undefined) {
        request.startTime = BigInt(pagination.startTime)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.OrdersHistoryRequest,
      InjectiveDerivativeExchangeRpcPb.OrdersHistoryResponse
    >(request, this.client.ordersHistory.bind(this.client))

    return IndexerGrpcDerivativeTransformer.orderHistoryResponseToOrderHistory(
      response,
      isConditional,
    )
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

    const request = InjectiveDerivativeExchangeRpcPb.PositionsRequest.create()

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
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime)
      }

      if (pagination.startTime !== undefined) {
        request.startTime = BigInt(pagination.startTime)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.PositionsRequest,
      InjectiveDerivativeExchangeRpcPb.PositionsResponse
    >(request, this.client.positions.bind(this.client))

    return IndexerGrpcDerivativeTransformer.positionsResponseToPositions(
      response,
    )
  }

  async fetchPositionsV2(params?: {
    address?: string
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

    const request = InjectiveDerivativeExchangeRpcPb.PositionsV2Request.create()

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
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime)
      }

      if (pagination.startTime !== undefined) {
        request.startTime = BigInt(pagination.startTime)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.PositionsV2Request,
      InjectiveDerivativeExchangeRpcPb.PositionsV2Response
    >(request, this.client.positionsV2.bind(this.client))

    return IndexerGrpcDerivativeTransformer.positionsV2ResponseToPositionsV2(
      response,
    )
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
    cid?: string
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
      cid,
    } = params || {}

    const request = InjectiveDerivativeExchangeRpcPb.TradesRequest.create()

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
      request.startTime = BigInt(startTime)
    }

    if (endTime) {
      request.endTime = BigInt(endTime)
    }

    if (cid) {
      request.cid = cid
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime)
      }

      if (pagination.startTime !== undefined) {
        request.startTime = BigInt(pagination.startTime)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.TradesRequest,
      InjectiveDerivativeExchangeRpcPb.TradesResponse
    >(request, this.client.trades.bind(this.client))

    return IndexerGrpcDerivativeTransformer.tradesResponseToTrades(response)
  }

  async fetchFundingPayments(params?: {
    marketId?: string
    marketIds?: string[]
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, marketIds, subaccountId, pagination } = params || {}

    const request =
      InjectiveDerivativeExchangeRpcPb.FundingPaymentsRequest.create()

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
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }

      if (pagination.endTime !== undefined) {
        request.endTime = BigInt(pagination.endTime)
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.FundingPaymentsRequest,
      InjectiveDerivativeExchangeRpcPb.FundingPaymentsResponse
    >(request, this.client.fundingPayments.bind(this.client))

    return IndexerGrpcDerivativeTransformer.fundingPaymentsResponseToFundingPayments(
      response,
    )
  }

  async fetchFundingRates(params?: {
    marketId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, pagination } = params || {}

    const request =
      InjectiveDerivativeExchangeRpcPb.FundingRatesRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.FundingRatesRequest,
      InjectiveDerivativeExchangeRpcPb.FundingRatesResponse
    >(request, this.client.fundingRates.bind(this.client))

    return IndexerGrpcDerivativeTransformer.fundingRatesResponseToFundingRates(
      response,
    )
  }

  async fetchSubaccountOrdersList(params?: {
    marketId?: string
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, pagination } = params || {}

    const request =
      InjectiveDerivativeExchangeRpcPb.SubaccountOrdersListRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.SubaccountOrdersListRequest,
      InjectiveDerivativeExchangeRpcPb.SubaccountOrdersListResponse
    >(request, this.client.subaccountOrdersList.bind(this.client))

    return IndexerGrpcDerivativeTransformer.ordersResponseToOrders(response)
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
      InjectiveDerivativeExchangeRpcPb.SubaccountTradesListRequest.create()

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
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.SubaccountTradesListRequest,
      InjectiveDerivativeExchangeRpcPb.SubaccountTradesListResponse
    >(request, this.client.subaccountTradesList.bind(this.client))

    return IndexerGrpcDerivativeTransformer.subaccountTradesListResponseToSubaccountTradesList(
      response,
    )
  }

  /** @deprecated - use fetchOrderbooksV2 */
  async fetchOrderbooks(_marketIds: string[]) {
    throw new GeneralException(new Error('deprecated - use fetchOrderbooksV2'))
  }

  async fetchOrderbooksV2(marketIds: string[]) {
    const request =
      InjectiveDerivativeExchangeRpcPb.OrderbooksV2Request.create()

    if (marketIds.length > 0) {
      request.marketIds = marketIds
    }

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.OrderbooksV2Request,
      InjectiveDerivativeExchangeRpcPb.OrderbooksV2Response
    >(request, this.client.orderbooksV2.bind(this.client))

    return IndexerGrpcDerivativeTransformer.orderbooksV2ResponseToOrderbooksV2(
      response,
    )
  }

  async fetchOrderbookV2(marketId: string) {
    const request = InjectiveDerivativeExchangeRpcPb.OrderbookV2Request.create()

    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveDerivativeExchangeRpcPb.OrderbookV2Request,
      InjectiveDerivativeExchangeRpcPb.OrderbookV2Response
    >(request, this.client.orderbookV2.bind(this.client))

    return IndexerGrpcDerivativeTransformer.orderbookV2ResponseToOrderbookV2(
      response,
    )
  }
}
