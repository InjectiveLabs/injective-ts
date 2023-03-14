import { InjectiveAuctionV1Beta1Query } from '@injectivelabs/core-proto-ts'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcWebImpl } from '../../BaseGrpcWebConsumer'
import { ChainGrpcAuctionTransformer } from '../transformers'
import { ChainModule } from '../types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuctionApi {
  protected module: string = ChainModule.Auction

  protected client: InjectiveAuctionV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveAuctionV1Beta1Query.QueryClientImpl(
      getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request =
      InjectiveAuctionV1Beta1Query.QueryAuctionParamsRequest.create()

    try {
      const response = await this.client.AuctionParams(request)

      return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchModuleState() {
    const request =
      InjectiveAuctionV1Beta1Query.QueryModuleStateRequest.create()

    try {
      const response = await this.client.AuctionModuleState(request)

      return ChainGrpcAuctionTransformer.auctionModuleStateResponseToAuctionModuleState(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchCurrentBasket() {
    const request =
      InjectiveAuctionV1Beta1Query.QueryCurrentAuctionBasketRequest.create()

    try {
      const response = await this.client.CurrentAuctionBasket(request)

      return ChainGrpcAuctionTransformer.currentBasketResponseToCurrentBasket(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
