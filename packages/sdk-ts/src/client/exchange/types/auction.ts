import {
  Auction as GrpcAuction,
  Bid as GrpcExchangeBid,
  StreamBidsResponse,
} from '@injectivelabs/exchange-api/injective_auction_rpc_pb'
import { Coin } from '@injectivelabs/ts-types'

export interface Bid {
  bidder: string
  amount: string
  timestamp: number
}

export interface Auction {
  winner: string
  basketList: Coin[]
  winningBidAmount: string
  round: number
  endTimestamp: number
  updatedAt: number
}

export { GrpcAuction, GrpcExchangeBid, StreamBidsResponse }
