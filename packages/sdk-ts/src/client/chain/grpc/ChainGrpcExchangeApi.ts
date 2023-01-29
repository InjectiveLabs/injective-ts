import {
  QueryClientImpl,
  QueryExchangeParamsRequest,
  QueryFeeDiscountScheduleRequest,
  QueryTradeRewardCampaignRequest,
  QuerySubaccountTradeNonceRequest,
  QueryFeeDiscountAccountInfoRequest,
  QueryTradeRewardPointsRequest,
  QueryModuleStateRequest,
  QueryPositionsRequest,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/query'
import { ChainGrpcExchangeTransformer } from '../transformers'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getRpcInterface } from '../../BaseGrpcConsumer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcExchangeApi {
  protected module: string = ChainModule.Exchange

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryExchangeParamsRequest.create()

    try {
      const response = await this.query.QueryExchangeParams(request)

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
    const request = QueryModuleStateRequest.create()

    try {
      const response = await this.query.ExchangeModuleState(request)

      return response.state!
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
    const request = QueryFeeDiscountScheduleRequest.create()

    try {
      const response = await this.query.FeeDiscountSchedule(request)

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
    const request = QueryFeeDiscountAccountInfoRequest.create()

    request.account = injectiveAddress

    try {
      const response = await this.query.FeeDiscountAccountInfo(request)

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
    const request = QueryTradeRewardCampaignRequest.create()

    try {
      const response = await this.query.TradeRewardCampaign(request)

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
    const request = QueryTradeRewardPointsRequest.create()

    request.accounts = injectiveAddresses

    try {
      const response = await this.query.TradeRewardPoints(request)

      return response.accountTradeRewardPoints
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
    const request = QueryTradeRewardPointsRequest.create()

    request.accounts = injectiveAddresses

    if (timestamp) {
      request.pendingPoolTimestamp = timestamp.toString()
    }

    try {
      const response = await this.query.PendingTradeRewardPoints(request)

      return response.accountTradeRewardPoints
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
    const request = QueryPositionsRequest.create()

    try {
      const response = await this.query.Positions(request)

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
    const request = QuerySubaccountTradeNonceRequest.create()

    request.subaccountId = subaccountId

    try {
      const response = await this.query.SubaccountTradeNonce(request)

      return response
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
