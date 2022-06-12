import {
  FundingPaymentsRequest,
  FundingPaymentsResponse,
  FundingRatesRequest,
  FundingRatesResponse,
  MarketsRequest as DerivativeMarketsRequest,
  MarketsResponse as DerivativeMarketsResponse,
  MarketRequest as DerivativeMarketRequest,
  MarketResponse as DerivativeMarketResponse,
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
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPC } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ExchangeGrpcDerivativeTransformer } from '../transformers'
import { DerivativeOrderSide } from '../types/derivatives'

export class ExchangeGrpcDerivativesApi extends BaseConsumer {
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

      return ExchangeGrpcDerivativeTransformer.marketsResponseToMarkets(
        response,
      )
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

      return ExchangeGrpcDerivativeTransformer.marketResponseToMarket(response)
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

      return ExchangeGrpcDerivativeTransformer.orderbookResponseToOrderbook(
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

      return ExchangeGrpcDerivativeTransformer.ordersResponseToOrders(response)
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

      return ExchangeGrpcDerivativeTransformer.positionsResponseToPositions(
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
    executionSide?: TradeExecutionSide
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, direction, pagination, executionSide } =
      params || {}

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

      return ExchangeGrpcDerivativeTransformer.tradesResponseToTrades(response)
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

      return ExchangeGrpcDerivativeTransformer.fundingPaymentsResponseToFundingPayments(
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

      return ExchangeGrpcDerivativeTransformer.fundingRatesResponseToFundingRates(
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

      return ExchangeGrpcDerivativeTransformer.ordersResponseToOrders(response)
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

      return ExchangeGrpcDerivativeTransformer.tradesResponseToTrades(response)
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

      return ExchangeGrpcDerivativeTransformer.orderbooksResponseToOrderbooks(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
