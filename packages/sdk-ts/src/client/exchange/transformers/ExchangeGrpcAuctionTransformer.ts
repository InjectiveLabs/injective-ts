import { GrpcCoin } from '../../../types/index'
import {
  GrpcExchangeBid,
  GrpcAuction,
  ExchangeBid,
  Auction,
} from '../types/auction'
import { Coin } from '@injectivelabs/ts-types'
import {
  AuctionResponse,
  AuctionsResponse,
} from '@injectivelabs/exchange-api/injective_auction_rpc_pb'

/**
 * @category Exchange Grpc Transformer
 */
export class ExchangeGrpcAuctionTransformer {
  static auctionResponseToAuction(response: AuctionResponse): {
    auction: Auction
    bids: ExchangeBid[]
  } {
    return {
      auction: ExchangeGrpcAuctionTransformer.grpcAuctionToAuction(
        response.getAuction()!,
      ),
      bids: response
        .getBidsList()
        .map(ExchangeGrpcAuctionTransformer.grpcBidToBid),
    }
  }

  static auctionsResponseToAuctions(response: AuctionsResponse): Auction[] {
    return response
      .getAuctionsList()
      .map((a) => ExchangeGrpcAuctionTransformer.grpcAuctionToAuction(a))
  }

  static grpcBidToBid(grpcBid: GrpcExchangeBid): ExchangeBid {
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
