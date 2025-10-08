import type { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'

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

export type GrpcAuction = InjectiveAuctionRpc.Auction
export type GrpcAuctionCoin = InjectiveAuctionRpc.Coin
export type GrpcIndexerAuctionBid = InjectiveAuctionRpc.Bid
export type GrpcAuctionV2 = InjectiveAuctionRpc.AuctionV2Result
export type GrpcAuctionCoinPrices = InjectiveAuctionRpc.CoinPrices
export type GrpcAccountAuctionV2 = InjectiveAuctionRpc.AccountAuctionV2
export type GrpcAuctionContract = InjectiveAuctionRpc.AuctionContract
export type StreamBidsResponse = InjectiveAuctionRpc.StreamBidsResponse
