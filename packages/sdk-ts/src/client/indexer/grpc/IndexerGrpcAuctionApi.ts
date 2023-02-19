import {
  AuctionRequest,
  AuctionResponse,
  AuctionsRequest,
  AuctionsResponse,
} from '@injectivelabs/indexer-api/injective_auction_rpc_pb'
import { InjectiveAuctionRPC } from '@injectivelabs/indexer-api/injective_auction_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { IndexerGrpcAuctionTransformer } from '../transformers'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAuctionApi extends BaseConsumer {
  protected module: string = IndexerModule.Account

  async fetchAuction(round?: number) {
    const request = new AuctionRequest()

    // If round is provided, set it on the request, otherwise fetch latest round
    if (round) {
      request.setRound(round)
    }

    try {
      const response = await this.request<
        AuctionRequest,
        AuctionResponse,
        typeof InjectiveAuctionRPC.Auction
      >(request, InjectiveAuctionRPC.Auction)

      return IndexerGrpcAuctionTransformer.auctionResponseToAuction(response)
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

  async fetchAuctions() {
    const request = new AuctionsRequest()

    try {
      const response = await this.request<
        AuctionsRequest,
        AuctionsResponse,
        typeof InjectiveAuctionRPC.Auctions
      >(request, InjectiveAuctionRPC.Auctions)

      return IndexerGrpcAuctionTransformer.auctionsResponseToAuctions(response)
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
