import { GrpcCoin } from '../../../types/index'
import {
  GrpcIndexerBid,
  GrpcAuction,
  IndexerBid,
  Auction,
} from '../types/auction'
import { Coin } from '@injectivelabs/ts-types'
import {
  AuctionResponse,
  AuctionsResponse,
} from '@injectivelabs/indexer-proto-ts/injective_auction_rpc'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcAuctionTransformer {
  static auctionResponseToAuction(response: AuctionResponse): {
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

  static auctionsResponseToAuctions(response: AuctionsResponse): Auction[] {
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

  static grpcCoinToCoin(grpcCoin: GrpcCoin): Coin {
    return {
      denom: grpcCoin.denom,
      amount: grpcCoin.amount,
    }
  }

  static grpcAuctionToAuction(grpcAuction: GrpcAuction): Auction {
    return {
      winner: grpcAuction.winner,
      basketList: grpcAuction.basket.map(
        IndexerGrpcAuctionTransformer.grpcCoinToCoin,
      ),
      winningBidAmount: grpcAuction.winningBidAmount,
      round: parseInt(grpcAuction.round, 10),
      endTimestamp: parseInt(grpcAuction.endTimestamp, 10),
      updatedAt: parseInt(grpcAuction.updatedAt, 10),
    }
  }
}
