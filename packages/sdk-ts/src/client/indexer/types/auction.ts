import {
  Auction as GrpcAuction,
  Bid as GrpcIndexerBid,
  StreamBidsResponse,
} from '@injectivelabs/indexer-proto-ts/injective_auction_rpc'
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

export { GrpcAuction, GrpcIndexerBid, StreamBidsResponse }
