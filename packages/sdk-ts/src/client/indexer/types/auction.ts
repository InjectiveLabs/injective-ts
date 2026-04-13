import type * as InjectiveAuctionRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb'

export interface IndexerAuctionBid {
  bidder: string
  bidAmount: string
  bidTimestamp: number
}

export interface AuctionCoin {
  denom: string
  amount: string
  usdValue: string
}

export interface AuctionCoinPrices {
  denom: string
  amount: string
  prices: {
    [key: string]: string
  }
}

export interface AuctionContract {
  id: string
  bidTarget: string
  currentSlots: string
  totalSlots: string
  maxUserAllocation: string
  totalCommitted: string
  whitelistAddresses: string[]
  startTimestamp: string
  endTimestamp: string
  maxRoundAllocation: string
  isBidPlaced: boolean
}

export interface Auction {
  winner: string
  basket: AuctionCoin[]
  winningBidAmount: string
  round: number
  endTimestamp: number
  updatedAt: number
  contract?: AuctionContract
}

export interface AuctionV2 {
  winner: string
  basket: AuctionCoinPrices[]
  winningBidAmount: string
  winningBidAmountUsd: string
  round: number
  endTimestamp: number
  updatedAt: number
  contract?: AuctionContract
}

export interface AccountAuctionV2 {
  id: string
  round: number
  amountDeposited: string
  isClaimable: boolean
  claimedAssets: AuctionCoinPrices[]
}

export interface AuctionsStats {
  totalBurnt: string
  totalBurntInUsd: string
}

export interface AccountAuctionStatus {
  status: string
}

export type GrpcAuction = InjectiveAuctionRpcPb.Auction
export type GrpcAuctionCoin = InjectiveAuctionRpcPb.Coin
export type GrpcIndexerAuctionBid = InjectiveAuctionRpcPb.Bid
export type GrpcAuctionV2 = InjectiveAuctionRpcPb.AuctionV2Result
export type GrpcAuctionCoinPrices = InjectiveAuctionRpcPb.CoinPrices
export type GrpcAccountAuctionV2 = InjectiveAuctionRpcPb.AccountAuctionV2
export type GrpcAuctionContract = InjectiveAuctionRpcPb.AuctionContract
export type StreamBidsResponse = InjectiveAuctionRpcPb.StreamBidsResponse
