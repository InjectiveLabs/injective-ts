import {
  Auction,
  Bid,
  Coin,
  GrpcAuction,
  GrpcBid,
  GrpcCoin,
  StreamBidsResponse,
} from '../types'

export class AuctionTransformer {
  static grpcStreamBidToBid(grpcStreamBid: StreamBidsResponse): Bid {
    return {
      bidder: grpcStreamBid.getBidder(),
      bidAmount: grpcStreamBid.getBidAmount(),
      bidTimestamp: grpcStreamBid.getTimestamp(),
    }
  }

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
        .map(AuctionTransformer.grpcCoinToCoin),
      winningBidAmount: grpcAuction.getWinningBidAmount(),
      round: grpcAuction.getRound(),
      endTimestamp: grpcAuction.getEndTimestamp(),
      updatedAt: grpcAuction.getUpdatedAt(),
    }
  }
}
