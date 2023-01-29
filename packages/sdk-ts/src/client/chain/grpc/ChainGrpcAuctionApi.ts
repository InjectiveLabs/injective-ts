import {
  QueryClientImpl,
  QueryAuctionParamsRequest,
  QueryModuleStateRequest,
  QueryCurrentAuctionBasketRequest,
} from '@injectivelabs/core-proto-ts/injective/auction/v1beta1/query'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getRpcInterface } from '../../BaseGrpcConsumer'
import { ChainGrpcAuctionTransformer } from '../transformers'
import { ChainModule } from '../types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuctionApi {
  protected module: string = ChainModule.Auction

  protected query: QueryClientImpl

  constructor(endpoint: string) {
    this.query = new QueryClientImpl(getRpcInterface(endpoint))
  }

  async fetchModuleParams() {
    const request = QueryAuctionParamsRequest.create()

    try {
      const response = await this.query.AuctionParams(request)

      return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
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
      const response = await this.query.AuctionModuleState(request)

      return ChainGrpcAuctionTransformer.auctionModuleStateResponseToAuctionModuleState(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
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
      const response = await this.query.CurrentAuctionBasket(request)

      return ChainGrpcAuctionTransformer.currentBasketResponseToCurrentBasket(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
