import * as InjectiveExchangeV2QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/query_pb'
import { QueryClient as InjectiveExchangeV2QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import {
  ChainGrpcExchangeTransformer,
  ChainGrpcExchangeTransformerV2,
} from '../transformers/index.js'
import type * as InjectiveExchangeV2GenesisPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/genesis_pb'
import type * as InjectiveExchangeV2ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/exchange_pb'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcExchangeApiV2 extends BaseGrpcConsumer {
  protected module: string = ChainModule.Exchange

  private get client() {
    return this.initClient(InjectiveExchangeV2QueryClient)
  }

  async fetchModuleParams() {
    const request =
      InjectiveExchangeV2QueryPb.QueryExchangeParamsRequest.create()
    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryExchangeParamsRequest,
      InjectiveExchangeV2QueryPb.QueryExchangeParamsResponse
    >(request, this.client.queryExchangeParams.bind(this.client))

    return ChainGrpcExchangeTransformer.moduleParamsResponseToParams(response)
  }

  async fetchModuleState(): Promise<InjectiveExchangeV2GenesisPb.GenesisState> {
    const request = InjectiveExchangeV2QueryPb.QueryModuleStateRequest.create()
    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryModuleStateRequest,
      InjectiveExchangeV2QueryPb.QueryModuleStateResponse
    >(request, this.client.exchangeModuleState.bind(this.client))

    return ChainGrpcExchangeTransformerV2.moduleStateResponseToModuleState(
      response,
    )
  }

  async fetchFeeDiscountSchedule() {
    const request =
      InjectiveExchangeV2QueryPb.QueryFeeDiscountScheduleRequest.create()
    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryFeeDiscountScheduleRequest,
      InjectiveExchangeV2QueryPb.QueryFeeDiscountScheduleResponse
    >(request, this.client.feeDiscountSchedule.bind(this.client))

    return ChainGrpcExchangeTransformer.feeDiscountScheduleResponseToFeeDiscountSchedule(
      response,
    )
  }

  async fetchFeeDiscountAccountInfo(injectiveAddress: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryFeeDiscountAccountInfoRequest.create()
    request.account = injectiveAddress

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryFeeDiscountAccountInfoRequest,
      InjectiveExchangeV2QueryPb.QueryFeeDiscountAccountInfoResponse
    >(request, this.client.feeDiscountAccountInfo.bind(this.client))

    return ChainGrpcExchangeTransformer.feeDiscountAccountInfoResponseToFeeDiscountAccountInfo(
      response,
    )
  }

  async fetchTradingRewardsCampaign() {
    const request =
      InjectiveExchangeV2QueryPb.QueryTradeRewardCampaignRequest.create()
    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryTradeRewardCampaignRequest,
      InjectiveExchangeV2QueryPb.QueryTradeRewardCampaignResponse
    >(request, this.client.tradeRewardCampaign.bind(this.client))

    return ChainGrpcExchangeTransformer.tradingRewardsCampaignResponseToTradingRewardsCampaign(
      response,
    )
  }

  async fetchTradeRewardPoints(injectiveAddresses: string[]) {
    const request =
      InjectiveExchangeV2QueryPb.QueryTradeRewardPointsRequest.create()
    request.accounts = injectiveAddresses

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryTradeRewardPointsRequest,
      InjectiveExchangeV2QueryPb.QueryTradeRewardPointsResponse
    >(request, this.client.tradeRewardPoints.bind(this.client))

    return ChainGrpcExchangeTransformerV2.tradeRewardPointsResponseToTradeRewardPoints(
      response,
    )
  }

  async fetchPendingTradeRewardPoints(
    injectiveAddresses: string[],
    timestamp?: number,
  ) {
    const request =
      InjectiveExchangeV2QueryPb.QueryTradeRewardPointsRequest.create()
    request.accounts = injectiveAddresses

    if (timestamp) {
      request.pendingPoolTimestamp = BigInt(timestamp)
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryTradeRewardPointsRequest,
      InjectiveExchangeV2QueryPb.QueryTradeRewardPointsResponse
    >(request, this.client.pendingTradeRewardPoints.bind(this.client))

    return ChainGrpcExchangeTransformerV2.tradeRewardPointsResponseToTradeRewardPoints(
      response,
    )
  }

  async fetchPositions() {
    const request = InjectiveExchangeV2QueryPb.QueryPositionsRequest.create()
    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryPositionsRequest,
      InjectiveExchangeV2QueryPb.QueryPositionsResponse
    >(request, this.client.positions.bind(this.client))

    return ChainGrpcExchangeTransformer.positionsResponseToPositions(response)
  }

  async fetchSubaccountTradeNonce(subaccountId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySubaccountTradeNonceRequest.create()
    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySubaccountTradeNonceRequest,
      InjectiveExchangeV2QueryPb.QuerySubaccountTradeNonceResponse
    >(request, this.client.subaccountTradeNonce.bind(this.client))

    return { nonce: response.nonce }
  }

  async fetchIsOptedOutOfRewards(account: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryIsOptedOutOfRewardsRequest.create()
    request.account = account

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryIsOptedOutOfRewardsRequest,
      InjectiveExchangeV2QueryPb.QueryIsOptedOutOfRewardsResponse
    >(request, this.client.isOptedOutOfRewards.bind(this.client))

    return ChainGrpcExchangeTransformer.isOptedOutOfRewardsResponseToIsOptedOutOfRewards(
      response,
    )
  }

  async fetchActiveStakeGrant(account: string): Promise<{
    grant: InjectiveExchangeV2ExchangePb.ActiveGrant
    effectiveGrant: InjectiveExchangeV2ExchangePb.EffectiveGrant
  }> {
    const request =
      InjectiveExchangeV2QueryPb.QueryActiveStakeGrantRequest.create()
    request.grantee = account

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryActiveStakeGrantRequest,
      InjectiveExchangeV2QueryPb.QueryActiveStakeGrantResponse
    >(request, this.client.activeStakeGrant.bind(this.client))

    return ChainGrpcExchangeTransformer.activeStakeGrantResponseToActiveStakeGrant(
      response,
    )
  }

  async fetchDenomDecimal(denom: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryAuctionExchangeTransferDenomDecimalRequest.create()
    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryAuctionExchangeTransferDenomDecimalRequest,
      InjectiveExchangeV2QueryPb.QueryAuctionExchangeTransferDenomDecimalResponse
    >(
      request,
      this.client.auctionExchangeTransferDenomDecimal.bind(this.client),
    )

    return { decimal: response.decimal }
  }

  async fetchDenomDecimals() {
    const request =
      InjectiveExchangeV2QueryPb.QueryAuctionExchangeTransferDenomDecimalsRequest.create()
    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryAuctionExchangeTransferDenomDecimalsRequest,
      InjectiveExchangeV2QueryPb.QueryAuctionExchangeTransferDenomDecimalsResponse
    >(
      request,
      this.client.auctionExchangeTransferDenomDecimals.bind(this.client),
    )

    return ChainGrpcExchangeTransformer.denomDecimalsResponseToDenomDecimals(
      response,
    )
  }

  async fetchDenomMinNotional(denom: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryDenomMinNotionalRequest.create()
    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryDenomMinNotionalRequest,
      InjectiveExchangeV2QueryPb.QueryDenomMinNotionalResponse
    >(request, this.client.denomMinNotional.bind(this.client))

    return { amount: response.amount }
  }

  async fetchDenomMinNotionals() {
    const request =
      InjectiveExchangeV2QueryPb.QueryDenomMinNotionalsRequest.create()
    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryDenomMinNotionalsRequest,
      InjectiveExchangeV2QueryPb.QueryDenomMinNotionalsResponse
    >(request, this.client.denomMinNotionals.bind(this.client))

    return ChainGrpcExchangeTransformer.denomMinNotionalsResponseToDenomMinNotionals(
      response,
    )
  }

  async fetchOpenInterest(marketId: string) {
    const request = InjectiveExchangeV2QueryPb.QueryOpenInterestRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryOpenInterestRequest,
      InjectiveExchangeV2QueryPb.QueryOpenInterestResponse
    >(request, this.client.openInterest.bind(this.client))

    return ChainGrpcExchangeTransformerV2.openInterestResponseToOpenInterest(
      response,
    )
  }

  async fetchDerivativeMarkets(status?: string, marketIds?: string[]) {
    const request =
      InjectiveExchangeV2QueryPb.QueryDerivativeMarketsRequest.create()
    if (status) {
      request.status = status
    }
    if (marketIds) {
      request.marketIds = marketIds
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryDerivativeMarketsRequest,
      InjectiveExchangeV2QueryPb.QueryDerivativeMarketsResponse
    >(request, this.client.derivativeMarkets.bind(this.client))

    return ChainGrpcExchangeTransformerV2.derivativeMarketsResponseToDerivativeMarkets(
      response,
    )
  }

  async fetchSpotMarkets(status?: string, marketIds?: string[]) {
    const request = InjectiveExchangeV2QueryPb.QuerySpotMarketsRequest.create()
    if (status) {
      request.status = status
    }
    if (marketIds) {
      request.marketIds = marketIds
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySpotMarketsRequest,
      InjectiveExchangeV2QueryPb.QuerySpotMarketsResponse
    >(request, this.client.spotMarkets.bind(this.client))

    return ChainGrpcExchangeTransformerV2.spotMarketsResponseToSpotMarkets(
      response,
    )
  }

  async fetchFullSpotMarkets(status?: string, marketIds?: string[]) {
    const request =
      InjectiveExchangeV2QueryPb.QueryFullSpotMarketsRequest.create()
    if (status) {
      request.status = status
    }
    if (marketIds) {
      request.marketIds = marketIds
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryFullSpotMarketsRequest,
      InjectiveExchangeV2QueryPb.QueryFullSpotMarketsResponse
    >(request, this.client.fullSpotMarkets.bind(this.client))

    return ChainGrpcExchangeTransformerV2.fullSpotMarketsResponseToSpotMarkets(
      response,
    )
  }

  async fetchL3DerivativeOrderbook(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryFullDerivativeOrderbookRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryFullDerivativeOrderbookRequest,
      InjectiveExchangeV2QueryPb.QueryFullDerivativeOrderbookResponse
    >(request, this.client.l3DerivativeOrderBook.bind(this.client))

    return ChainGrpcExchangeTransformerV2.l3OrderbookResponseToOrderbook(
      response,
    )
  }

  async fetchL3SpotOrderbook(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryFullSpotOrderbookRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryFullSpotOrderbookRequest,
      InjectiveExchangeV2QueryPb.QueryFullSpotOrderbookResponse
    >(request, this.client.l3SpotOrderBook.bind(this.client))

    return ChainGrpcExchangeTransformerV2.l3OrderbookResponseToOrderbook(
      response,
    )
  }

  async fetchSubaccountDeposits(subaccountId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySubaccountDepositsRequest.create()
    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySubaccountDepositsRequest,
      InjectiveExchangeV2QueryPb.QuerySubaccountDepositsResponse
    >(request, this.client.subaccountDeposits.bind(this.client))

    return ChainGrpcExchangeTransformerV2.subaccountDepositsResponseToSubaccountDeposits(
      response,
    )
  }

  async fetchSubaccountDeposit({
    subaccountId,
    denom,
  }: {
    subaccountId: string
    denom: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySubaccountDepositRequest.create()
    request.subaccountId = subaccountId
    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySubaccountDepositRequest,
      InjectiveExchangeV2QueryPb.QuerySubaccountDepositResponse
    >(request, this.client.subaccountDeposit.bind(this.client))

    return ChainGrpcExchangeTransformerV2.subaccountDepositResponseToSubaccountDeposit(
      response,
    )
  }

  async fetchAggregateVolume(account: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryAggregateVolumeRequest.create()
    request.account = account

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryAggregateVolumeRequest,
      InjectiveExchangeV2QueryPb.QueryAggregateVolumeResponse
    >(request, this.client.aggregateVolume.bind(this.client))

    return ChainGrpcExchangeTransformerV2.aggregateVolumeResponseToAggregateVolume(
      response,
    )
  }

  async fetchAggregateVolumes({
    accounts,
    marketIds,
  }: {
    accounts: string[]
    marketIds: string[]
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryAggregateVolumesRequest.create()
    request.accounts = accounts
    request.marketIds = marketIds

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryAggregateVolumesRequest,
      InjectiveExchangeV2QueryPb.QueryAggregateVolumesResponse
    >(request, this.client.aggregateVolumes.bind(this.client))

    return ChainGrpcExchangeTransformerV2.aggregateVolumesResponseToAggregateVolumes(
      response,
    )
  }

  async fetchAggregateMarketVolume(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryAggregateMarketVolumeRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryAggregateMarketVolumeRequest,
      InjectiveExchangeV2QueryPb.QueryAggregateMarketVolumeResponse
    >(request, this.client.aggregateMarketVolume.bind(this.client))

    return ChainGrpcExchangeTransformerV2.aggregateMarketVolumeResponseToAggregateMarketVolume(
      response,
    )
  }

  async fetchAggregateMarketVolumes(marketIds: string[]) {
    const request =
      InjectiveExchangeV2QueryPb.QueryAggregateMarketVolumesRequest.create()
    request.marketIds = marketIds

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryAggregateMarketVolumesRequest,
      InjectiveExchangeV2QueryPb.QueryAggregateMarketVolumesResponse
    >(request, this.client.aggregateMarketVolumes.bind(this.client))

    return ChainGrpcExchangeTransformerV2.aggregateMarketVolumesResponseToAggregateMarketVolumes(
      response,
    )
  }

  async fetchSpotMarket(marketId: string) {
    const request = InjectiveExchangeV2QueryPb.QuerySpotMarketRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySpotMarketRequest,
      InjectiveExchangeV2QueryPb.QuerySpotMarketResponse
    >(request, this.client.spotMarket.bind(this.client))

    return response.market
      ? ChainGrpcExchangeTransformerV2.grpcSpotMarketToSpotMarket(
          response.market,
        )
      : undefined
  }

  async fetchFullSpotMarket(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryFullSpotMarketRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryFullSpotMarketRequest,
      InjectiveExchangeV2QueryPb.QueryFullSpotMarketResponse
    >(request, this.client.fullSpotMarket.bind(this.client))

    return response.market
      ? ChainGrpcExchangeTransformerV2.grpcFullSpotMarketToSpotMarket(
          response.market,
        )
      : undefined
  }

  async fetchSpotOrderbook({
    marketId,
    limit,
    orderSide,
    limitCumulativeNotional,
    limitCumulativeQuantity,
  }: {
    marketId: string
    limit?: number
    orderSide?: InjectiveExchangeV2QueryPb.OrderSide
    limitCumulativeNotional?: string
    limitCumulativeQuantity?: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySpotOrderbookRequest.create()
    request.marketId = marketId
    if (limit) {
      request.limit = BigInt(limit)
    }
    if (orderSide) {
      request.orderSide = orderSide
    }
    if (limitCumulativeNotional) {
      request.limitCumulativeNotional = limitCumulativeNotional
    }
    if (limitCumulativeQuantity) {
      request.limitCumulativeQuantity = limitCumulativeQuantity
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySpotOrderbookRequest,
      InjectiveExchangeV2QueryPb.QuerySpotOrderbookResponse
    >(request, this.client.spotOrderbook.bind(this.client))

    return ChainGrpcExchangeTransformerV2.orderbookResponseToOrderbook(response)
  }

  async fetchTraderSpotOrders({
    marketId,
    subaccountId,
  }: {
    marketId: string
    subaccountId: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryTraderSpotOrdersRequest.create()
    request.marketId = marketId
    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryTraderSpotOrdersRequest,
      InjectiveExchangeV2QueryPb.QueryTraderSpotOrdersResponse
    >(request, this.client.traderSpotOrders.bind(this.client))

    return ChainGrpcExchangeTransformerV2.spotOrdersResponseToOrders(response)
  }

  async fetchAccountAddressSpotOrders({
    marketId,
    accountAddress,
  }: {
    marketId: string
    accountAddress: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryAccountAddressSpotOrdersRequest.create()
    request.marketId = marketId
    request.accountAddress = accountAddress

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryAccountAddressSpotOrdersRequest,
      InjectiveExchangeV2QueryPb.QueryAccountAddressSpotOrdersResponse
    >(request, this.client.accountAddressSpotOrders.bind(this.client))

    return ChainGrpcExchangeTransformerV2.spotOrdersResponseToOrders(response)
  }

  async fetchSpotOrdersByHashes({
    marketId,
    subaccountId,
    orderHashes,
  }: {
    marketId: string
    subaccountId: string
    orderHashes: string[]
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySpotOrdersByHashesRequest.create()
    request.marketId = marketId
    request.subaccountId = subaccountId
    request.orderHashes = orderHashes

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySpotOrdersByHashesRequest,
      InjectiveExchangeV2QueryPb.QuerySpotOrdersByHashesResponse
    >(request, this.client.spotOrdersByHashes.bind(this.client))

    return ChainGrpcExchangeTransformerV2.spotOrdersResponseToOrders(response)
  }

  async fetchSubaccountOrders({
    subaccountId,
    marketId,
  }: {
    subaccountId: string
    marketId: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySubaccountOrdersRequest.create()
    request.subaccountId = subaccountId
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySubaccountOrdersRequest,
      InjectiveExchangeV2QueryPb.QuerySubaccountOrdersResponse
    >(request, this.client.subaccountOrders.bind(this.client))

    return ChainGrpcExchangeTransformerV2.subaccountOrdersResponseToOrders(
      response,
    )
  }

  async fetchTraderSpotTransientOrders({
    marketId,
    subaccountId,
  }: {
    marketId: string
    subaccountId: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryTraderSpotOrdersRequest.create()
    request.marketId = marketId
    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryTraderSpotOrdersRequest,
      InjectiveExchangeV2QueryPb.QueryTraderSpotOrdersResponse
    >(request, this.client.traderSpotTransientOrders.bind(this.client))

    return ChainGrpcExchangeTransformerV2.spotOrdersResponseToOrders(response)
  }

  async fetchSpotMidPriceAndTOB(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySpotMidPriceAndTOBRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySpotMidPriceAndTOBRequest,
      InjectiveExchangeV2QueryPb.QuerySpotMidPriceAndTOBResponse
    >(request, this.client.spotMidPriceAndTOB.bind(this.client))

    return ChainGrpcExchangeTransformerV2.midPriceAndTobResponseToMidPriceAndTob(
      response,
    )
  }

  async fetchDerivativeMidPriceAndTOB(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryDerivativeMidPriceAndTOBRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryDerivativeMidPriceAndTOBRequest,
      InjectiveExchangeV2QueryPb.QueryDerivativeMidPriceAndTOBResponse
    >(request, this.client.derivativeMidPriceAndTOB.bind(this.client))

    return ChainGrpcExchangeTransformerV2.midPriceAndTobResponseToMidPriceAndTob(
      response,
    )
  }

  async fetchDerivativeOrderbook({
    marketId,
    limit,
    limitCumulativeNotional,
  }: {
    marketId: string
    limit?: number
    limitCumulativeNotional?: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryDerivativeOrderbookRequest.create()
    request.marketId = marketId
    if (limit) {
      request.limit = BigInt(limit)
    }
    if (limitCumulativeNotional) {
      request.limitCumulativeNotional = limitCumulativeNotional
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryDerivativeOrderbookRequest,
      InjectiveExchangeV2QueryPb.QueryDerivativeOrderbookResponse
    >(request, this.client.derivativeOrderbook.bind(this.client))

    return ChainGrpcExchangeTransformerV2.orderbookResponseToOrderbook(response)
  }

  async fetchTraderDerivativeOrders({
    marketId,
    subaccountId,
  }: {
    marketId: string
    subaccountId: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryTraderDerivativeOrdersRequest.create()
    request.marketId = marketId
    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryTraderDerivativeOrdersRequest,
      InjectiveExchangeV2QueryPb.QueryTraderDerivativeOrdersResponse
    >(request, this.client.traderDerivativeOrders.bind(this.client))

    return ChainGrpcExchangeTransformerV2.derivativeOrdersResponseToOrders(
      response,
    )
  }

  async fetchAccountAddressDerivativeOrders({
    marketId,
    accountAddress,
  }: {
    marketId: string
    accountAddress: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryAccountAddressDerivativeOrdersRequest.create()
    request.marketId = marketId
    request.accountAddress = accountAddress

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryAccountAddressDerivativeOrdersRequest,
      InjectiveExchangeV2QueryPb.QueryAccountAddressDerivativeOrdersResponse
    >(request, this.client.accountAddressDerivativeOrders.bind(this.client))

    return ChainGrpcExchangeTransformerV2.derivativeOrdersResponseToOrders(
      response,
    )
  }

  async fetchDerivativeOrdersByHashes({
    marketId,
    subaccountId,
    orderHashes,
  }: {
    marketId: string
    subaccountId: string
    orderHashes: string[]
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryDerivativeOrdersByHashesRequest.create()
    request.marketId = marketId
    request.subaccountId = subaccountId
    request.orderHashes = orderHashes

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryDerivativeOrdersByHashesRequest,
      InjectiveExchangeV2QueryPb.QueryDerivativeOrdersByHashesResponse
    >(request, this.client.derivativeOrdersByHashes.bind(this.client))

    return ChainGrpcExchangeTransformerV2.derivativeOrdersResponseToOrders(
      response,
    )
  }

  async fetchTraderDerivativeTransientOrders({
    marketId,
    subaccountId,
  }: {
    marketId: string
    subaccountId: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryTraderDerivativeOrdersRequest.create()
    request.marketId = marketId
    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryTraderDerivativeOrdersRequest,
      InjectiveExchangeV2QueryPb.QueryTraderDerivativeOrdersResponse
    >(request, this.client.traderDerivativeTransientOrders.bind(this.client))

    return ChainGrpcExchangeTransformerV2.derivativeOrdersResponseToOrders(
      response,
    )
  }

  async fetchDerivativeMarket(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryDerivativeMarketRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryDerivativeMarketRequest,
      InjectiveExchangeV2QueryPb.QueryDerivativeMarketResponse
    >(request, this.client.derivativeMarket.bind(this.client))

    return response.market
      ? ChainGrpcExchangeTransformerV2.grpcFullDerivativeMarketToDerivativeMarket(
          response.market,
        )
      : undefined
  }

  async fetchDerivativeMarketAddress(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryDerivativeMarketAddressRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryDerivativeMarketAddressRequest,
      InjectiveExchangeV2QueryPb.QueryDerivativeMarketAddressResponse
    >(request, this.client.derivativeMarketAddress.bind(this.client))

    return ChainGrpcExchangeTransformerV2.derivativeMarketAddressResponseToDerivativeMarketAddress(
      response,
    )
  }

  async fetchSubaccountRiskProfile(subaccountId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySubaccountRiskProfileRequest.create()
    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySubaccountRiskProfileRequest,
      InjectiveExchangeV2QueryPb.QuerySubaccountRiskProfileResponse
    >(request, this.client.subaccountRiskProfile.bind(this.client))

    return ChainGrpcExchangeTransformerV2.subaccountRiskProfileResponseToSubaccountRiskProfile(
      response,
    )
  }

  async fetchCrossMarginPoolSnapshot({
    subaccountId,
    quoteDenom,
  }: {
    subaccountId: string
    quoteDenom: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryCrossMarginPoolSnapshotRequest.create()
    request.subaccountId = subaccountId
    request.quoteDenom = quoteDenom

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryCrossMarginPoolSnapshotRequest,
      InjectiveExchangeV2QueryPb.QueryCrossMarginPoolSnapshotResponse
    >(request, this.client.crossMarginPoolSnapshot.bind(this.client))

    return ChainGrpcExchangeTransformerV2.crossMarginPoolSnapshotResponseToCrossMarginPoolSnapshot(
      response,
    )
  }

  async fetchPositionsInMarket(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryPositionsInMarketRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryPositionsInMarketRequest,
      InjectiveExchangeV2QueryPb.QueryPositionsInMarketResponse
    >(request, this.client.positionsInMarket.bind(this.client))

    return ChainGrpcExchangeTransformerV2.positionsResponseToPositions(response)
  }

  async fetchSubaccountPositions(subaccountId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySubaccountPositionsRequest.create()
    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySubaccountPositionsRequest,
      InjectiveExchangeV2QueryPb.QuerySubaccountPositionsResponse
    >(request, this.client.subaccountPositions.bind(this.client))

    return ChainGrpcExchangeTransformerV2.positionsResponseToPositions(response)
  }

  async fetchSubaccountPositionInMarket({
    subaccountId,
    marketId,
  }: {
    subaccountId: string
    marketId: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySubaccountPositionInMarketRequest.create()
    request.subaccountId = subaccountId
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySubaccountPositionInMarketRequest,
      InjectiveExchangeV2QueryPb.QuerySubaccountPositionInMarketResponse
    >(request, this.client.subaccountPositionInMarket.bind(this.client))

    return ChainGrpcExchangeTransformerV2.positionInMarketResponseToPositionInMarket(
      response,
    )
  }

  async fetchSubaccountEffectivePositionInMarket({
    subaccountId,
    marketId,
  }: {
    subaccountId: string
    marketId: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySubaccountEffectivePositionInMarketRequest.create()
    request.subaccountId = subaccountId
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySubaccountEffectivePositionInMarketRequest,
      InjectiveExchangeV2QueryPb.QuerySubaccountEffectivePositionInMarketResponse
    >(
      request,
      this.client.subaccountEffectivePositionInMarket.bind(this.client),
    )

    return ChainGrpcExchangeTransformerV2.effectivePositionResponseToEffectivePosition(
      response,
    )
  }

  async fetchPerpetualMarketInfo(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryPerpetualMarketInfoRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryPerpetualMarketInfoRequest,
      InjectiveExchangeV2QueryPb.QueryPerpetualMarketInfoResponse
    >(request, this.client.perpetualMarketInfo.bind(this.client))

    return ChainGrpcExchangeTransformerV2.perpetualMarketInfoResponseToPerpetualMarketInfo(
      response,
    )
  }

  async fetchExpiryFuturesMarketInfo(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryExpiryFuturesMarketInfoRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryExpiryFuturesMarketInfoRequest,
      InjectiveExchangeV2QueryPb.QueryExpiryFuturesMarketInfoResponse
    >(request, this.client.expiryFuturesMarketInfo.bind(this.client))

    return ChainGrpcExchangeTransformerV2.expiryFuturesMarketInfoResponseToExpiryFuturesMarketInfo(
      response,
    )
  }

  async fetchPerpetualMarketFunding(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryPerpetualMarketFundingRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryPerpetualMarketFundingRequest,
      InjectiveExchangeV2QueryPb.QueryPerpetualMarketFundingResponse
    >(request, this.client.perpetualMarketFunding.bind(this.client))

    return ChainGrpcExchangeTransformerV2.perpetualMarketFundingResponseToPerpetualMarketFunding(
      response,
    )
  }

  async fetchSubaccountOrderMetadata(subaccountId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QuerySubaccountOrderMetadataRequest.create()
    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QuerySubaccountOrderMetadataRequest,
      InjectiveExchangeV2QueryPb.QuerySubaccountOrderMetadataResponse
    >(request, this.client.subaccountOrderMetadata.bind(this.client))

    return ChainGrpcExchangeTransformerV2.subaccountOrderMetadataResponseToSubaccountOrderMetadata(
      response,
    )
  }

  async fetchFeeDiscountTierStatistics() {
    const request =
      InjectiveExchangeV2QueryPb.QueryFeeDiscountTierStatisticsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryFeeDiscountTierStatisticsRequest,
      InjectiveExchangeV2QueryPb.QueryFeeDiscountTierStatisticsResponse
    >(request, this.client.feeDiscountTierStatistics.bind(this.client))

    return ChainGrpcExchangeTransformerV2.feeDiscountTierStatisticsResponseToFeeDiscountTierStatistics(
      response,
    )
  }

  async fetchMarketIdFromVault(vaultAddress: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryMarketIDFromVaultRequest.create()
    request.vaultAddress = vaultAddress

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryMarketIDFromVaultRequest,
      InjectiveExchangeV2QueryPb.QueryMarketIDFromVaultResponse
    >(request, this.client.queryMarketIDFromVault.bind(this.client))

    return { marketId: response.marketId }
  }

  async fetchHistoricalTradeRecords(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryHistoricalTradeRecordsRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryHistoricalTradeRecordsRequest,
      InjectiveExchangeV2QueryPb.QueryHistoricalTradeRecordsResponse
    >(request, this.client.historicalTradeRecords.bind(this.client))

    return ChainGrpcExchangeTransformerV2.historicalTradeRecordsResponseToHistoricalTradeRecords(
      response,
    )
  }

  async fetchOptedOutOfRewardsAccounts() {
    const request =
      InjectiveExchangeV2QueryPb.QueryOptedOutOfRewardsAccountsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryOptedOutOfRewardsAccountsRequest,
      InjectiveExchangeV2QueryPb.QueryOptedOutOfRewardsAccountsResponse
    >(request, this.client.optedOutOfRewardsAccounts.bind(this.client))

    return { accounts: response.accounts }
  }

  async fetchMarketVolatility({
    marketId,
    tradeHistoryOptions,
  }: {
    marketId: string
    tradeHistoryOptions?: InjectiveExchangeV2QueryPb.TradeHistoryOptions
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryMarketVolatilityRequest.create()
    request.marketId = marketId
    if (tradeHistoryOptions) {
      request.tradeHistoryOptions = tradeHistoryOptions
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryMarketVolatilityRequest,
      InjectiveExchangeV2QueryPb.QueryMarketVolatilityResponse
    >(request, this.client.marketVolatility.bind(this.client))

    return ChainGrpcExchangeTransformerV2.marketVolatilityResponseToMarketVolatility(
      response,
    )
  }

  async fetchBinaryOptionsMarkets(status?: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryBinaryMarketsRequest.create()
    if (status) {
      request.status = status
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryBinaryMarketsRequest,
      InjectiveExchangeV2QueryPb.QueryBinaryMarketsResponse
    >(request, this.client.binaryOptionsMarkets.bind(this.client))

    return ChainGrpcExchangeTransformerV2.binaryOptionsMarketsResponseToBinaryOptionsMarkets(
      response,
    )
  }

  async fetchTraderDerivativeConditionalOrders({
    subaccountId,
    marketId,
  }: {
    subaccountId: string
    marketId: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryTraderDerivativeConditionalOrdersRequest.create()
    request.subaccountId = subaccountId
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryTraderDerivativeConditionalOrdersRequest,
      InjectiveExchangeV2QueryPb.QueryTraderDerivativeConditionalOrdersResponse
    >(request, this.client.traderDerivativeConditionalOrders.bind(this.client))

    return ChainGrpcExchangeTransformerV2.derivativeConditionalOrdersResponseToDerivativeConditionalOrders(
      response,
    )
  }

  async fetchMarketAtomicExecutionFeeMultiplier(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryMarketAtomicExecutionFeeMultiplierRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryMarketAtomicExecutionFeeMultiplierRequest,
      InjectiveExchangeV2QueryPb.QueryMarketAtomicExecutionFeeMultiplierResponse
    >(request, this.client.marketAtomicExecutionFeeMultiplier.bind(this.client))

    return { multiplier: response.multiplier }
  }

  async fetchGrantAuthorization({
    granter,
    grantee,
  }: {
    granter: string
    grantee: string
  }) {
    const request =
      InjectiveExchangeV2QueryPb.QueryGrantAuthorizationRequest.create()
    request.granter = granter
    request.grantee = grantee

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryGrantAuthorizationRequest,
      InjectiveExchangeV2QueryPb.QueryGrantAuthorizationResponse
    >(request, this.client.grantAuthorization.bind(this.client))

    return { amount: response.amount }
  }

  async fetchGrantAuthorizations(granter: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryGrantAuthorizationsRequest.create()
    request.granter = granter

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryGrantAuthorizationsRequest,
      InjectiveExchangeV2QueryPb.QueryGrantAuthorizationsResponse
    >(request, this.client.grantAuthorizations.bind(this.client))

    return ChainGrpcExchangeTransformerV2.grantAuthorizationsResponseToGrantAuthorizations(
      response,
    )
  }

  async fetchMarketBalance(marketId: string) {
    const request =
      InjectiveExchangeV2QueryPb.QueryMarketBalanceRequest.create()
    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV2QueryPb.QueryMarketBalanceRequest,
      InjectiveExchangeV2QueryPb.QueryMarketBalanceResponse
    >(request, this.client.marketBalance.bind(this.client))

    return ChainGrpcExchangeTransformerV2.marketBalanceResponseToMarketBalance(
      response,
    )
  }
}
