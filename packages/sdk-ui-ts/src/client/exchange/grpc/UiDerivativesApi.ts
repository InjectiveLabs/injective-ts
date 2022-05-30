import { TradeExecutionSide } from '@injectivelabs/ts-types'
import { DerivativesMetrics } from '../../../types/metrics'
import {
  DerivativeOrderSide,
  UiBaseDerivativeMarket,
} from '../../../types/derivatives'
import {
  ExchangeGrpcDerivativesApi,
  ExchangeGrpcDerivativeTransformer,
} from '@injectivelabs/sdk-ts/client/exchange'
import { Orderbook } from '@injectivelabs/sdk-ts'
import { BaseApi } from '../../../BaseApi'
import { ApiOptions } from '../../../types'

export class UiDerivativesApi extends BaseApi {
  protected client: ExchangeGrpcDerivativesApi

  constructor(options: ApiOptions) {
    super(options)
    this.client = new ExchangeGrpcDerivativesApi(options.endpoints.exchangeApi)
  }

  async fetchMarkets(): Promise<UiBaseDerivativeMarket[]> {
    const promise = this.client.fetchMarkets()
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchMarkets,
    )
    const markets = response.getMarketsList()

    return ExchangeGrpcDerivativeTransformer.grpcMarketsToMarkets(markets)
  }

  async fetchMarket(marketId: string): Promise<UiBaseDerivativeMarket> {
    const promise = this.client.fetchMarket(marketId)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchMarket,
    )
    const market = response.getMarket()

    if (!market) {
      throw new Error(
        `The derivative market with ${marketId} marketId not found!`,
      )
    }

    return ExchangeGrpcDerivativeTransformer.grpcMarketToMarket(market)
  }

  async fetchOrderbook(marketId: string) {
    const promise = this.client.fetchOrderbook(marketId)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrderbook,
    )
    const orderbook = response.getOrderbook()

    if (!orderbook) {
      throw new Error(
        `The orderbook for the derivative market with ${marketId} marketId not found!`,
      )
    }

    const buys = orderbook.getBuysList()
    const sells = orderbook.getSellsList()

    return ExchangeGrpcDerivativeTransformer.grpcOrderbookToOrderbook({
      buys,
      sells,
    })
  }

  async fetchMarketsOrderbook(marketIds: string[]): Promise<Orderbook[]> {
    const promise = this.client.fetchOrderbooks(marketIds)
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrderbook,
    )
    const orderbooks = response.getOrderbooksList()

    return orderbooks
      .map((singleOrderbook) => {
        const orderbook = singleOrderbook.getOrderbook()

        if (!orderbook) {
          return undefined
        }

        const buys = orderbook.getBuysList()
        const sells = orderbook.getSellsList()

        return ExchangeGrpcDerivativeTransformer.grpcOrderbookToOrderbook({
          buys,
          sells,
        })
      })
      .filter((o) => o) as Orderbook[]
  }

  async fetchTrades({
    marketId,
    subaccountId,
  }: {
    marketId?: string
    subaccountId?: string
  }) {
    // For market wide trades we get only `executionSide=Taker` trades
    const executionSide = subaccountId ? undefined : TradeExecutionSide.Taker
    const promise = this.client.fetchTrades({
      marketId,
      subaccountId,
      executionSide,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchTrades,
    )
    const trades = response.getTradesList()

    return ExchangeGrpcDerivativeTransformer.grpcTradesToTrades(trades)
  }

  async fetchPositions({
    marketId,
    subaccountId,
  }: {
    marketId?: string
    subaccountId?: string
  }) {
    const promise = this.client.fetchPositions({
      marketId,
      subaccountId,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchPositions,
    )
    const positions = response.getPositionsList()

    return ExchangeGrpcDerivativeTransformer.grpcPositionsToPositions(positions)
  }

  async fetchOrders({
    marketId,
    subaccountId,
    orderSide,
  }: {
    marketId?: string
    orderSide?: DerivativeOrderSide
    subaccountId: string
  }) {
    const promise = this.client.fetchOrders({
      marketId,
      orderSide,
      subaccountId,
    })
    const response = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrders,
    )
    const orders = response.getOrdersList()

    return ExchangeGrpcDerivativeTransformer.grpcOrdersToOrders(orders)
  }
}
