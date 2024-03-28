import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectiveExchangeV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'
import { ChainModule } from '../types'
import { ChainGrpcExchangeTransformer } from '../transformers'

InjectiveExchangeV1Beta1Query

/**
 * @category Chain Grpc API
 */
export class ChainGrpcExchangeApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Exchange

  protected client: InjectiveExchangeV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveExchangeV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request =
      InjectiveExchangeV1Beta1Query.QueryExchangeParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QueryExchangeParamsResponse>(
          () => this.client.QueryExchangeParams(request, this.metadata),
        )

      return ChainGrpcExchangeTransformer.moduleParamsResponseToParams(response)
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'QueryExchangeParams',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'QueryExchangeParams',
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchModuleState() {
    const request =
      InjectiveExchangeV1Beta1Query.QueryModuleStateRequest.create()

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QueryModuleStateResponse>(
          () => this.client.ExchangeModuleState(request, this.metadata),
        )

      return response.state!
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'ExchangeModuleState',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'ExchangeModuleState',
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchFeeDiscountSchedule() {
    const request =
      InjectiveExchangeV1Beta1Query.QueryFeeDiscountScheduleRequest.create()

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QueryFeeDiscountScheduleResponse>(
          () => this.client.FeeDiscountSchedule(request, this.metadata),
        )

      return ChainGrpcExchangeTransformer.feeDiscountScheduleResponseToFeeDiscountSchedule(
        response,
      )
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'FeeDiscountSchedule',

          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FeeDiscountSchedule',
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchFeeDiscountAccountInfo(injectiveAddress: string) {
    const request =
      InjectiveExchangeV1Beta1Query.QueryFeeDiscountAccountInfoRequest.create()

    request.account = injectiveAddress

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QueryFeeDiscountAccountInfoResponse>(
          () => this.client.FeeDiscountAccountInfo(request, this.metadata),
        )

      return ChainGrpcExchangeTransformer.feeDiscountAccountInfoResponseToFeeDiscountAccountInfo(
        response,
      )
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'FeeDiscountAccountInfo',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'FeeDiscountAccountInfo',
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchTradingRewardsCampaign() {
    const request =
      InjectiveExchangeV1Beta1Query.QueryTradeRewardCampaignRequest.create()

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QueryTradeRewardCampaignResponse>(
          () => this.client.TradeRewardCampaign(request, this.metadata),
        )

      return ChainGrpcExchangeTransformer.tradingRewardsCampaignResponseToTradingRewardsCampaign(
        response,
      )
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TradeRewardCampaign',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TradeRewardCampaign',
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchTradeRewardPoints(injectiveAddresses: string[]) {
    const request =
      InjectiveExchangeV1Beta1Query.QueryTradeRewardPointsRequest.create()

    request.accounts = injectiveAddresses

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QueryTradeRewardPointsResponse>(
          () => this.client.TradeRewardPoints(request, this.metadata),
        )

      return response.accountTradeRewardPoints
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'TradeRewardPoints',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TradeRewardPoints',
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchPendingTradeRewardPoints(
    injectiveAddresses: string[],
    timestamp?: number,
  ) {
    const request =
      InjectiveExchangeV1Beta1Query.QueryTradeRewardPointsRequest.create()

    request.accounts = injectiveAddresses

    if (timestamp) {
      request.pendingPoolTimestamp = timestamp.toString()
    }

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QueryTradeRewardPointsResponse>(
          () => this.client.PendingTradeRewardPoints(request, this.metadata),
        )

      return response.accountTradeRewardPoints
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'PendingTradeRewardPoints',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'PendingTradeRewardPoints',
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchPositions() {
    const request = InjectiveExchangeV1Beta1Query.QueryPositionsRequest.create()

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QueryPositionsResponse>(
          () => this.client.Positions(request, this.metadata),
        )

      return ChainGrpcExchangeTransformer.positionsResponseToPositions(response)
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Positions',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Positions',
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchSubaccountTradeNonce(subaccountId: string) {
    const request =
      InjectiveExchangeV1Beta1Query.QuerySubaccountTradeNonceRequest.create()

    request.subaccountId = subaccountId

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QuerySubaccountTradeNonceResponse>(
          () => this.client.SubaccountTradeNonce(request, this.metadata),
        )

      return response
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'SubaccountTradeNonce',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SubaccountTradeNonce',
        contextModule: ChainModule.Exchange,
      })
    }
  }

  async fetchIsOptedOutOfRewards(account: string) {
    const request =
      InjectiveExchangeV1Beta1Query.QueryIsOptedOutOfRewardsRequest.create()

    request.account = account

    try {
      const response =
        await this.retry<InjectiveExchangeV1Beta1Query.QueryIsOptedOutOfRewardsResponse>(
          () => this.client.IsOptedOutOfRewards(request, this.metadata),
        )

      return ChainGrpcExchangeTransformer.isOptedOutOfRewardsResponseToIsOptedOutOfRewards(
        response,
      )
    } catch (e: any) {
      if (e instanceof InjectiveExchangeV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'IsOptedOutOfRewards',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'IsOptedOutOfRewards',
        contextModule: ChainModule.Exchange,
      })
    }
  }
}
