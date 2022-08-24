import {
  AuctionRequest,
  AuctionResponse,
  AuctionsRequest,
  AuctionsResponse,
} from '@injectivelabs/indexer-api/injective_auction_rpc_pb'
import { InjectiveAuctionRPC } from '@injectivelabs/indexer-api/injective_auction_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { IndexerGrpcAuctionTransformer } from '../transformers'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcAuctionApi extends BaseConsumer {
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
        typeof InjectiveAuctionRPC.AuctionEndpoint
      >(request, InjectiveAuctionRPC.AuctionEndpoint)

      return IndexerGrpcAuctionTransformer.auctionResponseToAuction(response)
    } catch (e: any) {
      throw new Error(e.message)
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
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
