import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
import {
  BinaryOptionsOrderSide,
  BinaryOptionsOrderState,
  GrpcBinaryOptionsMarketInfo,
  GrpcBinaryOptionsLimitOrder,
  GrpcBinaryOptionsTrade,
  BinaryOptionsMarket,
  BinaryOptionsLimitOrder,
  BinaryOptionsTrade,
  GrpcBinaryOptionsPosition,
} from '../types/binary-options'
import {
  GrpcPriceLevel,
  Orderbook,
  PriceLevel,
  GrpcTokenMeta,
  ExchangeTokenMeta,
} from '../types/exchange'
import {
  OrderbookResponse as BinaryOptionsOrderbookResponse,
  OrdersResponse as BinaryOptionsOrdersResponse,
  TradesResponse as BinaryOptionsTradesResponse,
  PositionsResponse as BinaryOptionsPositionsResponse,
  OrderbooksResponse as BinaryOptionsOrderbooksResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import {
  MarketsResponse as BinaryOptionsMarketsResponse,
  MarketResponse as BinaryOptionsMarketResponse,
} from '@injectivelabs/exchange-api/injective_binary_options_exchange_rpc_pb'
import { GrpcPositionDelta, Position, PositionDelta } from '../types'

const zeroPositionDelta = () => ({
  tradeDirection: TradeDirection.Buy,
  executionPrice: '0',
  executionQuantity: '0',
  executionMargin: '0',
})

export class ExchangeGrpcBinaryOptionsTransformer {
  static grpcTokenMetaToTokenMeta(
    tokenMeta: GrpcTokenMeta | undefined,
  ): ExchangeTokenMeta | undefined {
    if (!tokenMeta) {
      return
    }

    return {
      name: tokenMeta.getName(),
      address: tokenMeta.getAddress(),
      symbol: tokenMeta.getSymbol(),
      logo: tokenMeta.getLogo(),
      decimals: tokenMeta.getDecimals(),
      updatedAt: tokenMeta.getUpdatedAt(),
      coinGeckoId: '',
    }
  }

  static marketResponseToMarket(response: BinaryOptionsMarketResponse) {
    const market = response.getMarket()!

    return ExchangeGrpcBinaryOptionsTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(response: BinaryOptionsMarketsResponse) {
    const markets = response.getMarketsList()

    return ExchangeGrpcBinaryOptionsTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(response: BinaryOptionsOrdersResponse) {
    const orders = response.getOrdersList()

    return ExchangeGrpcBinaryOptionsTransformer.grpcOrdersToOrders(orders)
  }

  static positionsResponseToPositions(
    response: BinaryOptionsPositionsResponse,
  ) {
    const positions = response.getPositionsList()

    return ExchangeGrpcBinaryOptionsTransformer.grpcPositionsToPositions(
      positions,
    )
  }

  static tradesResponseToTrades(response: BinaryOptionsTradesResponse) {
    const trades = response.getTradesList()

    return ExchangeGrpcBinaryOptionsTransformer.grpcTradesToTrades(trades)
  }

  static orderbookResponseToOrderbook(
    response: BinaryOptionsOrderbookResponse,
  ) {
    const orderbook = response.getOrderbook()!

    return ExchangeGrpcBinaryOptionsTransformer.grpcOrderbookToOrderbook({
      buys: orderbook?.getBuysList(),
      sells: orderbook?.getSellsList(),
    })
  }

  static orderbooksResponseToOrderbooks(
    response: BinaryOptionsOrderbooksResponse,
  ) {
    const orderbooks = response.getOrderbooksList()!

    return orderbooks.map((o) => {
      const orderbook = o.getOrderbook()!

      return ExchangeGrpcBinaryOptionsTransformer.grpcOrderbookToOrderbook({
        buys: orderbook.getBuysList(),
        sells: orderbook.getSellsList(),
      })
    })
  }

  static grpcMarketToMarket(
    market: GrpcBinaryOptionsMarketInfo,
  ): BinaryOptionsMarket {
    return {
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      oracleSymbol: market.getOracleSymbol(),
      oracleProvider: market.getOracleProvider(),
      oracleType: market.getOracleType(),
      oracleScaleFactor: market.getOracleScaleFactor(),
      expirationTimestamp: market.getExpirationTimestamp(),
      settlementTimestamp: market.getSettlementTimestamp(),
      quoteDenom: market.getQuoteDenom(),
      quoteToken: ExchangeGrpcBinaryOptionsTransformer.grpcTokenMetaToTokenMeta(
        market.getQuoteTokenMeta(),
      ),
      makerFeeRate: market.getMakerFeeRate(),
      takerFeeRate: market.getTakerFeeRate(),
      serviceProviderFee: market.getServiceProviderFee(),
      minPriceTickSize: market.getMinPriceTickSize(),
      minQuantityTickSize: market.getMinQuantityTickSize(),
      settlementPrice: market.getSettlementPrice(),
    }
  }

  static grpcMarketsToMarkets(
    markets: GrpcBinaryOptionsMarketInfo[],
  ): BinaryOptionsMarket[] {
    return markets.map((market) =>
      ExchangeGrpcBinaryOptionsTransformer.grpcMarketToMarket(market),
    )
  }

  static grpcPositionDeltaToPositionDelta(
    positionDelta: GrpcPositionDelta,
  ): PositionDelta {
    return {
      tradeDirection: positionDelta.getTradeDirection() as TradeDirection,
      executionPrice: positionDelta.getExecutionPrice(),
      executionQuantity: positionDelta.getExecutionQuantity(),
      executionMargin: positionDelta.getExecutionMargin(),
    }
  }

  static grpcPriceLevelToPriceLevel(priceLevel: GrpcPriceLevel): PriceLevel {
    return {
      price: priceLevel.getPrice(),
      quantity: priceLevel.getQuantity(),
      timestamp: priceLevel.getTimestamp(),
    }
  }

  static grpcPriceLevelsToPriceLevels(
    priceLevels: GrpcPriceLevel[],
  ): PriceLevel[] {
    return priceLevels.map((priceLevel) =>
      ExchangeGrpcBinaryOptionsTransformer.grpcPriceLevelToPriceLevel(
        priceLevel,
      ),
    )
  }

  static grpcOrderbookToOrderbook({
    buys,
    sells,
  }: {
    buys: GrpcPriceLevel[]
    sells: GrpcPriceLevel[]
  }): Orderbook {
    return {
      buys: ExchangeGrpcBinaryOptionsTransformer.grpcPriceLevelsToPriceLevels(
        buys,
      ),
      sells:
        ExchangeGrpcBinaryOptionsTransformer.grpcPriceLevelsToPriceLevels(
          sells,
        ),
    }
  }

  static grpcOrderToOrder(
    order: GrpcBinaryOptionsLimitOrder,
  ): BinaryOptionsLimitOrder {
    return {
      orderHash: order.getOrderHash(),
      orderSide: order.getOrderSide() as BinaryOptionsOrderSide,
      marketId: order.getMarketId(),
      subaccountId: order.getSubaccountId(),
      isReduceOnly: order.getIsReduceOnly(),
      margin: order.getMargin(),
      price: order.getPrice(),
      quantity: order.getQuantity(),
      unfilledQuantity: order.getUnfilledQuantity(),
      triggerPrice: order.getTriggerPrice(),
      feeRecipient: order.getFeeRecipient(),
      state: order.getState() as BinaryOptionsOrderState,
    }
  }

  static grpcOrdersToOrders(
    orders: GrpcBinaryOptionsLimitOrder[],
  ): BinaryOptionsLimitOrder[] {
    return orders.map((order) =>
      ExchangeGrpcBinaryOptionsTransformer.grpcOrderToOrder(order),
    )
  }

  static grpcPositionToPosition(position: GrpcBinaryOptionsPosition): Position {
    return {
      marketId: position.getMarketId(),
      subaccountId: position.getSubaccountId(),
      direction: position.getDirection() as TradeDirection,
      quantity: position.getQuantity(),
      entryPrice: position.getEntryPrice(),
      margin: position.getMargin(),
      aggregateReduceOnlyQuantity: position.getAggregateReduceOnlyQuantity(),
      liquidationPrice: position.getLiquidationPrice(),
      markPrice: position.getMarkPrice(),
      ticker: position.getTicker(),
    }
  }

  static grpcPositionsToPositions(
    positions: GrpcBinaryOptionsPosition[],
  ): Position[] {
    return positions.map((position) =>
      ExchangeGrpcBinaryOptionsTransformer.grpcPositionToPosition(position),
    )
  }

  static grpcTradeToTrade(trade: GrpcBinaryOptionsTrade): BinaryOptionsTrade {
    const positionDelta = trade.getPositionDelta()
    const mappedPositionDelta = positionDelta
      ? ExchangeGrpcBinaryOptionsTransformer.grpcPositionDeltaToPositionDelta(
          positionDelta,
        )
      : zeroPositionDelta()

    return {
      orderHash: trade.getOrderHash(),
      subaccountId: trade.getSubaccountId(),
      marketId: trade.getMarketId(),
      executedAt: trade.getExecutedAt(),
      tradeExecutionType: trade.getTradeExecutionType() as TradeExecutionType,
      fee: trade.getFee(),
      feeRecipient:
        trade.getFeeRecipient !== undefined ? trade.getFeeRecipient() : '', // TODO: remove the check
      isLiquidation: trade.getIsLiquidation(),
      payout: trade.getPayout(),
      ...mappedPositionDelta,
    }
  }

  static grpcTradesToTrades(
    trades: GrpcBinaryOptionsTrade[],
  ): BinaryOptionsTrade[] {
    return trades.map((trade) =>
      ExchangeGrpcBinaryOptionsTransformer.grpcTradeToTrade(trade),
    )
  }
}
