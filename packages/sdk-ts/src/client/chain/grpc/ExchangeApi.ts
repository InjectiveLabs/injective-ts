import { Query as ExchangeQuery } from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb_service'
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
import BaseConsumer from '../../BaseGrpcConsumer'

/**
 * The Chain Consumer Client is used to
 * consume data from the Chain Directly
 */
export class ExchangeApi extends BaseConsumer {
  async moduleParams() {
    const request = new QueryExchangeParamsRequest()

    try {
      const response = await this.request<
        QueryExchangeParamsRequest,
        QueryExchangeParamsResponse,
        typeof ExchangeQuery.QueryExchangeParams
      >(request, ExchangeQuery.QueryExchangeParams)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async feeDiscountSchedule() {
    const request = new QueryFeeDiscountScheduleRequest()

    try {
      const response = await this.request<
        QueryFeeDiscountScheduleRequest,
        QueryFeeDiscountScheduleResponse,
        typeof ExchangeQuery.FeeDiscountSchedule
      >(request, ExchangeQuery.FeeDiscountSchedule)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async feeDiscountAccountInfo(injectiveAddress: string) {
    const request = new QueryFeeDiscountAccountInfoRequest()
    request.setAccount(injectiveAddress)

    try {
      const response = await this.request<
        QueryFeeDiscountAccountInfoRequest,
        QueryFeeDiscountAccountInfoResponse,
        typeof ExchangeQuery.FeeDiscountAccountInfo
      >(request, ExchangeQuery.FeeDiscountAccountInfo)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async tradingRewardsCampaign() {
    const request = new QueryTradeRewardCampaignRequest()

    try {
      const response = await this.request<
        QueryTradeRewardCampaignRequest,
        QueryTradeRewardCampaignResponse,
        typeof ExchangeQuery.TradeRewardCampaign
      >(request, ExchangeQuery.TradeRewardCampaign)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async tradeRewardPoints(injectiveAddresses: string[]) {
    const request = new QueryTradeRewardPointsRequest()
    request.setAccountsList(injectiveAddresses)

    try {
      const response = await this.request<
        QueryTradeRewardPointsRequest,
        QueryTradeRewardPointsResponse,
        typeof ExchangeQuery.TradeRewardPoints
      >(request, ExchangeQuery.TradeRewardPoints)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async pendingTradeRewardPoints(
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
        typeof ExchangeQuery.PendingTradeRewardPoints
      >(request, ExchangeQuery.PendingTradeRewardPoints)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
