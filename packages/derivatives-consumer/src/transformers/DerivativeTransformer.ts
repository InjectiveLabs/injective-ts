import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
import {
  GrpcPriceLevel,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeLimitOrder,
  GrpcDerivativeTrade,
  DerivativeOrderType,
  Orderbook,
  PriceLevel,
  DerivativeMarket,
  DerivativeLimitOrder,
  DerivativeTrade,
  DerivativeOrderState,
  GrpcTokenMeta,
  TokenMeta,
  PositionDelta,
  GrpcDerivativePosition,
  Position,
  GrpcPositionDelta,
} from '../types'

const zeroPositionDelta = () => ({
  tradeDirection: TradeDirection.Buy,
  executionPrice: '0',
  executionQuantity: '0',
  executionMargin: '0',
})

export class DerivativeTransformer {
  static grpcTokenMetaToTokenMeta(
    tokenMeta: GrpcTokenMeta | undefined,
  ): TokenMeta | undefined {
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
    }
  }

  static grpcMarketToMarket(
    market: GrpcDerivativeMarketInfo,
  ): DerivativeMarket {
    return {
      oracleBase: market.getOracleBase(),
      oracleQuote: market.getOracleQuote(),
      oracleType: market.getOracleType(),
      initialMarginRatio: market.getInitialMarginRatio(),
      maintenanceMarginRatio: market.getMaintenanceMarginRatio(),
      isPerpetual: market.getIsPerpetual(),
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      quoteDenom: market.getQuoteDenom(),
      quoteToken: DerivativeTransformer.grpcTokenMetaToTokenMeta(
        market.getQuoteTokenMeta(),
      ),
      makerFeeRate: market.getMakerFeeRate(),
      takerFeeRate: market.getTakerFeeRate(),
      serviceProviderFee: market.getServiceProviderFee(),
      minPriceTickSize: parseFloat(market.getMinPriceTickSize()),
      minQuantityTickSize: parseFloat(market.getMinQuantityTickSize()),
    }
  }

  static grpcMarketsToMarkets(
    markets: GrpcDerivativeMarketInfo[],
  ): DerivativeMarket[] {
    return markets.map((market) =>
      DerivativeTransformer.grpcMarketToMarket(market),
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
      DerivativeTransformer.grpcPriceLevelToPriceLevel(priceLevel),
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
      buys: DerivativeTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells: DerivativeTransformer.grpcPriceLevelsToPriceLevels(sells),
    }
  }

  static grpcOrderToOrder(
    order: GrpcDerivativeLimitOrder,
  ): DerivativeLimitOrder {
    return {
      orderHash: order.getOrderHash(),
      orderType: order.getOrderType() as DerivativeOrderType,
      marketId: order.getMarketId(),
      subaccountId: order.getSubaccountId(),
      isReduceOnly: order.getIsReduceOnly(),
      margin: order.getMargin(),
      price: order.getPrice(),
      quantity: order.getQuantity(),
      unfilledQuantity: order.getUnfilledQuantity(),
      triggerPrice: order.getTriggerPrice(),
      feeRecipient: order.getFeeRecipient(),
      state: order.getState() as DerivativeOrderState,
    }
  }

  static grpcOrdersToOrders(
    orders: GrpcDerivativeLimitOrder[],
  ): DerivativeLimitOrder[] {
    return orders.map((order) => DerivativeTransformer.grpcOrderToOrder(order))
  }

  static grpcPositionToPosition(order: GrpcDerivativePosition): Position {
    return {
      marketId: order.getMarketId(),
      subaccountId: order.getSubaccountId(),
      direction: order.getDirection() as TradeDirection,
      quantity: order.getQuantity(),
      entryPrice: order.getEntryPrice(),
      margin: order.getMargin(),
      liquidationPrice: order.getLiquidationPrice(),
      markPrice: order.getMarkPrice(),
      unrealizedPnl: order.getUnrealizedPnl(),
      ticker: order.getTicker(),
    }
  }

  static grpcPositionsToPositions(
    positions: GrpcDerivativePosition[],
  ): Position[] {
    return positions.map((position) =>
      DerivativeTransformer.grpcPositionToPosition(position),
    )
  }

  static grpcTradeToTrade(trade: GrpcDerivativeTrade): DerivativeTrade {
    const positionDelta = trade.getPositionDelta()
    const mappedPositionDelta = positionDelta
      ? DerivativeTransformer.grpcPositionDeltaToPositionDelta(positionDelta)
      : zeroPositionDelta()

    return {
      orderHash: trade.getOrderHash(),
      subaccountId: trade.getSubaccountId(),
      marketId: trade.getMarketId(),
      executedAt: trade.getExecutedAt(),
      tradeExecutionType: trade.getTradeExecutionType() as TradeExecutionType,
      fee: trade.getFee(),
      isLiquidation: trade.getIsLiquidation(),
      payout: trade.getPayout(),
      ...mappedPositionDelta,
    }
  }

  static grpcTradesToTrades(trades: GrpcDerivativeTrade[]): DerivativeTrade[] {
    return trades.map((trade) => DerivativeTransformer.grpcTradeToTrade(trade))
  }
}
