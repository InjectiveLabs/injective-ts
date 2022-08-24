import {
  AuctionRequest,
  AuctionResponse,
  AuctionsRequest,
  AuctionsResponse,
} from '@injectivelabs/exchange-api/injective_auction_rpc_pb'
import { InjectiveAuctionRPC } from '@injectivelabs/exchange-api/injective_auction_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ExchangeGrpcAuctionTransformer } from '../transformers'

/**
 * @category Exchange Grpc API
 */
export class ExchangeGrpcAuctionApi extends BaseConsumer {
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

      return ExchangeGrpcAuctionTransformer.auctionResponseToAuction(response)
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

      return ExchangeGrpcAuctionTransformer.auctionsResponseToAuctions(response)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
