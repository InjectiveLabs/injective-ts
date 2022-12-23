import { Query as ExchangeQuery } from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb_service'
import {
  QueryExchangeParamsRequest,
  QueryFeeDiscountScheduleRequest,
  QueryTradeRewardCampaignRequest,
  QuerySubaccountTradeNonceRequest,
  QuerySubaccountTradeNonceResponse,
  QueryFeeDiscountAccountInfoRequest,
  QueryTradeRewardPointsRequest,
  QueryModuleStateRequest,
  QueryModuleStateResponse,
  QueryPositionsRequest,
  QueryPositionsResponse,
  QueryTradeRewardPointsResponse,
  QueryFeeDiscountAccountInfoResponse,
  QueryTradeRewardCampaignResponse,
  QueryFeeDiscountScheduleResponse,
  QueryExchangeParamsResponse,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainGrpcExchangeTransformer } from '../transformers'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcExchangeApi extends BaseConsumer {
  protected module: string = ChainModule.Exchange

  async fetchModuleParams() {
    const request = new QueryExchangeParamsRequest()

    try {
      const response = await this.request<
        QueryExchangeParamsRequest,
        QueryExchangeParamsResponse,
        typeof ExchangeQuery.QueryExchangeParams
      >(request, ExchangeQuery.QueryExchangeParams)

      return ChainGrpcExchangeTransformer.moduleParamsResponseToParams(response)
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchModuleState() {
    const request = new QueryModuleStateRequest()

    try {
      const response = await this.request<
        QueryModuleStateRequest,
        QueryModuleStateResponse,
        typeof ExchangeQuery.ExchangeModuleState
      >(request, ExchangeQuery.ExchangeModuleState)

      return response.getState()!.toObject() /* TODO */
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchFeeDiscountSchedule() {
    const request = new QueryFeeDiscountScheduleRequest()

    try {
      const response = await this.request<
        QueryFeeDiscountScheduleRequest,
        QueryFeeDiscountScheduleResponse,
        typeof ExchangeQuery.FeeDiscountSchedule
      >(request, ExchangeQuery.FeeDiscountSchedule)

      return ChainGrpcExchangeTransformer.feeDiscountScheduleResponseToFeeDiscountSchedule(
        response,
      )
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchFeeDiscountAccountInfo(injectiveAddress: string) {
    const request = new QueryFeeDiscountAccountInfoRequest()
    request.setAccount(injectiveAddress)

    try {
      const response = await this.request<
        QueryFeeDiscountAccountInfoRequest,
        QueryFeeDiscountAccountInfoResponse,
        typeof ExchangeQuery.FeeDiscountAccountInfo
      >(request, ExchangeQuery.FeeDiscountAccountInfo)

      return ChainGrpcExchangeTransformer.feeDiscountAccountInfoResponseToFeeDiscountAccountInfo(
        response,
      )
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchTradingRewardsCampaign() {
    const request = new QueryTradeRewardCampaignRequest()

    try {
      const response = await this.request<
        QueryTradeRewardCampaignRequest,
        QueryTradeRewardCampaignResponse,
        typeof ExchangeQuery.TradeRewardCampaign
      >(request, ExchangeQuery.TradeRewardCampaign)

      return ChainGrpcExchangeTransformer.tradingRewardsCampaignResponseToTradingRewardsCampaign(
        response,
      )
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchTradeRewardPoints(injectiveAddresses: string[]) {
    const request = new QueryTradeRewardPointsRequest()
    request.setAccountsList(injectiveAddresses)

    try {
      const response = await this.request<
        QueryTradeRewardPointsRequest,
        QueryTradeRewardPointsResponse,
        typeof ExchangeQuery.TradeRewardPoints
      >(request, ExchangeQuery.TradeRewardPoints)

      return response.getAccountTradeRewardPointsList()
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
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
        typeof ExchangeQuery.PendingTradeRewardPoints
      >(request, ExchangeQuery.PendingTradeRewardPoints)

      return response.getAccountTradeRewardPointsList()
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchPositions() {
    const request = new QueryPositionsRequest()

    try {
      const response = await this.request<
        QueryPositionsRequest,
        QueryPositionsResponse,
        typeof ExchangeQuery.Positions
      >(request, ExchangeQuery.Positions)

      return ChainGrpcExchangeTransformer.positionsResponseToPositions(response)
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchSubaccountTradeNonce(subaccountId: string) {
    const request = new QuerySubaccountTradeNonceRequest()

    request.setSubaccountId(subaccountId)

    try {
      const response = await this.request<
        QuerySubaccountTradeNonceRequest,
        QuerySubaccountTradeNonceResponse,
        typeof ExchangeQuery.SubaccountTradeNonce
      >(request, ExchangeQuery.SubaccountTradeNonce)

      return response.toObject()
    } catch (e: any) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
    }
  }
}
