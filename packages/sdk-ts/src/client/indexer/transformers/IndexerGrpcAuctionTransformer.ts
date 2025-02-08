import { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'
import { IndexerCommonTransformer } from './IndexerCommonTransformer.js'
import {
  Auction,
  IndexerBid,
  GrpcAuction,
  TotalInjBurnt,
  GrpcIndexerBid,
} from '../types/auction.js'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcAuctionTransformer {
  static auctionResponseToAuction(
    response: InjectiveAuctionRpc.AuctionEndpointResponse,
  ): {
    auction: Auction
    bids: IndexerBid[]
  } {
    return {
      auction: IndexerGrpcAuctionTransformer.grpcAuctionToAuction(
        response.auction!,
      ),
      bids: response.bids.map(IndexerGrpcAuctionTransformer.grpcBidToBid),
    }
  }

  static auctionsResponseToAuctions(
    response: InjectiveAuctionRpc.AuctionsResponse,
  ): Auction[] {
    return response.auctions.map((a) =>
      IndexerGrpcAuctionTransformer.grpcAuctionToAuction(a),
    )
  }

  static grpcBidToBid(grpcBid: GrpcIndexerBid): IndexerBid {
    return {
      bidder: grpcBid.bidder,
      bidAmount: grpcBid.amount,
      bidTimestamp: parseInt(grpcBid.timestamp, 10),
    }
  }

  static grpcAuctionToAuction(grpcAuction: GrpcAuction): Auction {
    return {
      winner: grpcAuction.winner,
      basketList: grpcAuction.basket.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
      winningBidAmount: grpcAuction.winningBidAmount,
      round: parseInt(grpcAuction.round, 10),
      endTimestamp: parseInt(grpcAuction.endTimestamp, 10),
      updatedAt: parseInt(grpcAuction.updatedAt, 10),
    }
  }

  static injBurntResponseToInjBurnt(
    response: InjectiveAuctionRpc.InjBurntEndpointResponse,
  ): TotalInjBurnt {
    return Number(response.totalInjBurnt)
  }
}
