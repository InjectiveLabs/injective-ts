import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
import { BigNumber } from '@injectivelabs/utils'
import {
  GrpcPriceLevel,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeLimitOrder,
  GrpcDerivativeTrade,
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
  PerpetualMarketInfo,
  GrpcPerpetualMarketInfo,
  GrpcPerpetualMarketFunding,
  PerpetualMarketFunding,
  GrpcExpiryFuturesMarketInfo,
  GrpcFundingPayment,
  GrpcFundingRate,
  FundingPayment,
  FundingRate,
  ExpiryFuturesMarketInfo,
  DerivativeOrderSide,
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

  static grpcPerpetualMarketInfoToPerpetualMarketInfo(
    perpetualMarketInfo: GrpcPerpetualMarketInfo | undefined,
  ): PerpetualMarketInfo | undefined {
    if (!perpetualMarketInfo) {
      return
    }

    return {
      hourlyFundingRateCap: perpetualMarketInfo.getHourlyFundingRateCap(),
      hourlyInterestRate: perpetualMarketInfo.getHourlyInterestRate(),
      nextFundingTimestamp: perpetualMarketInfo.getNextFundingTimestamp(),
      fundingInterval: perpetualMarketInfo.getFundingInterval(),
    }
  }

  static grpcPerpetualMarketFundingToPerpetualMarketFunding(
    perpetualMarketFunding: GrpcPerpetualMarketFunding | undefined,
  ): PerpetualMarketFunding | undefined {
    if (!perpetualMarketFunding) {
      return
    }

    return {
      cumulativeFunding: perpetualMarketFunding.getCumulativeFunding(),
      cumulativePrice: perpetualMarketFunding.getCumulativePrice(),
      lastTimestamp: perpetualMarketFunding.getLastTimestamp(),
    }
  }

  static grpcExpiryFuturesMarketInfoToExpiryFuturesMarketInfo(
    expiryFuturesMarketInfo: GrpcExpiryFuturesMarketInfo | undefined,
  ): ExpiryFuturesMarketInfo | undefined {
    if (!expiryFuturesMarketInfo) {
      return
    }

    return {
      expirationTimestamp: expiryFuturesMarketInfo.getExpirationTimestamp(),
      settlementPrice: expiryFuturesMarketInfo.getSettlementPrice(),
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
      minPriceTickSize: new BigNumber(market.getMinPriceTickSize()).toNumber(),
      minQuantityTickSize: new BigNumber(
        market.getMinQuantityTickSize(),
      ).toNumber(),
      perpetualMarketInfo:
        DerivativeTransformer.grpcPerpetualMarketInfoToPerpetualMarketInfo(
          market.getPerpetualMarketInfo(),
        ),
      perpetualMarketFunding:
        DerivativeTransformer.grpcPerpetualMarketFundingToPerpetualMarketFunding(
          market.getPerpetualMarketFunding(),
        ),
      expiryFuturesMarketInfo:
        DerivativeTransformer.grpcExpiryFuturesMarketInfoToExpiryFuturesMarketInfo(
          market.getExpiryFuturesMarketInfo(),
        ),
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
      orderSide: order.getOrderSide() as DerivativeOrderSide,
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

  static grpcPositionToPosition(position: GrpcDerivativePosition): Position {
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
      feeRecipient:
        trade.getFeeRecipient !== undefined ? trade.getFeeRecipient() : '', // TODO: remove the check
      isLiquidation: trade.getIsLiquidation(),
      payout: trade.getPayout(),
      ...mappedPositionDelta,
    }
  }

  static grpcTradesToTrades(trades: GrpcDerivativeTrade[]): DerivativeTrade[] {
    return trades.map((trade) => DerivativeTransformer.grpcTradeToTrade(trade))
  }

  static grpcFundingPaymentToFundingPayment(
    fundingPayment: GrpcFundingPayment,
  ): FundingPayment {
    return {
      marketId: fundingPayment.getMarketId(),
      subaccountId: fundingPayment.getSubaccountId(),
      amount: fundingPayment.getAmount(),
      timestamp: fundingPayment.getTimestamp(),
    }
  }

  static grpcFundingPaymentsToFundingPayments(
    fundingPayments: GrpcFundingPayment[],
  ): FundingPayment[] {
    return fundingPayments.map(
      DerivativeTransformer.grpcFundingPaymentToFundingPayment,
    )
  }

  static grpcFundingRateToFundingRate(
    fundingRate: GrpcFundingRate,
  ): FundingRate {
    return {
      marketId: fundingRate.getMarketId(),
      rate: fundingRate.getRate(),
      timestamp: fundingRate.getTimestamp(),
    }
  }

  static grpcFundingRatesToFundingRates(
    fundingRates: GrpcFundingRate[],
  ): FundingRate[] {
    return fundingRates.map(DerivativeTransformer.grpcFundingRateToFundingRate)
  }
}
