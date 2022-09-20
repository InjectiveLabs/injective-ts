import { Query as AuctionQuery } from '@injectivelabs/chain-api/injective/auction/v1beta1//query_pb_service'
import {
  QueryAuctionParamsRequest,
  QueryAuctionParamsResponse,
  QueryModuleStateRequest,
  QueryModuleStateResponse,
  QueryCurrentAuctionBasketRequest,
  QueryCurrentAuctionBasketResponse,
} from '@injectivelabs/chain-api/injective/auction/v1beta1/query_pb'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainGrpcAuctionTransformer } from '../transformers'
import { ChainModule } from '../types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcAuctionApi extends BaseConsumer {
  protected module: string = ChainModule.Auction

  async fetchModuleParams() {
    const request = new QueryAuctionParamsResponse()

    try {
      const response = await this.request<
        QueryAuctionParamsRequest,
        QueryAuctionParamsResponse,
        typeof AuctionQuery.AuctionParams
      >(request, AuctionQuery.AuctionParams)

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
    const request = new QueryModuleStateRequest()

    try {
      const response = await this.request<
        QueryModuleStateRequest,
        QueryModuleStateResponse,
        typeof AuctionQuery.AuctionModuleState
      >(request, AuctionQuery.AuctionModuleState)

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
    const request = new QueryCurrentAuctionBasketRequest()

    try {
      const response = await this.request<
        QueryCurrentAuctionBasketRequest,
        QueryCurrentAuctionBasketResponse,
        typeof AuctionQuery.CurrentAuctionBasket
      >(request, AuctionQuery.CurrentAuctionBasket)

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
