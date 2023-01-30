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
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { GrpcWebError } from '@injectivelabs/core-proto-ts/tendermint/abci/types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcExchangeApi {
  protected module: string = ChainModule.Exchange

  protected client: QueryClientImpl

  constructor(endpoint: string) {
    this.client = new QueryClientImpl(getGrpcWebImpl(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryExchangeParamsRequest.create()

    try {
      const response = await this.client.QueryExchangeParams(request)

      return ChainGrpcExchangeTransformer.moduleParamsResponseToParams(response)
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.ExchangeModuleState(request)

      return response.state!
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.FeeDiscountSchedule(request)

      return ChainGrpcExchangeTransformer.feeDiscountScheduleResponseToFeeDiscountSchedule(
        response,
      )
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.FeeDiscountAccountInfo(request)

      return ChainGrpcExchangeTransformer.feeDiscountAccountInfoResponseToFeeDiscountAccountInfo(
        response,
      )
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.TradeRewardCampaign(request)

      return ChainGrpcExchangeTransformer.tradingRewardsCampaignResponseToTradingRewardsCampaign(
        response,
      )
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.TradeRewardPoints(request)

      return response.accountTradeRewardPoints
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.PendingTradeRewardPoints(request)

      return response.accountTradeRewardPoints
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.Positions(request)

      return ChainGrpcExchangeTransformer.positionsResponseToPositions(response)
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
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
      const response = await this.client.SubaccountTradeNonce(request)

      return response
    } catch (e: any) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: ChainModule.Exchange,
      })
    }
  }
}
