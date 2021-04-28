import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
import {
  GrpcPriceLevel,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeMarketOrder,
  GrpcDerivativeTrade,
  DerivativeOrderType,
  Orderbook,
  PriceLevel,
  DerivativeMarket,
  DerivativeMarketOrder,
  DerivativeMarketTrade,
  DerivativeOrderState,
  GrpcTokenMeta,
  TokenMeta,
} from '../types'

const zeroPriceLevel = () => ({
  price: '0',
  quantity: '0',
  timestamp: 0,
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
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      baseDenom: market.getBaseDenom(),
      quoteDenom: market.getQuoteDenom(),
      quoteToken: DerivativeTransformer.grpcTokenMetaToTokenMeta(
        market.getQuoteTokenMeta(),
      ),
      baseToken: DerivativeTransformer.grpcTokenMetaToTokenMeta(
        market.getBaseTokenMeta(),
      ),
      makerFeeRate: market.getMakerFeeRate(),
      takerFeeRate: market.getTakerFeeRate(),
      serviceProviderFee: market.getServiceProviderFee(),
      maxPriceScaleDecimals: market.getMaxPriceScaleDecimals(),
      maxQuantityScaleDecimals: market.getMaxQuantityScaleDecimals(),
    }
  }

  static grpcMarketsToMarkets(
    markets: GrpcDerivativeMarketInfo[],
  ): DerivativeMarket[] {
    return markets.map((market) =>
      DerivativeTransformer.grpcMarketToMarket(market),
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
    order: GrpcDerivativeMarketOrder,
  ): DerivativeMarketOrder {
    return {
      orderHash: order.getOrderHash(),
      orderType: order.getOrderType() as DerivativeOrderType,
      marketId: order.getMarketId(),
      subaccountId: order.getSubaccountId(),
      price: order.getPrice(),
      state: order.getState() as DerivativeOrderState,
      quantity: order.getQuantity(),
      unfilledQuantity: order.getUnfilledQuantity(),
      triggerPrice: order.getTriggerPrice(),
      feeRecipient: order.getFeeRecipient(),
    }
  }

  static grpcOrdersToOrders(
    orders: GrpcDerivativeMarketOrder[],
  ): DerivativeMarketOrder[] {
    return orders.map((order) => DerivativeTransformer.grpcOrderToOrder(order))
  }

  static grpcTradeToTrade(trade: GrpcDerivativeTrade): DerivativeMarketTrade {
    const price = trade.getPrice()
    const mappedPrice = price
      ? DerivativeTransformer.grpcPriceLevelToPriceLevel(price)
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

  static grpcTradesToTrades(
    trades: GrpcDerivativeTrade[],
  ): DerivativeMarketTrade[] {
    return trades.map((trade) => DerivativeTransformer.grpcTradeToTrade(trade))
  }
}
