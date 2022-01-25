import { Query } from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb_service'
import {
  QueryExchangeParamsRequest,
  QueryFeeDiscountScheduleRequest,
  QueryTradeRewardCampaignRequest,
  QueryFeeDiscountAccountInfoRequest,
  QueryTradeRewardPointsRequest,
  QueryTradeRewardPointsResponse,
  QueryFeeDiscountAccountInfoResponse,
  QueryTradeRewardCampaignResponse,
  QueryFeeDiscountScheduleResponse,
  QueryExchangeParamsResponse,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb'
import { GrpcException } from '@injectivelabs/exceptions'
import { GrpcExchangeParams } from '../types'
import BaseConsumer from '../BaseConsumer'

export class ExchangeConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryExchangeParamsRequest()

    try {
      const response = await this.request<
        QueryExchangeParamsRequest,
        QueryExchangeParamsResponse,
        typeof Query.QueryExchangeParams
      >(request, Query.QueryExchangeParams)

      return response.getParams() as GrpcExchangeParams
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchFeeDiscountSchedule() {
    const request = new QueryFeeDiscountScheduleRequest()

    try {
      const response = await this.request<
        QueryFeeDiscountScheduleRequest,
        QueryFeeDiscountScheduleResponse,
        typeof Query.FeeDiscountSchedule
      >(request, Query.FeeDiscountSchedule)

      return response.getFeeDiscountSchedule()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchFeeDiscountAccountInfo(injectiveAddress: string) {
    const request = new QueryFeeDiscountAccountInfoRequest()
    request.setAccount(injectiveAddress)

    try {
      const response = await this.request<
        QueryFeeDiscountAccountInfoRequest,
        QueryFeeDiscountAccountInfoResponse,
        typeof Query.FeeDiscountAccountInfo
      >(request, Query.FeeDiscountAccountInfo)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchTradingRewardsCampaign() {
    const request = new QueryTradeRewardCampaignRequest()

    try {
      const response = await this.request<
        QueryTradeRewardCampaignRequest,
        QueryTradeRewardCampaignResponse,
        typeof Query.TradeRewardCampaign
      >(request, Query.TradeRewardCampaign)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchTradeRewardPoints(injectiveAddresses: string[]) {
    const request = new QueryTradeRewardPointsRequest()
    request.setAccountsList(injectiveAddresses)

    try {
      const response = await this.request<
        QueryTradeRewardPointsRequest,
        QueryTradeRewardPointsResponse,
        typeof Query.TradeRewardPoints
      >(request, Query.TradeRewardPoints)

      return response.getAccountTradeRewardPointsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchPendingTradeRewardPoints(
    injectiveAddresses: string[],
    timestamp?: number,
  ) {
    const request = new QueryTradeRewardPointsRequest()
    request.setAccountsList(injectiveAddresses)

    if (timestamp) {
      request.setPendingPoolTimestamp(timestamp)
    }

    try {
      const response = await this.request<
        QueryTradeRewardPointsRequest,
        QueryTradeRewardPointsResponse,
        typeof Query.PendingTradeRewardPoints
      >(request, Query.PendingTradeRewardPoints)

      return response.getAccountTradeRewardPointsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
