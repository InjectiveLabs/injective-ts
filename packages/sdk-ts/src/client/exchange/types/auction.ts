import {
  Auction as GrpcAuction,
  Bid as GrpcExchangeBid,
  StreamBidsResponse,
} from '@injectivelabs/exchange-api/injective_auction_rpc_pb'
import { Coin } from '@injectivelabs/ts-types'

export interface ExchangeBid {
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

export { GrpcAuction, GrpcExchangeBid, StreamBidsResponse }
