import {
  GrpcPriceLevel,
  GrpcSpotMarketInfo,
  GrpcSpotMarketOrder,
  GrpcSpotMarketTrade,
  SpotOrderType,
  TradeDirection,
  TradeExecutionType,
  Orderbook,
  PriceLevel,
  SpotMarket,
  SpotMarketOrder,
  SpotMarketTrade,
} from '../types'

const zeroPriceLevel = () => ({
  price: '0',
  quantity: '0',
  timestamp: '0',
})

export class SpotMarketTransformer {
  static grpcMarketToMarket(market: GrpcSpotMarketInfo): SpotMarket {
    return {
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      baseDenom: market.getBaseDenom(),
      quoteDenom: market.getQuoteDenom(),
      makerFeeRate: market.getMakerFeeRate(),
      takerFeeRate: market.getTakerFeeRate(),
      serviceProviderFee: market.getServiceProviderFee(),
      maxPriceScaleDecimals: market.getMaxPriceScaleDecimals(),
      maxQuantityScaleDecimals: market.getMaxQuantityScaleDecimals(),
    }
  }

  static grpcMarketsToMarkets(markets: GrpcSpotMarketInfo[]): SpotMarket[] {
    return markets.map((market) =>
      SpotMarketTransformer.grpcMarketToMarket(market),
    )
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
      SpotMarketTransformer.grpcPriceLevelToPriceLevel(priceLevel),
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
      buys: SpotMarketTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells: SpotMarketTransformer.grpcPriceLevelsToPriceLevels(sells),
    }
  }

  static grpcOrderToOrder(order: GrpcSpotMarketOrder): SpotMarketOrder {
    return {
      orderHash: order.getOrderHash(),
      orderType: order.getOrderType() as SpotOrderType,
      marketId: order.getMarketId(),
      subaccountId: order.getSubaccountId(),
      price: order.getPrice(),
      quantity: order.getQuantity(),
      unfilledQuantity: order.getUnfilledQuantity(),
      triggerPrice: order.getTriggerPrice(),
      feeRecipient: order.getFeeRecipient(),
    }
  }

  static grpcOrdersToOrders(orders: GrpcSpotMarketOrder[]): SpotMarketOrder[] {
    return orders.map((order) => SpotMarketTransformer.grpcOrderToOrder(order))
  }

  static grpcTradeToTrade(trade: GrpcSpotMarketTrade): SpotMarketTrade {
    const price = trade.getPrice()
    const mappedPrice = price
      ? SpotMarketTransformer.grpcPriceLevelToPriceLevel(price)
      : zeroPriceLevel()

    return {
      orderHash: trade.getOrderHash(),
      subaccountId: trade.getSubaccountId(),
      marketId: trade.getMarketId(),
      executedAt: trade.getExecutedAt(),
      tradeExecutionType: trade.getTradeExecutionType() as TradeExecutionType,
      tradeDirection: trade.getTradeDirection() as TradeDirection,
      fee: trade.getFee(),
      ...mappedPrice,
    }
  }

  static grpcTradesToTrades(trades: GrpcSpotMarketTrade[]): SpotMarketTrade[] {
    return trades.map((trade) => SpotMarketTransformer.grpcTradeToTrade(trade))
  }
}
