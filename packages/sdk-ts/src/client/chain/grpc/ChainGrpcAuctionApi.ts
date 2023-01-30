import {
  QueryClientImpl,
  QueryAuctionParamsRequest,
  QueryModuleStateRequest,
  QueryCurrentAuctionBasketRequest,
} from '@injectivelabs/core-proto-ts/injective/auction/v1beta1/query'
import { GrpcWebError } from '@injectivelabs/core-proto-ts/tendermint/abci/types'
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

  protected client: QueryClientImpl

  constructor(endpoint: string) {
    this.client = new QueryClientImpl(getGrpcWebImpl(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryAuctionParamsRequest.create()

    try {
      const response = await this.client.AuctionParams(request)

      return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
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
    const request = QueryModuleStateRequest.create()

    try {
      const response = await this.client.AuctionModuleState(request)

      return ChainGrpcAuctionTransformer.auctionModuleStateResponseToAuctionModuleState(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
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
    const request = QueryCurrentAuctionBasketRequest.create()

    try {
      const response = await this.client.CurrentAuctionBasket(request)

      return ChainGrpcAuctionTransformer.currentBasketResponseToCurrentBasket(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
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
