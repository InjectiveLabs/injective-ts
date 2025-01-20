import { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'
import { Coin } from '@injectivelabs/ts-types'

export interface IndexerBid {
  bidder: string
  bidAmount: string
  bidTimestamp: number
}

export interface Auction {
  winner: string
  basketList: Coin[]
  winningBidAmount: string
  round: number
  endTimestamp: number
  updatedAt: number
}

export type TotalInjBurnt = number

export type GrpcIndexerBid = InjectiveAuctionRpc.Bid
export type GrpcAuction = InjectiveAuctionRpc.Auction
export type StreamBidsResponse = InjectiveAuctionRpc.StreamBidsResponse
