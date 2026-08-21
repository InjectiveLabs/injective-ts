import { bytesToHex } from '../../../utils/address-light.js'
import type * as InjectiveExchangeV2QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/query_pb'
import type * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'
import type * as InjectiveExchangeV2GenesisPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/genesis_pb'
import type * as InjectiveExchangeV2ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/exchange_pb'
import type { SpotMarket } from '../../indexer/types/spot.js'
import type { DerivativeMarket } from '../../indexer/types/derivatives.js'
import type {
  ChainDeposit,
  ChainPosition,
  ChainOrderbook,
  ChainL3Orderbook,
  ChainTradeRecord,
  PointsMultiplier,
  ChainDenomDecimal,
  ChainMarketVolume,
  ChainOpenInterest,
  ChainTradeRecords,
  ChainMarketBalance,
  ChainTierStatistic,
  CampaignRewardPool,
  FeeDiscountTierTTL,
  ChainOrderbookLevel,
  ChainMidPriceAndTob,
  FeeDiscountSchedule,
  FeeDiscountTierInfo,
  IsOptedOutOfRewards,
  TradeRewardCampaign,
  ExchangeModuleParams,
  ChainDenomMinNotional,
  ChainMarketVolatility,
  ChainTradeRewardPoints,
  ChainEffectivePosition,
  FeeDiscountAccountInfo,
  ChainDerivativePosition,
  ChainGrantAuthorization,
  ChainSubaccountOrderData,
  ChainPerpetualMarketInfo,
  ChainBinaryOptionsMarket,
  TradingRewardCampaignInfo,
  ChainTrimmedSpotLimitOrder,
  ChainSubaccountRiskProfile,
  ChainAggregateAccountVolume,
  ChainPerpetualMarketFunding,
  ChainCrossMarginPoolSnapshot,
  ChainDerivativeMarketAddress,
  ChainExpiryFuturesMarketInfo,
  TradingRewardCampaignBoostInfo,
  ChainSubaccountOrderbookMetadata,
  ChainTrimmedDerivativeLimitOrder,
  ChainTrimmedDerivativeConditionalOrder,
} from '../types/exchange.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcExchangeTransformerV2 {
  static moduleStateResponseToModuleState(
    response: InjectiveExchangeV2QueryPb.QueryModuleStateResponse,
  ): InjectiveExchangeV2GenesisPb.GenesisState {
    if (!response.state) {
      throw new Error('Exchange module state not found in response')
    }

    return response.state
  }

  static moduleParamsResponseToParams(
    response: InjectiveExchangeV2QueryPb.QueryExchangeParamsResponse,
  ): ExchangeModuleParams {
    const params = response.params!
    return {
      spotMarketInstantListingFee: params.spotMarketInstantListingFee,
      derivativeMarketInstantListingFee:
        params.derivativeMarketInstantListingFee,
      defaultSpotMakerFeeRate: params.defaultSpotMakerFeeRate,
      defaultSpotTakerFeeRate: params.defaultSpotTakerFeeRate,
      defaultDerivativeMakerFeeRate: params.defaultDerivativeMakerFeeRate,
      defaultDerivativeTakerFeeRate: params.defaultDerivativeTakerFeeRate,
      defaultInitialMarginRatio: params.defaultInitialMarginRatio,
      defaultMaintenanceMarginRatio: params.defaultMaintenanceMarginRatio,
      defaultFundingInterval: Number(params.defaultFundingInterval),
      fundingMultiple: Number(params.fundingMultiple),
      relayerFeeShareRate: params.relayerFeeShareRate,
      defaultHourlyFundingRateCap: params.defaultHourlyFundingRateCap,
      defaultHourlyInterestRate: params.defaultHourlyInterestRate,
      maxDerivativeOrderSideCount: params.maxDerivativeOrderSideCount,
      injRewardStakedRequirementThreshold:
        params.injRewardStakedRequirementThreshold,
      tradingRewardsVestingDuration: Number(
        params.tradingRewardsVestingDuration,
      ),
      liquidatorRewardShareRate: params.liquidatorRewardShareRate,
      binaryOptionsMarketInstantListingFee:
        params.binaryOptionsMarketInstantListingFee,
      atomicMarketOrderAccessLevel:
        params.atomicMarketOrderAccessLevel.toString(),
      spotAtomicMarketOrderFeeMultiplier:
        params.spotAtomicMarketOrderFeeMultiplier,
      derivativeAtomicMarketOrderFeeMultiplier:
        params.derivativeAtomicMarketOrderFeeMultiplier,
      binaryOptionsAtomicMarketOrderFeeMultiplier:
        params.binaryOptionsAtomicMarketOrderFeeMultiplier,
      minimalProtocolFeeRate: params.minimalProtocolFeeRate,
      isInstantDerivativeMarketLaunchEnabled:
        params.isInstantDerivativeMarketLaunchEnabled,
      postOnlyModeHeightThreshold:
        params.postOnlyModeHeightThreshold.toString(),
      marginDecreasePriceTimestampThresholdSeconds:
        params.marginDecreasePriceTimestampThresholdSeconds.toString(),
      exchangeAdmins: params.exchangeAdmins,
    }
  }

  static feeDiscountScheduleResponseToFeeDiscountSchedule(
    response: InjectiveExchangeV2QueryPb.QueryFeeDiscountScheduleResponse,
  ): FeeDiscountSchedule {
    const schedule = response.feeDiscountSchedule!
    return {
      bucketCount: Number(schedule.bucketCount),
      bucketDuration: Number(schedule.bucketDuration),
      quoteDenomsList: schedule.quoteDenoms,
      tierInfosList: schedule.tierInfos
        .map(
          ChainGrpcExchangeTransformerV2.grpcFeeDiscountTierInfoToFeeDiscountTierInfo,
        )
        .filter((info): info is FeeDiscountTierInfo => info !== undefined),
      disqualifiedMarketIdsList: schedule.disqualifiedMarketIds,
    }
  }

  static feeDiscountAccountInfoResponseToFeeDiscountAccountInfo(
    response: InjectiveExchangeV2QueryPb.QueryFeeDiscountAccountInfoResponse,
  ): FeeDiscountAccountInfo {
    return {
      tierLevel: Number(response.tierLevel),
      accountInfo:
        ChainGrpcExchangeTransformerV2.grpcFeeDiscountTierInfoToFeeDiscountTierInfo(
          response.accountInfo,
        ),
      accountTtl:
        ChainGrpcExchangeTransformerV2.grpcFeeDiscountTierTTLToFeeDiscountTierTTL(
          response.accountTtl,
        ),
    }
  }

  static grpcFeeDiscountTierInfoToFeeDiscountTierInfo(
    info?: InjectiveExchangeV2ExchangePb.FeeDiscountTierInfo,
  ): FeeDiscountTierInfo | undefined {
    return info
      ? {
          makerDiscountRate: info.makerDiscountRate,
          takerDiscountRate: info.takerDiscountRate,
          stakedAmount: info.stakedAmount,
          volume: info.volume ?? '0',
        }
      : undefined
  }
  static grpcFeeDiscountTierTTLToFeeDiscountTierTTL(
    info?: InjectiveExchangeV2ExchangePb.FeeDiscountTierTTL,
  ): FeeDiscountTierTTL | undefined {
    return info
      ? { tier: Number(info.tier), ttlTimestamp: Number(info.ttlTimestamp) }
      : undefined
  }
  static grpcPointsMultiplierToPointsMultiplier(
    point: InjectiveExchangeV2ExchangePb.PointsMultiplier,
  ): PointsMultiplier {
    return {
      makerPointsMultiplier: point.makerPointsMultiplier,
      takerPointsMultiplier: point.takerPointsMultiplier,
    }
  }
  static grpcTradingRewardCampaignBoostInfoToTradingRewardCampaignBoostInfo(
    info?: InjectiveExchangeV2ExchangePb.TradingRewardCampaignBoostInfo,
  ): TradingRewardCampaignBoostInfo | undefined {
    return info
      ? {
          boostedSpotMarketIdsList: info.boostedSpotMarketIds,
          spotMarketMultipliersList: info.spotMarketMultipliers.map(
            ChainGrpcExchangeTransformerV2.grpcPointsMultiplierToPointsMultiplier,
          ),
          boostedDerivativeMarketIdsList: info.boostedDerivativeMarketIds,
          derivativeMarketMultipliersList: info.derivativeMarketMultipliers.map(
            ChainGrpcExchangeTransformerV2.grpcPointsMultiplierToPointsMultiplier,
          ),
        }
      : undefined
  }
  static grpcTradingRewardCampaignInfoToTradingRewardCampaignInfo(
    info?: InjectiveExchangeV2ExchangePb.TradingRewardCampaignInfo,
  ): TradingRewardCampaignInfo | undefined {
    return info
      ? {
          campaignDurationSeconds: Number(info.campaignDurationSeconds),
          quoteDenomsList: info.quoteDenoms,
          tradingRewardBoostInfo:
            ChainGrpcExchangeTransformerV2.grpcTradingRewardCampaignBoostInfoToTradingRewardCampaignBoostInfo(
              info.tradingRewardBoostInfo,
            ),
          disqualifiedMarketIdsList: info.disqualifiedMarketIds,
        }
      : undefined
  }
  static grpcCampaignRewardPoolToCampaignRewardPool(
    pool: InjectiveExchangeV2ExchangePb.CampaignRewardPool,
  ): CampaignRewardPool {
    return {
      startTimestamp: Number(pool.startTimestamp),
      maxCampaignRewardsList: pool.maxCampaignRewards.map((coin) => ({
        amount: coin.amount,
        denom: coin.denom,
      })),
    }
  }
  static tradingRewardsCampaignResponseToTradingRewardsCampaign(
    response: InjectiveExchangeV2QueryPb.QueryTradeRewardCampaignResponse,
  ): TradeRewardCampaign {
    return {
      tradingRewardCampaignInfo:
        ChainGrpcExchangeTransformerV2.grpcTradingRewardCampaignInfoToTradingRewardCampaignInfo(
          response.tradingRewardCampaignInfo,
        ),
      tradingRewardPoolCampaignScheduleList:
        response.tradingRewardPoolCampaignSchedule.map(
          ChainGrpcExchangeTransformerV2.grpcCampaignRewardPoolToCampaignRewardPool,
        ),
      pendingTradingRewardPoolCampaignScheduleList:
        response.pendingTradingRewardPoolCampaignSchedule.map(
          ChainGrpcExchangeTransformerV2.grpcCampaignRewardPoolToCampaignRewardPool,
        ),
      totalTradeRewardPoints: response.totalTradeRewardPoints,
      pendingTotalTradeRewardPointsList: response.pendingTotalTradeRewardPoints,
    }
  }
  static isOptedOutOfRewardsResponseToIsOptedOutOfRewards(
    response: InjectiveExchangeV2QueryPb.QueryIsOptedOutOfRewardsResponse,
  ): IsOptedOutOfRewards {
    return { isOptedOut: response.isOptedOut }
  }
  static activeStakeGrantResponseToActiveStakeGrant(
    response: InjectiveExchangeV2QueryPb.QueryActiveStakeGrantResponse,
  ): {
    grant: InjectiveExchangeV2ExchangePb.ActiveGrant
    effectiveGrant: InjectiveExchangeV2ExchangePb.EffectiveGrant
  } {
    if (!response.grant || !response.effectiveGrant) {
      throw new Error('Active stake grant not found in response')
    }

    return { grant: response.grant, effectiveGrant: response.effectiveGrant }
  }
  static denomDecimalsResponseToDenomDecimals(
    response: InjectiveExchangeV2QueryPb.QueryAuctionExchangeTransferDenomDecimalsResponse,
  ): ChainDenomDecimal[] {
    return response.denomDecimals.map((item) => ({
      denom: item.denom,
      decimals: item.decimals.toString(),
    }))
  }
  static denomMinNotionalsResponseToDenomMinNotionals(
    response: InjectiveExchangeV2QueryPb.QueryDenomMinNotionalsResponse,
  ): ChainDenomMinNotional[] {
    return response.denomMinNotionals.map((item) => ({
      denom: item.denom,
      minNotional: item.minNotional,
    }))
  }

  static l3OrderbookResponseToOrderbook(
    response:
      | InjectiveExchangeV2QueryPb.QueryFullDerivativeOrderbookResponse
      | InjectiveExchangeV2QueryPb.QueryFullSpotOrderbookResponse,
  ): ChainL3Orderbook {
    return {
      bids: response.bids.map((order) => ({
        price: order.price,
        quantity: order.quantity,
        orderHash: order.orderHash,
        subaccountId: order.subaccountId,
      })),
      asks: response.asks.map((order) => ({
        price: order.price,
        quantity: order.quantity,
        orderHash: order.orderHash,
        subaccountId: order.subaccountId,
      })),
      sequence: Number(response.seq),
    }
  }

  static orderbookResponseToOrderbook(
    response:
      | InjectiveExchangeV2QueryPb.QueryDerivativeOrderbookResponse
      | InjectiveExchangeV2QueryPb.QuerySpotOrderbookResponse,
  ): ChainOrderbook {
    return {
      buys: response.buysPriceLevel.map(
        ChainGrpcExchangeTransformerV2.grpcLevelToOrderbookLevel,
      ),
      sells: response.sellsPriceLevel.map(
        ChainGrpcExchangeTransformerV2.grpcLevelToOrderbookLevel,
      ),
      sequence: Number(response.seq),
    }
  }

  static grpcLevelToOrderbookLevel(
    level: InjectiveExchangeV2ExchangePb.Level,
  ): ChainOrderbookLevel {
    return { price: level.p, quantity: level.q }
  }

  static grpcTrimmedSpotLimitOrderToOrder(
    order: InjectiveExchangeV2QueryPb.TrimmedSpotLimitOrder,
  ): ChainTrimmedSpotLimitOrder {
    return {
      price: order.price,
      quantity: order.quantity,
      fillable: order.fillable,
      isBuy: order.isBuy,
      orderHash: order.orderHash,
      cid: order.cid,
    }
  }

  static grpcTrimmedDerivativeLimitOrderToOrder(
    order: InjectiveExchangeV2QueryPb.TrimmedDerivativeLimitOrder,
  ): ChainTrimmedDerivativeLimitOrder {
    return {
      ...ChainGrpcExchangeTransformerV2.grpcTrimmedSpotLimitOrderToOrder(order),
      margin: order.margin,
    }
  }

  static spotOrdersResponseToOrders(
    response:
      | InjectiveExchangeV2QueryPb.QueryAccountAddressSpotOrdersResponse
      | InjectiveExchangeV2QueryPb.QuerySpotOrdersByHashesResponse
      | InjectiveExchangeV2QueryPb.QueryTraderSpotOrdersResponse,
  ): { orders: ChainTrimmedSpotLimitOrder[] } {
    return {
      orders: response.orders.map(
        ChainGrpcExchangeTransformerV2.grpcTrimmedSpotLimitOrderToOrder,
      ),
    }
  }

  static derivativeOrdersResponseToOrders(
    response:
      | InjectiveExchangeV2QueryPb.QueryAccountAddressDerivativeOrdersResponse
      | InjectiveExchangeV2QueryPb.QueryDerivativeOrdersByHashesResponse
      | InjectiveExchangeV2QueryPb.QueryTraderDerivativeOrdersResponse,
  ): { orders: ChainTrimmedDerivativeLimitOrder[] } {
    return {
      orders: response.orders.map(
        ChainGrpcExchangeTransformerV2.grpcTrimmedDerivativeLimitOrderToOrder,
      ),
    }
  }

  static grpcSubaccountOrderDataToOrderData(
    data: InjectiveExchangeV2ExchangePb.SubaccountOrderData,
  ): ChainSubaccountOrderData {
    return {
      order: data.order
        ? {
            price: data.order.price,
            quantity: data.order.quantity,
            isReduceOnly: data.order.isReduceOnly,
            cid: data.order.cid,
          }
        : undefined,
      orderHash: bytesToHex(data.orderHash),
    }
  }

  static subaccountOrdersResponseToOrders(
    response: InjectiveExchangeV2QueryPb.QuerySubaccountOrdersResponse,
  ): {
    buyOrders: ChainSubaccountOrderData[]
    sellOrders: ChainSubaccountOrderData[]
  } {
    return {
      buyOrders: response.buyOrders.map(
        ChainGrpcExchangeTransformerV2.grpcSubaccountOrderDataToOrderData,
      ),
      sellOrders: response.sellOrders.map(
        ChainGrpcExchangeTransformerV2.grpcSubaccountOrderDataToOrderData,
      ),
    }
  }

  static crossMarginPoolSnapshotResponseToCrossMarginPoolSnapshot(
    response: InjectiveExchangeV2QueryPb.QueryCrossMarginPoolSnapshotResponse,
  ): ChainCrossMarginPoolSnapshot {
    return {
      quoteDenom: response.quoteDenom,
      quoteBalance: response.quoteBalance,
      positionMarginTotal: response.positionMarginTotal,
      unrealizedPnl: response.unrealizedPnl,
      unrealizedPnlEffective: response.unrealizedPnlEffective,
      equityAdmission: response.equityAdmission,
      equityLiquidation: response.equityLiquidation,
      initialMarginTotal: response.initialMarginTotal,
      maintenanceMarginTotal: response.maintenanceMarginTotal,
      initialMarginWithOrdersTotal: response.initialMarginWithOrdersTotal,
      entryLossTotal: response.entryLossTotal,
      feeReserveTotal: response.feeReserveTotal,
      orderLockRequirement: response.orderLockRequirement,
      positiveUpnlHaircutRate: response.positiveUpnlHaircutRate,
      healthFactor: response.healthFactor,
    }
  }

  static tradeRewardPointsResponseToTradeRewardPoints(
    response: InjectiveExchangeV2QueryPb.QueryTradeRewardPointsResponse,
  ): ChainTradeRewardPoints {
    return { accountTradeRewardPoints: response.accountTradeRewardPoints }
  }

  static openInterestResponseToOpenInterest(
    response: InjectiveExchangeV2QueryPb.QueryOpenInterestResponse,
  ): { amount?: ChainOpenInterest } {
    return {
      amount: response.amount
        ? {
            marketId: response.amount.marketId,
            balance: response.amount.balance,
          }
        : undefined,
    }
  }

  static subaccountDepositsResponseToSubaccountDeposits(
    response: InjectiveExchangeV2QueryPb.QuerySubaccountDepositsResponse,
  ): { deposits: Record<string, ChainDeposit> } {
    return {
      deposits: Object.fromEntries(
        Object.entries(response.deposits).map(([denom, deposit]) => [
          denom,
          {
            availableBalance: deposit.availableBalance,
            totalBalance: deposit.totalBalance,
          },
        ]),
      ),
    }
  }

  static subaccountDepositResponseToSubaccountDeposit(
    response: InjectiveExchangeV2QueryPb.QuerySubaccountDepositResponse,
  ): { deposits?: ChainDeposit } {
    return {
      deposits: response.deposits
        ? {
            availableBalance: response.deposits.availableBalance,
            totalBalance: response.deposits.totalBalance,
          }
        : undefined,
    }
  }

  static aggregateVolumeResponseToAggregateVolume(
    response: InjectiveExchangeV2QueryPb.QueryAggregateVolumeResponse,
  ): { aggregateVolumes: ChainMarketVolume[] } {
    return {
      aggregateVolumes: response.aggregateVolumes.map(
        ChainGrpcExchangeTransformerV2.grpcMarketVolumeToMarketVolume,
      ),
    }
  }

  static aggregateVolumesResponseToAggregateVolumes(
    response: InjectiveExchangeV2QueryPb.QueryAggregateVolumesResponse,
  ): {
    aggregateAccountVolumes: ChainAggregateAccountVolume[]
    aggregateMarketVolumes: ChainMarketVolume[]
  } {
    return {
      aggregateAccountVolumes: response.aggregateAccountVolumes.map(
        (record) => ({
          account: record.account,
          marketVolumes: record.marketVolumes.map(
            ChainGrpcExchangeTransformerV2.grpcMarketVolumeToMarketVolume,
          ),
        }),
      ),
      aggregateMarketVolumes: response.aggregateMarketVolumes.map(
        ChainGrpcExchangeTransformerV2.grpcMarketVolumeToMarketVolume,
      ),
    }
  }

  static aggregateMarketVolumeResponseToAggregateMarketVolume(
    response: InjectiveExchangeV2QueryPb.QueryAggregateMarketVolumeResponse,
  ): { volume?: { makerVolume: string; takerVolume: string } } {
    return {
      volume: response.volume
        ? {
            makerVolume: response.volume.makerVolume,
            takerVolume: response.volume.takerVolume,
          }
        : undefined,
    }
  }

  static aggregateMarketVolumesResponseToAggregateMarketVolumes(
    response: InjectiveExchangeV2QueryPb.QueryAggregateMarketVolumesResponse,
  ): { volumes: ChainMarketVolume[] } {
    return {
      volumes: response.volumes.map(
        ChainGrpcExchangeTransformerV2.grpcMarketVolumeToMarketVolume,
      ),
    }
  }

  static midPriceAndTobResponseToMidPriceAndTob(
    response:
      | InjectiveExchangeV2QueryPb.QueryDerivativeMidPriceAndTOBResponse
      | InjectiveExchangeV2QueryPb.QuerySpotMidPriceAndTOBResponse,
  ): ChainMidPriceAndTob {
    return {
      midPrice: response.midPrice,
      bestBuyPrice: response.bestBuyPrice,
      bestSellPrice: response.bestSellPrice,
    }
  }

  static derivativeMarketAddressResponseToDerivativeMarketAddress(
    response: InjectiveExchangeV2QueryPb.QueryDerivativeMarketAddressResponse,
  ): ChainDerivativeMarketAddress {
    return { address: response.address, subaccountId: response.subaccountId }
  }

  static grpcMarketVolumeToMarketVolume(
    marketVolume: InjectiveExchangeV2MarketPb.MarketVolume,
  ): ChainMarketVolume {
    return {
      marketId: marketVolume.marketId,
      volume: marketVolume.volume
        ? {
            makerVolume: marketVolume.volume.makerVolume,
            takerVolume: marketVolume.volume.takerVolume,
          }
        : undefined,
    }
  }

  static spotMarketsResponseToSpotMarkets(
    response: InjectiveExchangeV2QueryPb.QuerySpotMarketsResponse,
  ): SpotMarket[] {
    return response.markets.map(
      ChainGrpcExchangeTransformerV2.grpcSpotMarketToSpotMarket,
    )
  }

  static grpcSpotMarketToSpotMarket(
    market: InjectiveExchangeV2MarketPb.SpotMarket,
  ): SpotMarket {
    return {
      marketId: market.marketId,
      marketStatus: market.status.toString(),
      ticker: market.ticker,
      baseDenom: market.baseDenom,
      quoteDenom: market.quoteDenom,
      makerFeeRate: market.makerFeeRate,
      quoteToken: undefined,
      baseToken: undefined,
      takerFeeRate: market.takerFeeRate,
      serviceProviderFee: '',
      minPriceTickSize: Number(market.minPriceTickSize),
      minQuantityTickSize: Number(market.minQuantityTickSize),
      minNotional: Number(market.minNotional),
    }
  }

  static fullSpotMarketsResponseToSpotMarkets(
    response: InjectiveExchangeV2QueryPb.QueryFullSpotMarketsResponse,
  ): SpotMarket[] {
    return response.markets.map(
      ChainGrpcExchangeTransformerV2.grpcFullSpotMarketToSpotMarket,
    )
  }

  static grpcFullSpotMarketToSpotMarket(
    market: InjectiveExchangeV2QueryPb.FullSpotMarket,
  ): SpotMarket {
    return ChainGrpcExchangeTransformerV2.grpcSpotMarketToSpotMarket(
      market.market!,
    )
  }

  static derivativeMarketsResponseToDerivativeMarkets(
    response: InjectiveExchangeV2QueryPb.QueryDerivativeMarketsResponse,
  ): DerivativeMarket[] {
    return response.markets.map(
      ChainGrpcExchangeTransformerV2.grpcFullDerivativeMarketToDerivativeMarket,
    )
  }

  static grpcFullDerivativeMarketToDerivativeMarket(
    market: InjectiveExchangeV2QueryPb.FullDerivativeMarket,
  ): DerivativeMarket {
    const marketInfo = market.market!
    const perpetualMarketInfo =
      market.info?.oneofKind === 'perpetualInfo'
        ? market.info.perpetualInfo.marketInfo
        : undefined

    return {
      oracleType: marketInfo.oracleType.toString(),
      marketId: marketInfo.marketId,
      marketStatus: marketInfo.status.toString(),
      ticker: marketInfo.ticker,
      quoteDenom: marketInfo.quoteDenom,
      makerFeeRate: marketInfo.makerFeeRate,
      takerFeeRate: marketInfo.takerFeeRate,
      serviceProviderFee: '',
      quoteToken: undefined,
      minPriceTickSize: Number(marketInfo.minPriceTickSize),
      minQuantityTickSize: Number(marketInfo.minQuantityTickSize),
      minNotional: Number(marketInfo.minNotional),
      reduceMarginRatio: marketInfo.reduceMarginRatio,
      initialMarginRatio: marketInfo.initialMarginRatio,
      maintenanceMarginRatio: marketInfo.maintenanceMarginRatio,
      isPerpetual: marketInfo.isPerpetual,
      oracleBase: marketInfo.oracleBase,
      oracleQuote: marketInfo.oracleQuote,
      oracleScaleFactor: marketInfo.oracleScaleFactor,
      perpetualMarketInfo: {
        hourlyFundingRateCap: perpetualMarketInfo?.hourlyFundingRateCap ?? '0',
        hourlyInterestRate: perpetualMarketInfo?.hourlyInterestRate ?? '0',
        nextFundingTimestamp: Number(
          perpetualMarketInfo?.nextFundingTimestamp ?? 0,
        ),
        fundingInterval: Number(perpetualMarketInfo?.fundingInterval ?? 0),
      },
    }
  }

  static subaccountRiskProfileResponseToSubaccountRiskProfile(
    response: InjectiveExchangeV2QueryPb.QuerySubaccountRiskProfileResponse,
  ): { profile?: ChainSubaccountRiskProfile; isDefault: boolean } {
    return {
      profile: response.profile
        ? {
            mode: response.profile.mode,
            reservationPolicy: response.profile.reservationPolicy,
            creditLineId: response.profile.creditLineId,
          }
        : undefined,
      isDefault: response.isDefault,
    }
  }

  static positionsResponseToPositions(
    response: InjectiveExchangeV2QueryPb.QueryPositionsResponse,
  ): ChainDerivativePosition[] {
    return response.state.map(
      ChainGrpcExchangeTransformerV2.grpcDerivativePositionToDerivativePosition,
    )
  }

  static positionsInMarketResponseToPositions(
    response:
      | InjectiveExchangeV2QueryPb.QueryPositionsInMarketResponse
      | InjectiveExchangeV2QueryPb.QuerySubaccountPositionsResponse,
  ): { state: ChainDerivativePosition[] } {
    return {
      state: response.state.map(
        ChainGrpcExchangeTransformerV2.grpcDerivativePositionToDerivativePosition,
      ),
    }
  }

  static grpcDerivativePositionToDerivativePosition(
    position: InjectiveExchangeV2ExchangePb.DerivativePosition,
  ): ChainDerivativePosition {
    return {
      subaccountId: position.subaccountId,
      marketId: position.marketId,
      position: position.position
        ? {
            islong: position.position.isLong,
            quantity: position.position.quantity,
            entryPrice: position.position.entryPrice,
            margin: position.position.margin,
            cumulativeFundingEntry: position.position.cumulativeFundingEntry,
          }
        : undefined,
    }
  }

  static effectivePositionResponseToEffectivePosition(
    response: InjectiveExchangeV2QueryPb.QuerySubaccountEffectivePositionInMarketResponse,
  ): { state?: ChainEffectivePosition; riskMode: number } {
    return {
      state: response.state
        ? {
            isLong: response.state.isLong,
            quantity: response.state.quantity,
            entryPrice: response.state.entryPrice,
            effectiveMargin: response.state.effectiveMargin,
          }
        : undefined,
      riskMode: response.riskMode,
    }
  }

  static positionInMarketResponseToPositionInMarket(
    response: InjectiveExchangeV2QueryPb.QuerySubaccountPositionInMarketResponse,
  ): { state?: ChainPosition; riskMode: number } {
    return {
      state: response.state
        ? {
            islong: response.state.isLong,
            quantity: response.state.quantity,
            entryPrice: response.state.entryPrice,
            margin: response.state.margin,
            cumulativeFundingEntry: response.state.cumulativeFundingEntry,
          }
        : undefined,
      riskMode: response.riskMode,
    }
  }

  static perpetualMarketInfoResponseToPerpetualMarketInfo(
    response: InjectiveExchangeV2QueryPb.QueryPerpetualMarketInfoResponse,
  ): { info?: ChainPerpetualMarketInfo } {
    return {
      info: response.info
        ? {
            marketId: response.info.marketId,
            hourlyFundingRateCap: response.info.hourlyFundingRateCap,
            hourlyInterestRate: response.info.hourlyInterestRate,
            nextFundingTimestamp: Number(response.info.nextFundingTimestamp),
            fundingInterval: Number(response.info.fundingInterval),
          }
        : undefined,
    }
  }

  static expiryFuturesMarketInfoResponseToExpiryFuturesMarketInfo(
    response: InjectiveExchangeV2QueryPb.QueryExpiryFuturesMarketInfoResponse,
  ): { info?: ChainExpiryFuturesMarketInfo } {
    return {
      info: response.info
        ? {
            marketId: response.info.marketId,
            expirationTimestamp: Number(response.info.expirationTimestamp),
            twapStartTimestamp: Number(response.info.twapStartTimestamp),
            expirationTwapStartPriceCumulative:
              response.info.expirationTwapStartPriceCumulative,
            settlementPrice: response.info.settlementPrice,
            expirationTwapStartBaseCumulativePrice:
              response.info.expirationTwapStartBaseCumulativePrice,
            expirationTwapStartQuoteCumulativePrice:
              response.info.expirationTwapStartQuoteCumulativePrice,
          }
        : undefined,
    }
  }

  static perpetualMarketFundingResponseToPerpetualMarketFunding(
    response: InjectiveExchangeV2QueryPb.QueryPerpetualMarketFundingResponse,
  ): { state?: ChainPerpetualMarketFunding } {
    return {
      state: response.state
        ? {
            cumulativeFunding: response.state.cumulativeFunding,
            cumulativePrice: response.state.cumulativePrice,
            lastTimestamp: Number(response.state.lastTimestamp),
          }
        : undefined,
    }
  }

  static feeDiscountTierStatisticsResponseToFeeDiscountTierStatistics(
    response: InjectiveExchangeV2QueryPb.QueryFeeDiscountTierStatisticsResponse,
  ): { statistics: ChainTierStatistic[] } {
    return {
      statistics: response.statistics.map((statistic) => ({
        tier: Number(statistic.tier),
        count: Number(statistic.count),
      })),
    }
  }

  static historicalTradeRecordsResponseToHistoricalTradeRecords(
    response: InjectiveExchangeV2QueryPb.QueryHistoricalTradeRecordsResponse,
  ): { tradeRecords: ChainTradeRecords[] } {
    return {
      tradeRecords: response.tradeRecords.map((records) => ({
        marketId: records.marketId,
        latestTradeRecords: records.latestTradeRecords.map(
          ChainGrpcExchangeTransformerV2.grpcTradeRecordToTradeRecord,
        ),
      })),
    }
  }

  static grpcTradeRecordToTradeRecord(
    record: InjectiveExchangeV2ExchangePb.TradeRecord,
  ): ChainTradeRecord {
    return {
      timestamp: Number(record.timestamp),
      price: record.price,
      quantity: record.quantity,
    }
  }

  static grantAuthorizationsResponseToGrantAuthorizations(
    response: InjectiveExchangeV2QueryPb.QueryGrantAuthorizationsResponse,
  ): { totalGrantAmount: string; grants: ChainGrantAuthorization[] } {
    return {
      totalGrantAmount: response.totalGrantAmount,
      grants: response.grants.map((grant) => ({
        grantee: grant.grantee,
        amount: grant.amount,
      })),
    }
  }

  static marketBalanceResponseToMarketBalance(
    response: InjectiveExchangeV2QueryPb.QueryMarketBalanceResponse,
  ): { balance?: ChainMarketBalance } {
    return {
      balance: response.balance
        ? {
            marketId: response.balance.marketId,
            balance: response.balance.balance,
          }
        : undefined,
    }
  }

  static derivativeConditionalOrdersResponseToDerivativeConditionalOrders(
    response: InjectiveExchangeV2QueryPb.QueryTraderDerivativeConditionalOrdersResponse,
  ): { orders: ChainTrimmedDerivativeConditionalOrder[] } {
    return {
      orders: response.orders.map((order) => ({
        price: order.price,
        quantity: order.quantity,
        margin: order.margin,
        triggerPrice: order.triggerPrice,
        isBuy: order.isBuy,
        isLimit: order.isLimit,
        orderHash: order.orderHash,
        cid: order.cid,
      })),
    }
  }

  static subaccountOrderMetadataResponseToSubaccountOrderMetadata(
    response: InjectiveExchangeV2QueryPb.QuerySubaccountOrderMetadataResponse,
  ): { metadata: ChainSubaccountOrderbookMetadata[] } {
    return {
      metadata: response.metadata.map((item) => ({
        marketId: item.marketId,
        isBuy: item.isBuy,
        metadata: item.metadata
          ? {
              vanillaLimitOrderCount: item.metadata.vanillaLimitOrderCount,
              reduceOnlyLimitOrderCount:
                item.metadata.reduceOnlyLimitOrderCount,
              aggregateReduceOnlyQuantity:
                item.metadata.aggregateReduceOnlyQuantity,
              aggregateVanillaQuantity: item.metadata.aggregateVanillaQuantity,
              vanillaConditionalOrderCount:
                item.metadata.vanillaConditionalOrderCount,
              reduceOnlyConditionalOrderCount:
                item.metadata.reduceOnlyConditionalOrderCount,
            }
          : undefined,
      })),
    }
  }

  static binaryOptionsMarketsResponseToBinaryOptionsMarkets(
    response: InjectiveExchangeV2QueryPb.QueryBinaryMarketsResponse,
  ): { markets: ChainBinaryOptionsMarket[] } {
    return {
      markets: response.markets.map((market) => ({
        ticker: market.ticker,
        oracleSymbol: market.oracleSymbol,
        oracleProvider: market.oracleProvider,
        oracleType: market.oracleType,
        oracleScaleFactor: market.oracleScaleFactor,
        expirationTimestamp: Number(market.expirationTimestamp),
        settlementTimestamp: Number(market.settlementTimestamp),
        admin: market.admin,
        quoteDenom: market.quoteDenom,
        marketId: market.marketId,
        makerFeeRate: market.makerFeeRate,
        takerFeeRate: market.takerFeeRate,
        relayerFeeShareRate: market.relayerFeeShareRate,
        status: market.status,
        minPriceTickSize: market.minPriceTickSize,
        minQuantityTickSize: market.minQuantityTickSize,
        settlementPrice: market.settlementPrice,
        minNotional: market.minNotional,
        adminPermissions: market.adminPermissions,
        quoteDecimals: market.quoteDecimals,
        openNotionalCap:
          market.openNotionalCap &&
          market.openNotionalCap.cap.oneofKind !== undefined
            ? {
                type:
                  market.openNotionalCap.cap.oneofKind === 'capped'
                    ? 'capped'
                    : 'uncapped',
                value:
                  market.openNotionalCap.cap.oneofKind === 'capped'
                    ? market.openNotionalCap.cap.capped.value
                    : undefined,
              }
            : undefined,
        hasDisabledMinimalProtocolFee: market.hasDisabledMinimalProtocolFee,
        forcePausedInfo: market.forcePausedInfo
          ? {
              reason: market.forcePausedInfo.reason,
              markPriceAtPausing: market.forcePausedInfo.markPriceAtPausing,
            }
          : undefined,
      })),
    }
  }

  static marketVolatilityResponseToMarketVolatility(
    response: InjectiveExchangeV2QueryPb.QueryMarketVolatilityResponse,
  ): ChainMarketVolatility {
    return {
      volatility: response.volatility,
      historyMetadata: response.historyMetadata
        ? {
            groupCount: response.historyMetadata.groupCount,
            recordsSampleSize: response.historyMetadata.recordsSampleSize,
            mean: response.historyMetadata.mean,
            twap: response.historyMetadata.twap,
            firstTimestamp: Number(response.historyMetadata.firstTimestamp),
            lastTimestamp: Number(response.historyMetadata.lastTimestamp),
            minPrice: response.historyMetadata.minPrice,
            maxPrice: response.historyMetadata.maxPrice,
            medianPrice: response.historyMetadata.medianPrice,
          }
        : undefined,
      rawHistory: response.rawHistory.map(
        ChainGrpcExchangeTransformerV2.grpcTradeRecordToTradeRecord,
      ),
    }
  }
}
