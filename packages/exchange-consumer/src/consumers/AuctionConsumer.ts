import {
  AuctionRequest,
  AuctionResponse,
  AuctionsRequest,
  AuctionsResponse,
} from '@injectivelabs/exchange-api/injective_auction_rpc_pb'
import { InjectiveAuctionRPC } from '@injectivelabs/exchange-api/injective_auction_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'

export class AuctionConsumer extends BaseConsumer {
  async fetchAuction(round?: number) {
    const request = new AuctionRequest()

    if (round) {
      request.setRound(round)
    }

    try {
      const response = await this.request<
        AuctionRequest,
        AuctionResponse,
        typeof InjectiveAuctionRPC.AuctionEndpoint
      >(request, InjectiveAuctionRPC.AuctionEndpoint)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
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

      return response.getAuctionsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
