import type { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'
import type {
  Auction,
  AuctionV2,
  AuctionCoin,
  GrpcAuction,
  GrpcAuctionV2,
  GrpcAuctionCoin,
  AccountAuctionV2,
  AuctionCoinPrices,
  IndexerAuctionBid,
  GrpcAccountAuctionV2,
  GrpcIndexerAuctionBid,
  GrpcAuctionCoinPrices,
} from '../types/auction.js'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcAuctionTransformer {
  static grpcAuctionCoinToAuctionCoin(grpcCoin: GrpcAuctionCoin): AuctionCoin {
    return {
      denom: grpcCoin.denom,
      amount: grpcCoin.amount,
      usdValue: grpcCoin.usdValue,
    }
  }

  static grpcAuctionCoinPricesToAuctionCoinPrices(
    grpcCoinPrices: GrpcAuctionCoinPrices,
  ): AuctionCoinPrices {
    return {
      denom: grpcCoinPrices.denom,
      amount: grpcCoinPrices.amount,
      prices: grpcCoinPrices.prices,
    }
  }

  static grpcBidToBid(grpcBid: GrpcIndexerAuctionBid): IndexerAuctionBid {
    return {
      bidder: grpcBid.bidder,
      bidAmount: grpcBid.amount,
      bidTimestamp: parseInt(grpcBid.timestamp, 10),
    }
  }

  static grpcAuctionToAuction(grpcAuction: GrpcAuction): Auction {
    return {
      winner: grpcAuction.winner,
      basket: grpcAuction.basket.map(
        IndexerGrpcAuctionTransformer.grpcAuctionCoinToAuctionCoin,
      ),
      winningBidAmount: grpcAuction.winningBidAmount,
      round: parseInt(grpcAuction.round, 10),
      endTimestamp: parseInt(grpcAuction.endTimestamp, 10),
      updatedAt: parseInt(grpcAuction.updatedAt, 10),
    }
  }

  static grpcAuctionV2ToAuctionV2(grpcAuction: GrpcAuctionV2): AuctionV2 {
    return {
      winner: grpcAuction.winner,
      basket: grpcAuction.basket.map(
        IndexerGrpcAuctionTransformer.grpcAuctionCoinPricesToAuctionCoinPrices,
      ),
      winningBidAmount: grpcAuction.winningBidAmount,
      round: parseInt(grpcAuction.round, 10),
      endTimestamp: parseInt(grpcAuction.endTimestamp, 10),
      updatedAt: parseInt(grpcAuction.updatedAt, 10),
    }
  }

  static grpcAccountAuctionV2ToAccountAuctionV2(
    grpcAccountAuction: GrpcAccountAuctionV2,
  ): AccountAuctionV2 {
    return {
      id: grpcAccountAuction.id,
      round: parseInt(grpcAccountAuction.round, 10),
      amountDeposited: grpcAccountAuction.amountDeposited,
      isClaimable: grpcAccountAuction.isClaimable,
      claimedAssets: grpcAccountAuction.claimedAssets.map(
        IndexerGrpcAuctionTransformer.grpcAuctionCoinPricesToAuctionCoinPrices,
      ),
    }
  }

  static auctionsResponseToAuctions(
    response: InjectiveAuctionRpc.AuctionsResponse,
  ): Auction[] {
    return response.auctions.map((a) =>
      IndexerGrpcAuctionTransformer.grpcAuctionToAuction(a),
    )
  }

  static auctionsHistoryV2ResponseToAuctionHistory(
    response: InjectiveAuctionRpc.AuctionsHistoryV2Response,
  ) {
    return {
      auctions: response.auctions.map(
        IndexerGrpcAuctionTransformer.grpcAuctionV2ToAuctionV2,
      ),
      next: response.next,
    }
  }

  static accountAuctionsV2ResponseToAccountAuctionsV2(
    response: InjectiveAuctionRpc.AccountAuctionsV2Response,
  ) {
    return {
      auctions: response.auctions.map(
        IndexerGrpcAuctionTransformer.grpcAccountAuctionV2ToAccountAuctionV2,
      ),
      next: response.next,
      total: response.total,
    }
  }

  static auctionResponseToAuction(
    response: InjectiveAuctionRpc.AuctionEndpointResponse,
  ): {
    auction: Auction
    bids: IndexerAuctionBid[]
  } {
    return {
      auction: IndexerGrpcAuctionTransformer.grpcAuctionToAuction(
        response.auction!,
      ),
      bids: response.bids.map(IndexerGrpcAuctionTransformer.grpcBidToBid),
    }
  }
}
