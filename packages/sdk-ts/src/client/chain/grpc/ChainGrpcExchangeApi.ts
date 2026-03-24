import * as InjectiveExchangeV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/query_pb'
import { QueryClient as InjectiveExchangeV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcExchangeTransformer } from '../transformers/index.js'
import type * as InjectiveExchangeV1Beta1GenesisPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/genesis_pb'
import type * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb'
import type { GrpcCallOptions } from '../../../types/index.js'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcExchangeApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Exchange

  private get client() {
    return this.initClient(InjectiveExchangeV1Beta1QueryClient)
  }

  async fetchModuleParams(options?: GrpcCallOptions) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryExchangeParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryExchangeParamsRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryExchangeParamsResponse
    >(
      request,
      this.client.queryExchangeParams.bind(this.client),
      options?.signal,
    )

    return ChainGrpcExchangeTransformer.moduleParamsResponseToParams(response)
  }

  async fetchModuleState(
    options?: GrpcCallOptions,
  ): Promise<InjectiveExchangeV1Beta1GenesisPb.GenesisState> {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryModuleStateRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryModuleStateRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryModuleStateResponse
    >(
      request,
      this.client.exchangeModuleState.bind(this.client),
      options?.signal,
    )

    return response.state!
  }

  async fetchFeeDiscountSchedule(options?: GrpcCallOptions) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountScheduleRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountScheduleRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountScheduleResponse
    >(
      request,
      this.client.feeDiscountSchedule.bind(this.client),
      options?.signal,
    )

    return ChainGrpcExchangeTransformer.feeDiscountScheduleResponseToFeeDiscountSchedule(
      response,
    )
  }

  async fetchFeeDiscountAccountInfo(
    injectiveAddress: string,
    options?: GrpcCallOptions,
  ) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountAccountInfoRequest.create()

    request.account = injectiveAddress

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountAccountInfoRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryFeeDiscountAccountInfoResponse
    >(
      request,
      this.client.feeDiscountAccountInfo.bind(this.client),
      options?.signal,
    )

    return ChainGrpcExchangeTransformer.feeDiscountAccountInfoResponseToFeeDiscountAccountInfo(
      response,
    )
  }

  async fetchTradingRewardsCampaign(options?: GrpcCallOptions) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardCampaignRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardCampaignRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardCampaignResponse
    >(
      request,
      this.client.tradeRewardCampaign.bind(this.client),
      options?.signal,
    )

    return ChainGrpcExchangeTransformer.tradingRewardsCampaignResponseToTradingRewardsCampaign(
      response,
    )
  }

  async fetchTradeRewardPoints(
    injectiveAddresses: string[],
    options?: GrpcCallOptions,
  ) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardPointsRequest.create()

    request.accounts = injectiveAddresses

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardPointsRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardPointsResponse
    >(request, this.client.tradeRewardPoints.bind(this.client), options?.signal)

    return response.accountTradeRewardPoints
  }

  async fetchPendingTradeRewardPoints(
    injectiveAddresses: string[],
    timestamp?: number,
    options?: GrpcCallOptions,
  ) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardPointsRequest.create()

    request.accounts = injectiveAddresses

    if (timestamp) {
      request.pendingPoolTimestamp = BigInt(timestamp)
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardPointsRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryTradeRewardPointsResponse
    >(
      request,
      this.client.pendingTradeRewardPoints.bind(this.client),
      options?.signal,
    )

    return response.accountTradeRewardPoints
  }

  async fetchPositions(options?: GrpcCallOptions) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryPositionsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryPositionsRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryPositionsResponse
    >(request, this.client.positions.bind(this.client), options?.signal)

    return ChainGrpcExchangeTransformer.positionsResponseToPositions(response)
  }

  async fetchSubaccountTradeNonce(
    subaccountId: string,
    options?: GrpcCallOptions,
  ) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QuerySubaccountTradeNonceRequest.create()

    request.subaccountId = subaccountId

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QuerySubaccountTradeNonceRequest,
      InjectiveExchangeV1Beta1QueryPb.QuerySubaccountTradeNonceResponse
    >(
      request,
      this.client.subaccountTradeNonce.bind(this.client),
      options?.signal,
    )

    return response
  }

  async fetchIsOptedOutOfRewards(account: string, options?: GrpcCallOptions) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryIsOptedOutOfRewardsRequest.create()

    request.account = account

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryIsOptedOutOfRewardsRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryIsOptedOutOfRewardsResponse
    >(
      request,
      this.client.isOptedOutOfRewards.bind(this.client),
      options?.signal,
    )

    return ChainGrpcExchangeTransformer.isOptedOutOfRewardsResponseToIsOptedOutOfRewards(
      response,
    )
  }

  async fetchActiveStakeGrant(
    account: string,
    options?: GrpcCallOptions,
  ): Promise<{
    grant: InjectiveExchangeV1Beta1ExchangePb.ActiveGrant
    effectiveGrant: InjectiveExchangeV1Beta1ExchangePb.EffectiveGrant
  }> {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryActiveStakeGrantRequest.create()

    request.grantee = account

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryActiveStakeGrantRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryActiveStakeGrantResponse
    >(request, this.client.activeStakeGrant.bind(this.client), options?.signal)

    return ChainGrpcExchangeTransformer.activeStakeGrantResponseToActiveStakeGrant(
      response,
    )
  }

  async fetchDenomDecimal(denom: string, options?: GrpcCallOptions) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryDenomDecimalRequest.create()

    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryDenomDecimalRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryDenomDecimalResponse
    >(request, this.client.denomDecimal.bind(this.client), options?.signal)

    return response.decimal
  }

  async fetchDenomDecimals(options?: GrpcCallOptions) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryDenomDecimalsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryDenomDecimalsRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryDenomDecimalsResponse
    >(request, this.client.denomDecimals.bind(this.client), options?.signal)

    return ChainGrpcExchangeTransformer.denomDecimalsResponseToDenomDecimals(
      response,
    )
  }

  async fetchDenomMinNotional(denom: string, options?: GrpcCallOptions) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryDenomMinNotionalRequest.create()

    request.denom = denom

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryDenomMinNotionalRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryDenomMinNotionalResponse
    >(request, this.client.denomMinNotional.bind(this.client), options?.signal)

    return response.amount
  }

  async fetchDenomMinNotionals(options?: GrpcCallOptions) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryDenomMinNotionalsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryDenomMinNotionalsRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryDenomMinNotionalsResponse
    >(request, this.client.denomMinNotionals.bind(this.client), options?.signal)

    return ChainGrpcExchangeTransformer.denomMinNotionalsResponseToDenomMinNotionals(
      response,
    )
  }

  async fetchDerivativeMarkets(
    status?: string,
    marketIds?: string[],
    options?: GrpcCallOptions,
  ) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryDerivativeMarketsRequest.create()

    if (status) {
      request.status = status
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryDerivativeMarketsRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryDerivativeMarketsResponse
    >(request, this.client.derivativeMarkets.bind(this.client), options?.signal)

    return ChainGrpcExchangeTransformer.fullDerivativeMarketsResponseToDerivativeMarkets(
      response,
    )
  }

  async fetchSpotMarkets(
    status?: string,
    marketIds?: string[],
    options?: GrpcCallOptions,
  ) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QuerySpotMarketsRequest.create()

    if (status) {
      request.status = status
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QuerySpotMarketsRequest,
      InjectiveExchangeV1Beta1QueryPb.QuerySpotMarketsResponse
    >(request, this.client.spotMarkets.bind(this.client), options?.signal)

    return ChainGrpcExchangeTransformer.spotMarketsResponseToSpotMarkets(
      response,
    )
  }

  async fetchFullSpotMarkets(
    status?: string,
    marketIds?: string[],
    options?: GrpcCallOptions,
  ) {
    const request =
      InjectiveExchangeV1Beta1QueryPb.QueryFullSpotMarketsRequest.create()

    if (status) {
      request.status = status
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeV1Beta1QueryPb.QueryFullSpotMarketsRequest,
      InjectiveExchangeV1Beta1QueryPb.QueryFullSpotMarketsResponse
    >(request, this.client.fullSpotMarkets.bind(this.client), options?.signal)

    return ChainGrpcExchangeTransformer.fullSpotMarketsResponseToSpotMarkets(
      response,
    )
  }
}
