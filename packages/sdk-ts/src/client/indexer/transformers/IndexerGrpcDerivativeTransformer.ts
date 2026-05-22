import { BigNumber } from '@injectivelabs/utils'
import { grpcPagingToPagingV2 } from '../../../utils/pagination.js'
import { TokenType, OrderState, TradeDirection } from '../../../types/index.js'
import type * as InjectiveDerivativeExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb'
import type {
  OrderSide,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/index.js'
import type {
  Orderbook,
  PriceLevel,
  GrpcTokenMeta,
  GrpcPriceLevel,
  IndexerTokenMeta,
  OrderbookWithSequence,
} from '../types/exchange.js'
import type {
  Position,
  PositionV2,
  FundingRate,
  PositionDelta,
  FundingPayment,
  DerivativeTrade,
  GrpcFundingRate,
  DerivativeMarket,
  GrpcPositionDelta,
  GrpcFundingPayment,
  GrpcDerivativeTrade,
  PerpetualMarketInfo,
  BinaryOptionsMarket,
  DerivativeLimitOrder,
  GrpcDerivativePosition,
  PerpetualMarketFunding,
  DerivativeOrderHistory,
  GrpcPerpetualMarketInfo,
  ExpiryFuturesMarketInfo,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeLimitOrder,
  GrpcDerivativePositionV2,
  GrpcPerpetualMarketFunding,
  GrpcDerivativeOrderHistory,
  GrpcExpiryFuturesMarketInfo,
  GrpcBinaryOptionsMarketInfo,
} from '../types/derivatives.js'

const zeroPositionDelta = () => ({
  tradeDirection: TradeDirection.Buy,
  executionPrice: '0',
  executionQuantity: '0',
  executionMargin: '0',
})

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcDerivativeTransformer {
  static grpcTokenMetaToTokenMeta(
    tokenMeta: GrpcTokenMeta | undefined,
  ): IndexerTokenMeta | undefined {
    if (!tokenMeta) {
      return
    }

    return {
      coinGeckoId: '',
      name: tokenMeta.name,
      logo: tokenMeta.logo,
      symbol: tokenMeta.symbol,
      address: tokenMeta.address,
      decimals: tokenMeta.decimals,
      tokenType: TokenType.Unknown,
      updatedAt: Number(tokenMeta.updatedAt),
    }
  }

  static grpcPerpetualMarketInfoToPerpetualMarketInfo(
    perpetualMarketInfo: GrpcPerpetualMarketInfo | undefined,
  ): PerpetualMarketInfo | undefined {
    if (!perpetualMarketInfo) {
      return
    }

    return {
      hourlyInterestRate: perpetualMarketInfo.hourlyInterestRate,
      fundingInterval: Number(perpetualMarketInfo.fundingInterval),
      hourlyFundingRateCap: perpetualMarketInfo.hourlyFundingRateCap,
      nextFundingTimestamp: Number(perpetualMarketInfo.nextFundingTimestamp),
    }
  }

  static grpcPerpetualMarketFundingToPerpetualMarketFunding(
    perpetualMarketFunding: GrpcPerpetualMarketFunding | undefined,
  ): PerpetualMarketFunding | undefined {
    if (!perpetualMarketFunding) {
      return
    }

    return {
      cumulativePrice: perpetualMarketFunding.cumulativePrice,
      cumulativeFunding: perpetualMarketFunding.cumulativeFunding,
      lastTimestamp: Number(perpetualMarketFunding.lastTimestamp),
    }
  }

  static grpcExpiryFuturesMarketInfoToExpiryFuturesMarketInfo(
    expiryFuturesMarketInfo: GrpcExpiryFuturesMarketInfo | undefined,
  ): ExpiryFuturesMarketInfo | undefined {
    if (!expiryFuturesMarketInfo) {
      return
    }

    return {
      settlementPrice: expiryFuturesMarketInfo.settlementPrice,
      expirationTimestamp: Number(expiryFuturesMarketInfo.expirationTimestamp),
    }
  }

  static marketResponseToMarket(
    response: InjectiveDerivativeExchangeRpcPb.MarketResponse,
  ) {
    const market = response.market!

    return IndexerGrpcDerivativeTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(
    response: InjectiveDerivativeExchangeRpcPb.MarketsResponse,
  ) {
    const markets = response.markets

    return IndexerGrpcDerivativeTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(
    response: InjectiveDerivativeExchangeRpcPb.OrdersResponse,
  ) {
    const orders = response.orders
    const pagination = response.paging

    return {
      orders: IndexerGrpcDerivativeTransformer.grpcOrdersToOrders(orders),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static orderHistoryResponseToOrderHistory(
    response: InjectiveDerivativeExchangeRpcPb.OrdersHistoryResponse,
    isConditional?: boolean,
  ) {
    const orderHistory = response.orders
    const pagination = response.paging

    return {
      orderHistory:
        IndexerGrpcDerivativeTransformer.grpcOrderHistoryListToOrderHistoryList(
          orderHistory,
          isConditional,
        ),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static positionsResponseToPositions(
    response: InjectiveDerivativeExchangeRpcPb.PositionsResponse,
  ) {
    const positions = response.positions
    const pagination = response.paging

    return {
      positions:
        IndexerGrpcDerivativeTransformer.grpcPositionsToPositions(positions),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static positionsV2ResponseToPositionsV2(
    response: InjectiveDerivativeExchangeRpcPb.PositionsV2Response,
  ) {
    const positions = response.positions
    const pagination = response.paging

    return {
      positions:
        IndexerGrpcDerivativeTransformer.grpcPositionsV2ToPositionsV2(
          positions,
        ),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static tradesResponseToTrades(
    response: InjectiveDerivativeExchangeRpcPb.TradesResponse,
  ) {
    const trades = response.trades
    const pagination = response.paging

    return {
      trades: IndexerGrpcDerivativeTransformer.grpcTradesToTrades(trades),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static subaccountTradesListResponseToSubaccountTradesList(
    response: InjectiveDerivativeExchangeRpcPb.SubaccountTradesListResponse,
  ) {
    const tradesList = response.trades

    return IndexerGrpcDerivativeTransformer.grpcTradesToTrades(tradesList)
  }

  static fundingPaymentsResponseToFundingPayments(
    response: InjectiveDerivativeExchangeRpcPb.FundingPaymentsResponse,
  ) {
    const fundingPayments = response.payments
    const pagination = response.paging

    return {
      fundingPayments:
        IndexerGrpcDerivativeTransformer.grpcFundingPaymentsToFundingPayments(
          fundingPayments,
        ),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static fundingRatesResponseToFundingRates(
    response: InjectiveDerivativeExchangeRpcPb.FundingRatesResponse,
  ) {
    const fundingRates = response.fundingRates
    const pagination = response.paging

    return {
      fundingRates:
        IndexerGrpcDerivativeTransformer.grpcFundingRatesToFundingRates(
          fundingRates,
        ),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static orderbookV2ResponseToOrderbookV2(
    response: InjectiveDerivativeExchangeRpcPb.OrderbookV2Response,
  ) {
    const orderbook = response.orderbook!

    return IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
      sequence: Number(orderbook.sequence),
      buys: orderbook?.buys || [],
      sells: orderbook?.sells || [],
    })
  }

  static orderbooksV2ResponseToOrderbooksV2(
    response: InjectiveDerivativeExchangeRpcPb.OrderbooksV2Response,
  ) {
    const orderbooks = response.orderbooks!

    return orderbooks.map((o) => {
      const orderbook = o.orderbook!

      return {
        marketId: o.marketId,
        orderbook:
          IndexerGrpcDerivativeTransformer.grpcOrderbookV2ToOrderbookV2({
            sequence: Number(orderbook.sequence),
            buys: orderbook.buys || [],
            sells: orderbook.sells || [],
          }),
      }
    })
  }

  static binaryOptionsMarketResponseToBinaryOptionsMarket(
    response: InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketResponse,
  ) {
    const market = response.market!

    return IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketToBinaryOptionsMarket(
      market,
    )
  }

  static binaryOptionsMarketResponseWithPaginationToBinaryOptionsMarket(
    response: InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketsResponse,
  ) {
    const markets = response.markets
    const pagination = response.paging

    return {
      markets:
        IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketsToBinaryOptionsMarkets(
          markets,
        ),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static binaryOptionsMarketsResponseToBinaryOptionsMarkets(
    response: InjectiveDerivativeExchangeRpcPb.BinaryOptionsMarketsResponse,
  ) {
    const markets = response.markets

    return IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketsToBinaryOptionsMarkets(
      markets,
    )
  }

  static grpcBinaryOptionsMarketToBinaryOptionsMarket(
    market: GrpcBinaryOptionsMarketInfo,
  ): BinaryOptionsMarket {
    return {
      ticker: market.ticker,
      marketId: market.marketId,
      oracleType: market.oracleType,
      quoteDenom: market.quoteDenom,
      marketStatus: market.marketStatus,
      oracleSymbol: market.oracleSymbol,
      makerFeeRate: market.makerFeeRate,
      takerFeeRate: market.takerFeeRate,
      oracleProvider: market.oracleProvider,
      settlementPrice: market.settlementPrice,
      oracleScaleFactor: market.oracleScaleFactor,
      serviceProviderFee: market.serviceProviderFee,
      expirationTimestamp: Number(market.expirationTimestamp),
      settlementTimestamp: Number(market.settlementTimestamp),
      minNotional: new BigNumber(market.minNotional).toNumber(),
      minPriceTickSize: new BigNumber(market.minPriceTickSize).toNumber(),
      minQuantityTickSize: new BigNumber(market.minQuantityTickSize).toNumber(),
      quoteToken: IndexerGrpcDerivativeTransformer.grpcTokenMetaToTokenMeta(
        market.quoteTokenMeta,
      ),
    }
  }

  static grpcBinaryOptionsMarketsToBinaryOptionsMarkets(
    markets: GrpcBinaryOptionsMarketInfo[],
  ): BinaryOptionsMarket[] {
    return markets.map(
      IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketToBinaryOptionsMarket,
    )
  }

  static grpcMarketToMarket(
    market: GrpcDerivativeMarketInfo,
  ): DerivativeMarket {
    return {
      ticker: market.ticker,
      marketId: market.marketId,
      oracleBase: market.oracleBase,
      oracleType: market.oracleType,
      quoteDenom: market.quoteDenom,
      oracleQuote: market.oracleQuote,
      isPerpetual: market.isPerpetual,
      marketStatus: market.marketStatus,
      makerFeeRate: market.makerFeeRate,
      takerFeeRate: market.takerFeeRate,
      oracleScaleFactor: market.oracleScaleFactor,
      reduceMarginRatio: market.reduceMarginRatio,
      initialMarginRatio: market.initialMarginRatio,
      serviceProviderFee: market.serviceProviderFee,
      maintenanceMarginRatio: market.maintenanceMarginRatio,
      minNotional: new BigNumber(market.minNotional).toNumber(),
      minPriceTickSize: new BigNumber(market.minPriceTickSize).toNumber(),
      minQuantityTickSize: new BigNumber(market.minQuantityTickSize).toNumber(),
      quoteToken: IndexerGrpcDerivativeTransformer.grpcTokenMetaToTokenMeta(
        market.quoteTokenMeta,
      ),
      perpetualMarketInfo:
        IndexerGrpcDerivativeTransformer.grpcPerpetualMarketInfoToPerpetualMarketInfo(
          market.perpetualMarketInfo,
        ),
      perpetualMarketFunding:
        IndexerGrpcDerivativeTransformer.grpcPerpetualMarketFundingToPerpetualMarketFunding(
          market.perpetualMarketFunding,
        ),
      expiryFuturesMarketInfo:
        IndexerGrpcDerivativeTransformer.grpcExpiryFuturesMarketInfoToExpiryFuturesMarketInfo(
          market.expiryFuturesMarketInfo,
        ),
    }
  }

  static grpcMarketsToMarkets(
    markets: GrpcDerivativeMarketInfo[],
  ): DerivativeMarket[] {
    return markets.map((market) =>
      IndexerGrpcDerivativeTransformer.grpcMarketToMarket(market),
    )
  }

  static grpcPositionDeltaToPositionDelta(
    positionDelta: GrpcPositionDelta,
  ): PositionDelta {
    return {
      executionPrice: positionDelta.executionPrice,
      executionMargin: positionDelta.executionMargin,
      executionQuantity: positionDelta.executionQuantity,
      tradeDirection: positionDelta.tradeDirection as TradeDirection,
    }
  }

  static grpcPriceLevelToPriceLevel(priceLevel: GrpcPriceLevel): PriceLevel {
    return {
      price: priceLevel.price,
      quantity: priceLevel.quantity,
      timestamp: Number(priceLevel.timestamp),
    }
  }

  static grpcPriceLevelsToPriceLevels(
    priceLevels: GrpcPriceLevel[],
  ): PriceLevel[] {
    return priceLevels.map((priceLevel) =>
      IndexerGrpcDerivativeTransformer.grpcPriceLevelToPriceLevel(priceLevel),
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
      buys: IndexerGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells:
        IndexerGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(sells),
    }
  }

  static grpcOrderbookV2ToOrderbookV2({
    sequence,
    buys,
    sells,
  }: {
    sequence: number
    buys: GrpcPriceLevel[]
    sells: GrpcPriceLevel[]
  }): OrderbookWithSequence {
    return {
      sequence,
      buys: IndexerGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(buys),
      sells:
        IndexerGrpcDerivativeTransformer.grpcPriceLevelsToPriceLevels(sells),
    }
  }

  static priceLevelsToGrpcPriceLevels(
    priceLevels: PriceLevel[],
  ): GrpcPriceLevel[] {
    return priceLevels.map((priceLevel) => ({
      price: priceLevel.price,
      quantity: priceLevel.quantity,
      timestamp: BigInt(priceLevel.timestamp),
    }))
  }

  static grpcOrderToOrder(
    order: GrpcDerivativeLimitOrder,
  ): DerivativeLimitOrder {
    return {
      cid: order.cid,
      price: order.price,
      margin: order.margin,
      marketId: order.marketId,
      quantity: order.quantity,
      orderHash: order.orderHash,
      orderType: order.orderType,
      subaccountId: order.subaccountId,
      isReduceOnly: order.isReduceOnly,
      triggerPrice: order.triggerPrice,
      feeRecipient: order.feeRecipient,
      state: order.state as OrderState,
      createdAt: Number(order.createdAt),
      updatedAt: Number(order.updatedAt),
      triggerAt: Number(order.triggerAt),
      isConditional: order.isConditional,
      executionType: order.executionType,
      accountAddress: order.accountAddress,
      orderNumber: Number(order.orderNumber),
      placedOrderHash: order.placedOrderHash,
      orderSide: order.orderSide as OrderSide,
      unfilledQuantity: order.unfilledQuantity,
    }
  }

  static grpcOrdersToOrders(
    orders: GrpcDerivativeLimitOrder[],
  ): DerivativeLimitOrder[] {
    return orders.map((order) =>
      IndexerGrpcDerivativeTransformer.grpcOrderToOrder(order),
    )
  }

  static grpcOrderHistoryToOrderHistory(
    orderHistory: GrpcDerivativeOrderHistory,
  ): DerivativeOrderHistory {
    return {
      cid: orderHistory.cid,
      price: orderHistory.price,
      state: orderHistory.state,
      margin: orderHistory.margin,
      marketId: orderHistory.marketId,
      isActive: orderHistory.isActive,
      quantity: orderHistory.quantity,
      orderHash: orderHistory.orderHash,
      orderType: orderHistory.orderType,
      direction: orderHistory.direction,
      subaccountId: orderHistory.subaccountId,
      triggerPrice: orderHistory.triggerPrice,
      isReduceOnly: orderHistory.isReduceOnly,
      executionType: orderHistory.executionType,
      createdAt: Number(orderHistory.createdAt),
      updatedAt: Number(orderHistory.updatedAt),
      triggerAt: Number(orderHistory.triggerAt),
      isConditional: orderHistory.isConditional,
      filledQuantity: orderHistory.filledQuantity,
      placedOrderHash: orderHistory.placedOrderHash,
    }
  }

  static grpcOrderHistoryListToOrderHistoryList(
    orderHistory: GrpcDerivativeOrderHistory[],
    isConditional?: boolean,
  ): DerivativeOrderHistory[] {
    const filteredOrderHistory = isConditional
      ? orderHistory
      : orderHistory.filter((order) => order.state !== OrderState.Booked)

    return filteredOrderHistory.map((orderHistory) =>
      IndexerGrpcDerivativeTransformer.grpcOrderHistoryToOrderHistory(
        orderHistory,
      ),
    )
  }

  static grpcPositionToPosition(position: GrpcDerivativePosition): Position {
    return {
      margin: position.margin,
      ticker: position.ticker,
      marketId: position.marketId,
      quantity: position.quantity,
      markPrice: position.markPrice,
      entryPrice: position.entryPrice,
      subaccountId: position.subaccountId,
      updatedAt: Number(position.updatedAt),
      liquidationPrice: position.liquidationPrice,
      direction: position.direction as TradeDirection,
      aggregateReduceOnlyQuantity: position.aggregateReduceOnlyQuantity,
    }
  }

  static grpcPositionV2ToPositionV2(
    position: GrpcDerivativePositionV2,
  ): PositionV2 {
    return {
      upnl: position.upnl,
      denom: position.denom,
      margin: position.margin,
      ticker: position.ticker,
      marketId: position.marketId,
      quantity: position.quantity,
      markPrice: position.markPrice,
      entryPrice: position.entryPrice,
      fundingSum: position.fundingSum,
      fundingLast: position.fundingLast,
      subaccountId: position.subaccountId,
      updatedAt: Number(position.updatedAt),
      liquidationPrice: position.liquidationPrice,
      direction: position.direction as TradeDirection,
      cumulativeFundingEntry: position.cumulativeFundingEntry,
      effectiveCumulativeFundingEntry: position.effectiveCumulativeFundingEntry,
    }
  }

  static grpcPositionsToPositions(
    positions: GrpcDerivativePosition[],
  ): Position[] {
    return positions.map((position) =>
      IndexerGrpcDerivativeTransformer.grpcPositionToPosition(position),
    )
  }

  static grpcPositionsV2ToPositionsV2(
    positions: GrpcDerivativePositionV2[],
  ): PositionV2[] {
    return positions.map((position) =>
      IndexerGrpcDerivativeTransformer.grpcPositionV2ToPositionV2(position),
    )
  }

  static grpcTradeToTrade(trade: GrpcDerivativeTrade): DerivativeTrade {
    const positionDelta = trade.positionDelta
    const mappedPositionDelta = positionDelta
      ? IndexerGrpcDerivativeTransformer.grpcPositionDeltaToPositionDelta(
          positionDelta,
        )
      : zeroPositionDelta()

    return {
      cid: trade.cid,
      fee: trade.fee,
      pnl: trade.pnl,
      payout: trade.payout,
      tradeId: trade.tradeId,
      marketId: trade.marketId,
      orderHash: trade.orderHash,
      subaccountId: trade.subaccountId,
      feeRecipient: trade.feeRecipient,
      isLiquidation: trade.isLiquidation,
      executedAt: Number(trade.executedAt),
      executionSide: trade.executionSide as TradeExecutionSide,
      tradeExecutionType: trade.tradeExecutionType as TradeExecutionType,
      ...mappedPositionDelta,
    }
  }

  static grpcTradesToTrades(trades: GrpcDerivativeTrade[]): DerivativeTrade[] {
    return trades.map((trade) =>
      IndexerGrpcDerivativeTransformer.grpcTradeToTrade(trade),
    )
  }

  static grpcFundingPaymentToFundingPayment(
    fundingPayment: GrpcFundingPayment,
  ): FundingPayment {
    return {
      marketId: fundingPayment.marketId,
      subaccountId: fundingPayment.subaccountId,
      amount: fundingPayment.amount,
      timestamp: Number(fundingPayment.timestamp),
    }
  }

  static grpcFundingPaymentsToFundingPayments(
    fundingPayments: GrpcFundingPayment[],
  ): FundingPayment[] {
    return fundingPayments.map(
      IndexerGrpcDerivativeTransformer.grpcFundingPaymentToFundingPayment,
    )
  }

  static grpcFundingRateToFundingRate(
    fundingRate: GrpcFundingRate,
  ): FundingRate {
    return {
      marketId: fundingRate.marketId,
      rate: fundingRate.rate,
      timestamp: Number(fundingRate.timestamp),
    }
  }

  static grpcFundingRatesToFundingRates(
    fundingRates: GrpcFundingRate[],
  ): FundingRate[] {
    return fundingRates.map(
      IndexerGrpcDerivativeTransformer.grpcFundingRateToFundingRate,
    )
  }
}
