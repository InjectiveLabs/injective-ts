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
} from '@injectivelabs/indexer-api/injective_auction_rpc_pb'

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
        response.getAuction()!,
      ),
      bids: response
        .getBidsList()
        .map(IndexerGrpcAuctionTransformer.grpcBidToBid),
    }
  }

  static auctionsResponseToAuctions(response: AuctionsResponse): Auction[] {
    return response
      .getAuctionsList()
      .map((a) => IndexerGrpcAuctionTransformer.grpcAuctionToAuction(a))
  }

  static grpcBidToBid(grpcBid: GrpcIndexerBid): IndexerBid {
    return {
      bidder: grpcBid.getBidder(),
      bidAmount: grpcBid.getAmount(),
      bidTimestamp: grpcBid.getTimestamp(),
    }
  }

  static grpcCoinToCoin(grpcCoin: GrpcCoin): Coin {
    return {
      denom: grpcCoin.getDenom(),
      amount: grpcCoin.getAmount(),
    }
  }

  static grpcAuctionToAuction(grpcAuction: GrpcAuction): Auction {
    return {
      winner: grpcAuction.getWinner(),
      basketList: grpcAuction
        .getBasketList()
        .map(IndexerGrpcAuctionTransformer.grpcCoinToCoin),
      winningBidAmount: grpcAuction.getWinningBidAmount(),
      round: grpcAuction.getRound(),
      endTimestamp: grpcAuction.getEndTimestamp(),
      updatedAt: grpcAuction.getUpdatedAt(),
    }
  }
}
