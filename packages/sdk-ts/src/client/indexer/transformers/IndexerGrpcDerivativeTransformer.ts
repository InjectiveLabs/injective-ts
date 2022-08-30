import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
import { BigNumber } from '@injectivelabs/utils'
import {
  DerivativeOrderSide,
  DerivativeOrderState,
  GrpcDerivativeMarketInfo,
  GrpcDerivativeLimitOrder,
  GrpcDerivativeTrade,
  DerivativeMarket,
  DerivativeLimitOrder,
  DerivativeTrade,
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
  GrpcBinaryOptionsMarketInfo,
  BinaryOptionsMarket,
  GrpcDerivativeOrderHistory,
  DerivativeOrderHistory,
} from '../types/derivatives'
import {
  GrpcPriceLevel,
  Orderbook,
  PriceLevel,
  GrpcTokenMeta,
  IndexerTokenMeta,
} from '../types/exchange'
import {
  FundingPaymentsResponse,
  FundingRatesResponse,
  MarketsResponse as DerivativeMarketsResponse,
  MarketResponse as DerivativeMarketResponse,
  OrderbookResponse as DerivativeOrderbookResponse,
  OrdersResponse as DerivativeOrdersResponse,
  OrdersHistoryResponse as DerivativeOrdersHistoryResponse,
  TradesResponse as DerivativeTradesResponse,
  PositionsResponse as DerivativePositionsResponse,
  OrderbooksResponse as DerivativeOrderbooksResponse,
  SubaccountTradesListResponse as DerivativeSubaccountTradesListResponse,
} from '@injectivelabs/indexer-api/injective_derivative_exchange_rpc_pb'
import {
  BinaryOptionsMarketsResponse as BinaryOptionsMarketsResponse,
  BinaryOptionsMarketResponse as BinaryOptionsMarketResponse,
} from '@injectivelabs/indexer-api/injective_derivative_exchange_rpc_pb'
import { grpcPagingToPaging } from '../../../utils/pagination'

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
      name: tokenMeta.getName(),
      address: tokenMeta.getAddress(),
      symbol: tokenMeta.getSymbol(),
      logo: tokenMeta.getLogo(),
      decimals: tokenMeta.getDecimals(),
      updatedAt: tokenMeta.getUpdatedAt(),
      coinGeckoId: '',
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

  static marketResponseToMarket(response: DerivativeMarketResponse) {
    const market = response.getMarket()!

    return IndexerGrpcDerivativeTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(response: DerivativeMarketsResponse) {
    const markets = response.getMarketsList()

    return IndexerGrpcDerivativeTransformer.grpcMarketsToMarkets(markets)
  }

  static ordersResponseToOrders(response: DerivativeOrdersResponse) {
    const orders = response.getOrdersList()
    const pagination = response.getPaging()

    return {
      orders: IndexerGrpcDerivativeTransformer.grpcOrdersToOrders(orders),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static orderHistoryResponseToOrderHistory(
    response: DerivativeOrdersHistoryResponse,
  ) {
    const orderHistory = response.getOrdersList()
    const pagination = response.getPaging()

    return {
      orderHistory:
        IndexerGrpcDerivativeTransformer.grpcOrderHistoryListToOrderHistoryList(
          orderHistory,
        ),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static positionsResponseToPositions(response: DerivativePositionsResponse) {
    const positions = response.getPositionsList()
    const pagination = response.getPaging()

    return {
      positions:
        IndexerGrpcDerivativeTransformer.grpcPositionsToPositions(positions),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static tradesResponseToTrades(response: DerivativeTradesResponse) {
    const trades = response.getTradesList()
    const pagination = response.getPaging()

    return {
      trades: IndexerGrpcDerivativeTransformer.grpcTradesToTrades(trades),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static subaccountTradesListResponseToSubaccountTradesList(
    response: DerivativeSubaccountTradesListResponse,
  ) {
    const tradesList = response.getTradesList()

    return IndexerGrpcDerivativeTransformer.grpcTradesToTrades(tradesList)
  }

  static fundingPaymentsResponseToFundingPayments(
    response: FundingPaymentsResponse,
  ) {
    const fundingPayments = response.getPaymentsList()
    const pagination = response.getPaging()

    return {
      fundingPayments:
        IndexerGrpcDerivativeTransformer.grpcFundingPaymentsToFundingPayments(
          fundingPayments,
        ),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static fundingRatesResponseToFundingRates(response: FundingRatesResponse) {
    const fundingRates = response.getFundingRatesList()
    const pagination = response.getPaging()

    return {
      fundingRates:
        IndexerGrpcDerivativeTransformer.grpcFundingRatesToFundingRates(
          fundingRates,
        ),
      pagination: grpcPagingToPaging(pagination),
    }
  }

  static orderbookResponseToOrderbook(response: DerivativeOrderbookResponse) {
    const orderbook = response.getOrderbook()!

    return IndexerGrpcDerivativeTransformer.grpcOrderbookToOrderbook({
      buys: orderbook?.getBuysList(),
      sells: orderbook?.getSellsList(),
    })
  }

  static orderbooksResponseToOrderbooks(
    response: DerivativeOrderbooksResponse,
  ) {
    const orderbooks = response.getOrderbooksList()!

    return orderbooks.map((o) => {
      const orderbook = o.getOrderbook()!

      return {
        marketId: o.getMarketId(),
        orderbook: IndexerGrpcDerivativeTransformer.grpcOrderbookToOrderbook({
          buys: orderbook.getBuysList(),
          sells: orderbook.getSellsList(),
        }),
      }
    })
  }

  static binaryOptionsMarketResponseToBinaryOptionsMarket(
    response: BinaryOptionsMarketResponse,
  ) {
    const market = response.getMarket()!

    return IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketToBinaryOptionsMarket(
      market,
    )
  }

  static binaryOptionsMarketsResponseToBinaryOptionsMarkets(
    response: BinaryOptionsMarketsResponse,
  ) {
    const markets = response.getMarketsList()

    return IndexerGrpcDerivativeTransformer.grpcBinaryOptionsMarketsToBinaryOptionsMarkets(
      markets,
    )
  }

  static grpcBinaryOptionsMarketToBinaryOptionsMarket(
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
      quoteToken: IndexerGrpcDerivativeTransformer.grpcTokenMetaToTokenMeta(
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
      quoteToken: IndexerGrpcDerivativeTransformer.grpcTokenMetaToTokenMeta(
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
        IndexerGrpcDerivativeTransformer.grpcPerpetualMarketInfoToPerpetualMarketInfo(
          market.getPerpetualMarketInfo(),
        ),
      perpetualMarketFunding:
        IndexerGrpcDerivativeTransformer.grpcPerpetualMarketFundingToPerpetualMarketFunding(
          market.getPerpetualMarketFunding(),
        ),
      expiryFuturesMarketInfo:
        IndexerGrpcDerivativeTransformer.grpcExpiryFuturesMarketInfoToExpiryFuturesMarketInfo(
          market.getExpiryFuturesMarketInfo(),
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
      createdAt: order.getCreatedAt(),
      updatedAt: order.getUpdatedAt(),
      orderNumber: order.getOrderNumber(),
      orderType: order.getOrderType(),
      isConditional: order.getIsConditional(),
      triggerAt: order.getTriggerAt(),
      placedOrderHash: order.getPlacedOrderHash(),
      executionType: order.getExecutionType()
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
      orderHash: orderHistory.getOrderHash(),
      marketId: orderHistory.getMarketId(),
      isActive: orderHistory.getIsActive(),
      subaccountId: orderHistory.getSubaccountId(),
      executionType: orderHistory.getExecutionType(),
      orderType: orderHistory.getOrderType(),
      price: orderHistory.getPrice(),
      triggerPrice: orderHistory.getTriggerPrice(),
      quantity: orderHistory.getQuantity(),
      filledQuantity: orderHistory.getFilledQuantity(),
      state: orderHistory.getState(),
      createdAt: orderHistory.getCreatedAt(),
      updatedAt: orderHistory.getUpdatedAt(),
      isReduceOnly: orderHistory.getIsReduceOnly(),
      direction: orderHistory.getDirection(),
      isConditional: orderHistory.getIsConditional(),
      triggerAt: orderHistory.getTriggerAt(),
      placedOrderHash: orderHistory.getPlacedOrderHash(),
      margin: orderHistory.getMargin()
    }
  }

  static grpcOrderHistoryListToOrderHistoryList(
    orderHistory: GrpcDerivativeOrderHistory[],
  ): DerivativeOrderHistory[] {
    return orderHistory.map((orderHistory) =>
      IndexerGrpcDerivativeTransformer.grpcOrderHistoryToOrderHistory(
        orderHistory,
      ),
    )
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
      updatedAt: position.getUpdatedAt(),
    }
  }

  static grpcPositionsToPositions(
    positions: GrpcDerivativePosition[],
  ): Position[] {
    return positions.map((position) =>
      IndexerGrpcDerivativeTransformer.grpcPositionToPosition(position),
    )
  }

  static grpcTradeToTrade(trade: GrpcDerivativeTrade): DerivativeTrade {
    const positionDelta = trade.getPositionDelta()
    const mappedPositionDelta = positionDelta
      ? IndexerGrpcDerivativeTransformer.grpcPositionDeltaToPositionDelta(
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

  static grpcTradesToTrades(trades: GrpcDerivativeTrade[]): DerivativeTrade[] {
    return trades.map((trade) =>
      IndexerGrpcDerivativeTransformer.grpcTradeToTrade(trade),
    )
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
      IndexerGrpcDerivativeTransformer.grpcFundingPaymentToFundingPayment,
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
    return fundingRates.map(
      IndexerGrpcDerivativeTransformer.grpcFundingRateToFundingRate,
    )
  }
}
