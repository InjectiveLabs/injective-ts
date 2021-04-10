import {
  GrpcPriceLevel,
  GrpcSpotMarketInfo,
  GrpcSpotMarketOrder,
  GrpcSpotMarketTrade,
  SpotOrderType,
  TradeDirection,
  TradeExecutionType,
  UiOrderbook,
  UiPriceLevel,
  UiSpotMarket,
  UiSpotMarketOrder,
  UiSpotMarketTrade,
} from '../types'

export class SpotMarketTransformer {
  static marketToUiMarket(market: GrpcSpotMarketInfo): UiSpotMarket {
    return {
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      baseDenom: market.getBaseDenom(),
      quoteDenom: market.getQuoteDenom(),
      makerFeeRate: market.getMakerFeeRate(),
      takerFeeRate: market.getTakerFeeRate(),
      serviceProviderFee: market.getServiceProviderFee(),
    }
  }

  static marketsToUiMarkets(markets: GrpcSpotMarketInfo[]): UiSpotMarket[] {
    return markets.map((market) =>
      SpotMarketTransformer.marketToUiMarket(market),
    )
  }

  static priceLevelToUiPriceLevel(priceLevel: GrpcPriceLevel): UiPriceLevel {
    return {
      p: priceLevel.getPrice(),
      q: priceLevel.getQuantity(),
      t: priceLevel.getTimestamp(),
    }
  }

  static priceLevelsToUiPriceLevels(
    priceLevels: GrpcPriceLevel[],
  ): UiPriceLevel[] {
    return priceLevels.map((priceLevel) =>
      SpotMarketTransformer.priceLevelToUiPriceLevel(priceLevel),
    )
  }

  static orderbookToUiOrderbook({
    buys,
    sells,
  }: {
    buys: GrpcPriceLevel[]
    sells: GrpcPriceLevel[]
  }): UiOrderbook {
    return {
      buys: SpotMarketTransformer.priceLevelsToUiPriceLevels(buys),
      sells: SpotMarketTransformer.priceLevelsToUiPriceLevels(sells),
    }
  }

  static orderToUiOrder(order: GrpcSpotMarketOrder): UiSpotMarketOrder {
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

  static ordersToUiOrders(orders: GrpcSpotMarketOrder[]): UiSpotMarketOrder[] {
    return orders.map((order) => SpotMarketTransformer.orderToUiOrder(order))
  }

  static tradeToUiTrade(trade: GrpcSpotMarketTrade): UiSpotMarketTrade {
    const price = trade.getPrice()

    return {
      orderHash: trade.getOrderHash(),
      subaccountId: trade.getSubaccountId(),
      marketId: trade.getMarketId(),
      tradeExecutionType: trade.getTradeExecutionType() as TradeExecutionType,
      tradeDirection: trade.getTradeDirection() as TradeDirection,
      price: price
        ? SpotMarketTransformer.priceLevelToUiPriceLevel(price)
        : undefined,
      fee: trade.getFee(),
    }
  }

  static tradesToUiTrades(trades: GrpcSpotMarketTrade[]): UiSpotMarketTrade[] {
    return trades.map((trade) => SpotMarketTransformer.tradeToUiTrade(trade))
  }
}
