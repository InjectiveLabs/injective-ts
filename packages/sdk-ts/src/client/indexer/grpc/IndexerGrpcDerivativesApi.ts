import {
  FundingPaymentsRequest,
  FundingPaymentsResponse,
  FundingRatesRequest,
  FundingRatesResponse,
  MarketsRequest as DerivativeMarketsRequest,
  MarketsResponse as DerivativeMarketsResponse,
  BinaryOptionsMarketsRequest as BinaryOptionsMarketsRequest,
  BinaryOptionsMarketsResponse as BinaryOptionsMarketsResponse,
  MarketRequest as DerivativeMarketRequest,
  MarketResponse as DerivativeMarketResponse,
  BinaryOptionsMarketRequest as BinaryOptionsMarketRequest,
  BinaryOptionsMarketResponse as BinaryOptionsMarketResponse,
  OrderbookRequest as DerivativeOrderbookRequest,
  OrderbookResponse as DerivativeOrderbookResponse,
  OrdersRequest as DerivativeOrdersRequest,
  OrdersResponse as DerivativeOrdersResponse,
  OrdersHistoryRequest as DerivativeOrdersHistoryRequest,
  OrdersHistoryResponse as DerivativeOrdersHistoryResponse,
  TradesRequest as DerivativeTradesRequest,
  TradesResponse as DerivativeTradesResponse,
  PositionsRequest as DerivativePositionsRequest,
  PositionsResponse as DerivativePositionsResponse,
  SubaccountOrdersListRequest as DerivativeSubaccountOrdersListRequest,
  SubaccountOrdersListResponse as DerivativeSubaccountOrdersListResponse,
  SubaccountTradesListRequest as DerivativeSubaccountTradesListRequest,
  SubaccountTradesListResponse as DerivativeSubaccountTradesListResponse,
  OrderbooksRequest as DerivativeOrderbooksRequest,
  OrderbooksResponse as DerivativeOrderbooksResponse,
} from '@injectivelabs/indexer-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPC } from '@injectivelabs/indexer-api/injective_derivative_exchange_rpc_pb_service'
import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'
import BaseConsumer from '../../BaseGrpcConsumer'
import { IndexerGrpcDerivativeTransformer } from '../transformers'
import { DerivativeOrderSide, DerivativeOrderState } from '../types/derivatives'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcDerivativesApi extends BaseConsumer {
  async fetchMarkets(params?: { marketStatus?: string; quoteDenom?: string }) {
    const { marketStatus, quoteDenom } = params || {}

    const request = new DerivativeMarketsRequest()

    if (marketStatus) {
      request.setMarketStatus(marketStatus)
    }
    if (quoteDenom) {
      request.setQuoteDenom(quoteDenom)
    }

    try {
      const response = await this.request<
        DerivativeMarketsRequest,
        DerivativeMarketsResponse,
        typeof InjectiveDerivativeExchangeRPC.Markets
      >(request, InjectiveDerivativeExchangeRPC.Markets)

      return IndexerGrpcDerivativeTransformer.marketsResponseToMarkets(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchMarket(marketId: string) {
    const request = new DerivativeMarketRequest()

    request.setMarketId(marketId)

    try {
      const response = await this.request<
        DerivativeMarketRequest,
        DerivativeMarketResponse,
        typeof InjectiveDerivativeExchangeRPC.Market
      >(request, InjectiveDerivativeExchangeRPC.Market)

      return IndexerGrpcDerivativeTransformer.marketResponseToMarket(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchBinaryOptionsMarkets(params?: {
    marketStatus?: string
    quoteDenom?: string
  }) {
    const { marketStatus, quoteDenom } = params || {}

    const request = new BinaryOptionsMarketsRequest()

    if (marketStatus) {
      request.setMarketStatus(marketStatus)
    }
    if (quoteDenom) {
      request.setQuoteDenom(quoteDenom)
    }

    try {
      const response = await this.request<
        BinaryOptionsMarketsRequest,
        BinaryOptionsMarketsResponse,
        typeof InjectiveDerivativeExchangeRPC.BinaryOptionsMarkets
      >(request, InjectiveDerivativeExchangeRPC.BinaryOptionsMarkets)

      return IndexerGrpcDerivativeTransformer.binaryOptionsMarketsResponseToBinaryOptionsMarkets(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchBinaryOptionsMarket(marketId: string) {
    const request = new BinaryOptionsMarketRequest()

    request.setMarketId(marketId)

    try {
      const response = await this.request<
        BinaryOptionsMarketRequest,
        BinaryOptionsMarketResponse,
        typeof InjectiveDerivativeExchangeRPC.BinaryOptionsMarket
      >(request, InjectiveDerivativeExchangeRPC.BinaryOptionsMarket)

      return IndexerGrpcDerivativeTransformer.binaryOptionsMarketResponseToBinaryOptionsMarket(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrderbook(marketId: string) {
    const request = new DerivativeOrderbookRequest()

    request.setMarketId(marketId)

    try {
      const response = await this.request<
        DerivativeOrderbookRequest,
        DerivativeOrderbookResponse,
        typeof InjectiveDerivativeExchangeRPC.Orderbook
      >(request, InjectiveDerivativeExchangeRPC.Orderbook)

      return IndexerGrpcDerivativeTransformer.orderbookResponseToOrderbook(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
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

    const request = new DerivativeOrdersRequest()

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

    if (isConditional !== undefined) {
      request.setIsConditional(isConditional ? 'true' : 'false')
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
        DerivativeOrdersRequest,
        DerivativeOrdersResponse,
        typeof InjectiveDerivativeExchangeRPC.Orders
      >(request, InjectiveDerivativeExchangeRPC.Orders)

      return IndexerGrpcDerivativeTransformer.ordersResponseToOrders(response)
    } catch (e: any) {
      throw new Error(e.message)
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

    const request = new DerivativeOrdersHistoryRequest()

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

    if (isConditional !== undefined) {
      request.setIsConditional(isConditional ? 'true' : 'false')
    }

    if (state) {
      request.setState(state)
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
        DerivativeOrdersHistoryRequest,
        DerivativeOrdersHistoryResponse,
        typeof InjectiveDerivativeExchangeRPC.OrdersHistory
      >(request, InjectiveDerivativeExchangeRPC.OrdersHistory)

      return IndexerGrpcDerivativeTransformer.orderHistoryResponseToOrderHistory(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
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

    const request = new DerivativePositionsRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (marketIds) {
      request.setMarketIdsList(marketIds)
    }

    if (direction) {
      request.setDirection(direction)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
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
        DerivativePositionsRequest,
        DerivativePositionsResponse,
        typeof InjectiveDerivativeExchangeRPC.Positions
      >(request, InjectiveDerivativeExchangeRPC.Positions)

      return IndexerGrpcDerivativeTransformer.positionsResponseToPositions(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
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

    const request = new DerivativeTradesRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (marketIds) {
      request.setMarketIdsList(marketIds)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (marketIds) {
      request.setMarketIdsList(marketIds)
    } else {
      request.setMarketIdsList([])
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
        DerivativeTradesRequest,
        DerivativeTradesResponse,
        typeof InjectiveDerivativeExchangeRPC.Trades
      >(request, InjectiveDerivativeExchangeRPC.Trades)

      return IndexerGrpcDerivativeTransformer.tradesResponseToTrades(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchFundingPayments(params?: {
    marketId?: string
    marketIds?: string[]
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, marketIds, subaccountId, pagination } = params || {}

    const request = new FundingPaymentsRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (marketIds) {
      request.setMarketIdsList(marketIds)
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
        FundingPaymentsRequest,
        FundingPaymentsResponse,
        typeof InjectiveDerivativeExchangeRPC.FundingPayments
      >(request, InjectiveDerivativeExchangeRPC.FundingPayments)

      return IndexerGrpcDerivativeTransformer.fundingPaymentsResponseToFundingPayments(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchFundingRates(params?: {
    marketId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, pagination } = params || {}

    const request = new FundingRatesRequest()

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
        FundingRatesRequest,
        FundingRatesResponse,
        typeof InjectiveDerivativeExchangeRPC.FundingRates
      >(request, InjectiveDerivativeExchangeRPC.FundingRates)

      return IndexerGrpcDerivativeTransformer.fundingRatesResponseToFundingRates(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchSubaccountOrdersList(params?: {
    marketId?: string
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, pagination } = params || {}

    const request = new DerivativeSubaccountOrdersListRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
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
        DerivativeSubaccountOrdersListRequest,
        DerivativeSubaccountOrdersListResponse,
        typeof InjectiveDerivativeExchangeRPC.SubaccountOrdersList
      >(request, InjectiveDerivativeExchangeRPC.SubaccountOrdersList)

      return IndexerGrpcDerivativeTransformer.ordersResponseToOrders(response)
    } catch (e: any) {
      throw new Error(e.message)
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

    const request = new DerivativeSubaccountTradesListRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
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
        DerivativeSubaccountTradesListRequest,
        DerivativeSubaccountTradesListResponse,
        typeof InjectiveDerivativeExchangeRPC.SubaccountTradesList
      >(request, InjectiveDerivativeExchangeRPC.SubaccountTradesList)

      return IndexerGrpcDerivativeTransformer.subaccountTradesListResponseToSubaccountTradesList(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrderbooks(marketIds: string[]) {
    const request = new DerivativeOrderbooksRequest()

    if (marketIds.length > 0) {
      request.setMarketIdsList(marketIds)
    }

    try {
      const response = await this.request<
        DerivativeOrderbooksRequest,
        DerivativeOrderbooksResponse,
        typeof InjectiveDerivativeExchangeRPC.Orderbooks
      >(request, InjectiveDerivativeExchangeRPC.Orderbooks)

      return IndexerGrpcDerivativeTransformer.orderbooksResponseToOrderbooks(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
