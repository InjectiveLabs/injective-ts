import {
  OrderbookRequest as BinaryOptionsOrderbookRequest,
  OrderbookResponse as BinaryOptionsOrderbookResponse,
  OrdersRequest as BinaryOptionsOrdersRequest,
  OrdersResponse as BinaryOptionsOrdersResponse,
  TradesRequest as BinaryOptionsTradesRequest,
  TradesResponse as BinaryOptionsTradesResponse,
  PositionsRequest as BinaryOptionsPositionsRequest,
  PositionsResponse as BinaryOptionsPositionsResponse,
  SubaccountOrdersListRequest as BinaryOptionsSubaccountOrdersListRequest,
  SubaccountOrdersListResponse as BinaryOptionsSubaccountOrdersListResponse,
  SubaccountTradesListRequest as BinaryOptionsSubaccountTradesListRequest,
  SubaccountTradesListResponse as BinaryOptionsSubaccountTradesListResponse,
  OrderbooksRequest as BinaryOptionsOrderbooksRequest,
  OrderbooksResponse as BinaryOptionsOrderbooksResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import {
  MarketsRequest as BinaryOptionsMarketsRequest,
  MarketsResponse as BinaryOptionsMarketsResponse,
  MarketRequest as BinaryOptionsMarketRequest,
  MarketResponse as BinaryOptionsMarketResponse,
} from '@injectivelabs/exchange-api/injective_binary_options_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPC as BaseInjectiveBinaryOptionsExchangeRPC } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import { InjectiveBinaryOptionsExchangeRPC } from '@injectivelabs/exchange-api/injective_binary_options_exchange_rpc_pb_service'
import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/exchange'
import { PaginationOption } from '../../../types/pagination'
import BaseConsumer from '../../BaseGrpcConsumer'
import { BinaryOptionsOrderSide } from '../types/binary-options'
import { ExchangeGrpcBinaryOptionsTransformer } from '../transformers/ExchangeGrpcBinaryOptionsTransformer'

export class ExchangeGrpcBinaryOptionsApi extends BaseConsumer {
  async fetchMarkets(params?: { marketStatus?: string; quoteDenom?: string }) {
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
        typeof InjectiveBinaryOptionsExchangeRPC.Markets
      >(request, InjectiveBinaryOptionsExchangeRPC.Markets)

      return ExchangeGrpcBinaryOptionsTransformer.marketsResponseToMarkets(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchMarket(marketId: string) {
    const request = new BinaryOptionsMarketRequest()

    request.setMarketId(marketId)

    try {
      const response = await this.request<
        BinaryOptionsMarketRequest,
        BinaryOptionsMarketResponse,
        typeof InjectiveBinaryOptionsExchangeRPC.Market
      >(request, InjectiveBinaryOptionsExchangeRPC.Market)

      return ExchangeGrpcBinaryOptionsTransformer.marketResponseToMarket(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrderbook(marketId: string) {
    const request = new BinaryOptionsOrderbookRequest()

    request.setMarketId(marketId)

    try {
      const response = await this.request<
        BinaryOptionsOrderbookRequest,
        BinaryOptionsOrderbookResponse,
        typeof BaseInjectiveBinaryOptionsExchangeRPC.Orderbook
      >(request, BaseInjectiveBinaryOptionsExchangeRPC.Orderbook)

      return ExchangeGrpcBinaryOptionsTransformer.orderbookResponseToOrderbook(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrders(params?: {
    marketId?: string
    orderSide?: BinaryOptionsOrderSide
    subaccountId?: string
    pagination?: PaginationOption
  }) {
    const { marketId, subaccountId, orderSide, pagination } = params || {}

    const request = new BinaryOptionsOrdersRequest()

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
        BinaryOptionsOrdersRequest,
        BinaryOptionsOrdersResponse,
        typeof BaseInjectiveBinaryOptionsExchangeRPC.Orders
      >(request, BaseInjectiveBinaryOptionsExchangeRPC.Orders)

      return ExchangeGrpcBinaryOptionsTransformer.ordersResponseToOrders(
        response,
      )
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

    const request = new BinaryOptionsPositionsRequest()

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
        BinaryOptionsPositionsRequest,
        BinaryOptionsPositionsResponse,
        typeof BaseInjectiveBinaryOptionsExchangeRPC.Positions
      >(request, BaseInjectiveBinaryOptionsExchangeRPC.Positions)

      return ExchangeGrpcBinaryOptionsTransformer.positionsResponseToPositions(
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

    const request = new BinaryOptionsTradesRequest()

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
        BinaryOptionsTradesRequest,
        BinaryOptionsTradesResponse,
        typeof BaseInjectiveBinaryOptionsExchangeRPC.Trades
      >(request, BaseInjectiveBinaryOptionsExchangeRPC.Trades)

      return ExchangeGrpcBinaryOptionsTransformer.tradesResponseToTrades(
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

    const request = new BinaryOptionsSubaccountOrdersListRequest()

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
        BinaryOptionsSubaccountOrdersListRequest,
        BinaryOptionsSubaccountOrdersListResponse,
        typeof BaseInjectiveBinaryOptionsExchangeRPC.SubaccountOrdersList
      >(request, BaseInjectiveBinaryOptionsExchangeRPC.SubaccountOrdersList)

      return ExchangeGrpcBinaryOptionsTransformer.ordersResponseToOrders(
        response,
      )
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

    const request = new BinaryOptionsSubaccountTradesListRequest()

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
        BinaryOptionsSubaccountTradesListRequest,
        BinaryOptionsSubaccountTradesListResponse,
        typeof BaseInjectiveBinaryOptionsExchangeRPC.SubaccountTradesList
      >(request, BaseInjectiveBinaryOptionsExchangeRPC.SubaccountTradesList)

      return ExchangeGrpcBinaryOptionsTransformer.tradesResponseToTrades(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchOrderbooks(marketIds: string[]) {
    const request = new BinaryOptionsOrderbooksRequest()

    if (marketIds.length > 0) {
      request.setMarketIdsList(marketIds)
    }

    try {
      const response = await this.request<
        BinaryOptionsOrderbooksRequest,
        BinaryOptionsOrderbooksResponse,
        typeof BaseInjectiveBinaryOptionsExchangeRPC.Orderbooks
      >(request, BaseInjectiveBinaryOptionsExchangeRPC.Orderbooks)

      return ExchangeGrpcBinaryOptionsTransformer.orderbooksResponseToOrderbooks(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
