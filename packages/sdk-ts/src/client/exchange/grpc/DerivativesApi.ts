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
import { DerivativeOrderSide } from '../../../types/derivatives'
import { TradeDirection, TradeExecutionSide } from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'
import BaseConsumer from '../../BaseGrpcConsumer'

export class DerivativesApi extends BaseConsumer {
  async fetchDerivativeMarkets({
                                 marketStatus,
                                 quoteDenom,
                               }: {
    marketStatus?: string,
    quoteDenom?: string,
                               }) {
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

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativeMarket(marketId: string) {
    const request = new DerivativeMarketRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        DerivativeMarketRequest,
        DerivativeMarketResponse,
        typeof InjectiveDerivativeExchangeRPC.Market
      >(request, InjectiveDerivativeExchangeRPC.Market)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativeOrderbook(marketId: string) {
    const request = new DerivativeOrderbookRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        DerivativeOrderbookRequest,
        DerivativeOrderbookResponse,
        typeof InjectiveDerivativeExchangeRPC.Orderbook
      >(request, InjectiveDerivativeExchangeRPC.Orderbook)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativeOrders({
    marketId,
    subaccountId,
    orderSide,
  }: {
    marketId?: string
    orderSide?: DerivativeOrderSide
    subaccountId?: string
  }) {
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

    try {
      const response = await this.request<
        DerivativeOrdersRequest,
        DerivativeOrdersResponse,
        typeof InjectiveDerivativeExchangeRPC.Orders
      >(request, InjectiveDerivativeExchangeRPC.Orders)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativePositions({
    marketId,
    subaccountId,
  }: {
    marketId?: string
    subaccountId?: string
  }) {
    const request = new DerivativePositionsRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    try {
      const response = await this.request<
        DerivativePositionsRequest,
        DerivativePositionsResponse,
        typeof InjectiveDerivativeExchangeRPC.Positions
      >(request, InjectiveDerivativeExchangeRPC.Positions)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativeTrades({
    marketId,
    subaccountId,
    direction,
    skip = 0,
    limit = 0,
    executionSide,
  }: {
    marketId?: string
    skip?: number
    limit?: number
    direction?: TradeDirection
    subaccountId?: string
    executionSide?: TradeExecutionSide
  }) {
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

    request.setSkip(skip)
    request.setLimit(limit)

    try {
      const response = await this.request<
        DerivativeTradesRequest,
        DerivativeTradesResponse,
        typeof InjectiveDerivativeExchangeRPC.Trades
      >(request, InjectiveDerivativeExchangeRPC.Trades)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativeFundingPayments({
    marketId,
    subaccountId,
    pagination,
  }: {
    marketId?: string
    subaccountId?: string
    pagination?: PaginationOption
  }) {
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

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativeFundingRates({
    marketId,
    pagination,
  }: {
    marketId?: string
    pagination?: PaginationOption
  }) {
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

      return response

    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativeSubaccountOrdersList({
    marketId,
    subaccountId
  }: {
    marketId?: string
    subaccountId?: string
  }) {
    const request = new DerivativeSubaccountOrdersListRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    try {
      const response = await this.request<DerivativeSubaccountOrdersListRequest,
        DerivativeSubaccountOrdersListResponse,
        typeof InjectiveDerivativeExchangeRPC.SubaccountOrdersList>(request, InjectiveDerivativeExchangeRPC.SubaccountOrdersList)

      return response

    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativeSubaccountTradesList({
    marketId,
    subaccountId,
    direction,
    executionSide
  }: {
    marketId?: string
    subaccountId?: string
    direction?: TradeDirection
    executionSide?: TradeExecutionSide
  }) {
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

    if (executionSide) {
      request.setExecutionType(executionSide)
    }

    try {
      const response = await this.request<DerivativeSubaccountTradesListRequest,
        DerivativeSubaccountTradesListResponse,
        typeof InjectiveDerivativeExchangeRPC.SubaccountTradesList>(request, InjectiveDerivativeExchangeRPC.SubaccountTradesList)

      return response

    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchDerivativeOrderbooks({
    marketIds
  }: {
    marketIds?: string[]
  }) {
    const request = new DerivativeOrderbooksRequest()

    if (marketIds) {
      request.setMarketIdsList(marketIds)
    }

    try {
      const response = await this.request<DerivativeOrderbooksRequest,
        DerivativeOrderbooksResponse,
        typeof InjectiveDerivativeExchangeRPC.Orderbooks>(request, InjectiveDerivativeExchangeRPC.Orderbooks)

      return response

    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
