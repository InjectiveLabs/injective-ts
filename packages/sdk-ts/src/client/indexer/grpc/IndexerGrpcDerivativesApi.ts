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
import { DerivativeOrderSide } from '../types/derivatives'

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
    orderSide?: DerivativeOrderSide
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, orderSide, pagination } = params || {}

    const request = new DerivativeOrdersRequest()

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
        DerivativeOrdersRequest,
        DerivativeOrdersResponse,
        typeof InjectiveDerivativeExchangeRPC.Orders
      >(request, InjectiveDerivativeExchangeRPC.Orders)

      return IndexerGrpcDerivativeTransformer.ordersResponseToOrders(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchPositions(params?: {
    marketId?: string
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, pagination } = params || {}

    const request = new DerivativePositionsRequest()

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
    executionSide?: TradeExecutionSide
    pagination?: PaginationOption
  }) {
    const {
      marketId,
      subaccountId,
      startTime,
      endTime,
      direction,
      pagination,
      executionSide,
    } = params || {}

    const request = new DerivativeTradesRequest()

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
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, pagination } = params || {}

    const request = new FundingPaymentsRequest()

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
      return IndexerGrpcDerivativeTransformer.tradesResponseToTrades(
        response as DerivativeTradesResponse,
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
