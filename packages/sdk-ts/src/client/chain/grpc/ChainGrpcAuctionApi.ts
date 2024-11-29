import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectiveAuctionV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainModule } from '../types/index.js'
import { ChainGrpcAuctionTransformer } from '../transformers/index.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuctionApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Auction

  protected client: InjectiveAuctionV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveAuctionV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request =
      InjectiveAuctionV1Beta1Query.QueryAuctionParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveAuctionV1Beta1Query.QueryAuctionParamsResponse>(
          () => this.client.AuctionParams(request, this.metadata),
        )

      return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'AuctionParams',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AuctionParams',
        contextModule: this.module,
      })
    }
  }

  async fetchModuleState() {
    const request =
      InjectiveAuctionV1Beta1Query.QueryModuleStateRequest.create()

    try {
      const response =
        await this.retry<InjectiveAuctionV1Beta1Query.QueryModuleStateResponse>(
          () => this.client.AuctionModuleState(request, this.metadata),
        )

      return ChainGrpcAuctionTransformer.auctionModuleStateResponseToAuctionModuleState(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'AuctionModuleState',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AuctionModuleState',
        contextModule: this.module,
      })
    }
  }

  async fetchCurrentBasket() {
    const request =
      InjectiveAuctionV1Beta1Query.QueryCurrentAuctionBasketRequest.create()

    try {
      const response =
        await this.retry<InjectiveAuctionV1Beta1Query.QueryCurrentAuctionBasketResponse>(
          () => this.client.CurrentAuctionBasket(request, this.metadata),
        )

      return ChainGrpcAuctionTransformer.currentBasketResponseToCurrentBasket(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'CurrentAuctionBasket',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'CurrentAuctionBasket',
        contextModule: this.module,
      })
    }
  }
}
