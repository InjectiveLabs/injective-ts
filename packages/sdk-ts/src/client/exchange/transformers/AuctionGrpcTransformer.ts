import { GrpcCoin } from '../types/index'
import { GrpcBid, GrpcAuction, Bid, Auction } from '../types/auction'
import { Coin } from '@injectivelabs/ts-types'

export class AuctionGrpcTransformer {
  static grpcBidToBid(grpcBid: GrpcBid): Bid {
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
        .map(AuctionGrpcTransformer.grpcCoinToCoin),
      winningBidAmount: grpcAuction.getWinningBidAmount(),
      round: grpcAuction.getRound(),
      endTimestamp: grpcAuction.getEndTimestamp(),
      updatedAt: grpcAuction.getUpdatedAt(),
    }
  }
}
