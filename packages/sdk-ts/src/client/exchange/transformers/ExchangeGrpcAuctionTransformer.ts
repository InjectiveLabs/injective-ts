import { GrpcCoin } from '../../../types/index'
import { GrpcExchangeBid, GrpcAuction, Bid, Auction } from '../types/auction'
import { Coin } from '@injectivelabs/ts-types'

export class ExchangeGrpcAuctionTransformer {
  static grpcBidToBid(grpcBid: GrpcExchangeBid): Bid {
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
        .map(ExchangeGrpcAuctionTransformer.grpcCoinToCoin),
      winningBidAmount: grpcAuction.getWinningBidAmount(),
      round: grpcAuction.getRound(),
      endTimestamp: grpcAuction.getEndTimestamp(),
      updatedAt: grpcAuction.getUpdatedAt(),
    }
  }
}
