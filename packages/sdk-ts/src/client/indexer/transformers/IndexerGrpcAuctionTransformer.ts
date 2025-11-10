import type * as InjectiveAuctionRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb'
import type {
  Auction,
  AuctionV2,
  AuctionCoin,
  GrpcAuction,
  AuctionsStats,
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
      bidTimestamp: Number(grpcBid.timestamp),
    }
  }

  static grpcAuctionToAuction(grpcAuction: GrpcAuction): Auction {
    return {
      winner: grpcAuction.winner,
      basket: grpcAuction.basket.map(
        IndexerGrpcAuctionTransformer.grpcAuctionCoinToAuctionCoin,
      ),
      winningBidAmount: grpcAuction.winningBidAmount,
      round: Number(grpcAuction.round),
      endTimestamp: Number(grpcAuction.endTimestamp),
      updatedAt: Number(grpcAuction.updatedAt),
    }
  }

  static grpcAuctionV2ToAuctionV2(grpcAuction: GrpcAuctionV2): AuctionV2 {
    return {
      winner: grpcAuction.winner,
      basket: grpcAuction.basket.map(
        IndexerGrpcAuctionTransformer.grpcAuctionCoinPricesToAuctionCoinPrices,
      ),
      contract: grpcAuction.contract
        ? {
            id: grpcAuction.contract.id.toString(),
            bidTarget: grpcAuction.contract.bidTarget,
            currentSlots: grpcAuction.contract.currentSlots.toString(),
            totalSlots: grpcAuction.contract.totalSlots.toString(),
            maxUserAllocation: grpcAuction.contract.maxUserAllocation,
            totalCommitted: grpcAuction.contract.totalCommitted,
            whitelistAddresses: grpcAuction.contract.whitelistAddresses,
            startTimestamp: grpcAuction.contract.startTimestamp.toString(),
            endTimestamp: grpcAuction.contract.endTimestamp.toString(),
            maxRoundAllocation: grpcAuction.contract.maxRoundAllocation,
          }
        : undefined,
      winningBidAmount: grpcAuction.winningBidAmount,
      winningBidAmountUsd: grpcAuction.winningBidAmountUsd,
      round: Number(grpcAuction.round),
      endTimestamp: Number(grpcAuction.endTimestamp),
      updatedAt: Number(grpcAuction.updatedAt),
    }
  }

  static grpcAccountAuctionV2ToAccountAuctionV2(
    grpcAccountAuction: GrpcAccountAuctionV2,
  ): AccountAuctionV2 {
    return {
      id: grpcAccountAuction.id.toString(),
      round: Number(grpcAccountAuction.round),
      amountDeposited: grpcAccountAuction.amountDeposited,
      isClaimable: grpcAccountAuction.isClaimable,
      claimedAssets: grpcAccountAuction.claimedAssets.map(
        IndexerGrpcAuctionTransformer.grpcAuctionCoinPricesToAuctionCoinPrices,
      ),
    }
  }

  static auctionsResponseToAuctions(
    response: InjectiveAuctionRpcPb.AuctionsResponse,
  ): Auction[] {
    return response.auctions.map((a) =>
      IndexerGrpcAuctionTransformer.grpcAuctionToAuction(a),
    )
  }

  static auctionsHistoryV2ResponseToAuctionHistory(
    response: InjectiveAuctionRpcPb.AuctionsHistoryV2Response,
  ) {
    return {
      auctions: response.auctions.map(
        IndexerGrpcAuctionTransformer.grpcAuctionV2ToAuctionV2,
      ),
      next: response.next,
    }
  }

  static accountAuctionsV2ResponseToAccountAuctionsV2(
    response: InjectiveAuctionRpcPb.AccountAuctionsV2Response,
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
    response: InjectiveAuctionRpcPb.AuctionEndpointResponse,
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

  static auctionStatsResponseToAuctionStats(
    response: InjectiveAuctionRpcPb.AuctionsStatsResponse,
  ): AuctionsStats {
    return {
      totalBurnt: response.totalBurnt,
      totalBurntInUsd: response.totalUsdValue,
    }
  }
}
