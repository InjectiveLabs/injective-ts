import {
  DerivativeMarketChronosConsumer,
  DerivativeMarketConsumer,
  DerivativeOrderSide,
  DerivativeTransformer,
} from '@injectivelabs/derivatives-consumer'
import { OracleConsumer } from '@injectivelabs/exchange-consumer'
import { TradeExecutionSide } from '@injectivelabs/ts-types'
import { DerivativesMetrics, ServiceOptions } from '../../types'
import { BaseService } from '../BaseService'
import { UiBaseDerivativeMarket, UiDerivativeMarketSummary } from './types'
import { zeroDerivativeMarketSummary } from './utils'
import { ZERO_TO_STRING } from '../../constants'

export class DerivativeService extends BaseService {
  protected consumer: DerivativeMarketConsumer

  protected oracleConsumer: OracleConsumer

  protected chronosConsumer: DerivativeMarketChronosConsumer

  constructor(options: ServiceOptions) {
    super(options)
    this.consumer = new DerivativeMarketConsumer(this.endpoints.exchangeApi)
    this.chronosConsumer = new DerivativeMarketChronosConsumer(
      `${this.endpoints.exchangeApi}/api`,
    )
    this.oracleConsumer = new OracleConsumer(this.endpoints.exchangeApi)
  }

  async fetchMarkets(): Promise<UiBaseDerivativeMarket[]> {
    const promise = this.consumer.fetchMarkets()
    const markets = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchMarkets,
    )

    return DerivativeTransformer.grpcMarketsToMarkets(markets)
  }

  async fetchMarket(marketId: string): Promise<UiBaseDerivativeMarket> {
    const promise = this.consumer.fetchMarket(marketId)
    const market = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchMarket,
    )

    return DerivativeTransformer.grpcMarketToMarket(market)
  }

  async fetchOrderbook(marketId: string) {
    const promise = this.consumer.fetchOrderbook(marketId)
    const orderbook = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrderbook,
    )

    return DerivativeTransformer.grpcOrderbookToOrderbook(orderbook)
  }

  async fetchMarketsOrderbook(marketIds: string[]) {
    const promise = Promise.all(
      marketIds.map(async (marketId) => this.consumer.fetchOrderbook(marketId)),
    )
    const marketsOrderbook = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrderbook,
    )

    return marketsOrderbook.map((orderbook) =>
      DerivativeTransformer.grpcOrderbookToOrderbook(orderbook),
    )
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
    const promise = this.consumer.fetchTrades({
      marketId,
      subaccountId,
      executionSide,
    })
    const trades = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchTrades,
    )

    return DerivativeTransformer.grpcTradesToTrades(trades)
  }

  async fetchPositions({
    marketId,
    subaccountId,
  }: {
    marketId?: string
    subaccountId?: string
  }) {
    const promise = this.consumer.fetchPositions({
      marketId,
      subaccountId,
    })
    const positions = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchPositions,
    )

    return DerivativeTransformer.grpcPositionsToPositions(positions)
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
    const promise = this.consumer.fetchOrders({
      marketId,
      orderSide,
      subaccountId,
    })
    const orders = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrders,
    )

    return DerivativeTransformer.grpcOrdersToOrders(orders)
  }

  async fetchMarketMarkPrice(market: UiBaseDerivativeMarket) {
    const promise = this.oracleConsumer.price({
      baseSymbol: market.oracleBase,
      quoteSymbol: market.oracleQuote,
      oracleType: market.oracleType,
    })
    const price = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchOrders,
    )

    return price || ZERO_TO_STRING
  }

  async fetchMarketSummary(
    marketId: string,
  ): Promise<UiDerivativeMarketSummary> {
    const promise = this.chronosConsumer.fetchDerivativeMarketSummary(marketId)
    const marketSummary = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchMarketSummary,
    )

    if (!marketSummary) {
      return zeroDerivativeMarketSummary(marketId)
    }

    return {
      ...marketSummary,
      marketId,
    }
  }

  async fetchMarketsSummary(): Promise<UiDerivativeMarketSummary[]> {
    const promise = this.chronosConsumer.fetchDerivativeMarketsSummary()
    const marketsSummary = await this.fetchOrFetchAndMeasure(
      promise,
      DerivativesMetrics.FetchMarketsSummary,
    )

    return marketsSummary || []
  }
}
