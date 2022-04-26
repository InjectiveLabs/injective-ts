import {
  Auction as GrpcAuction,
  Bid as GrpcBid,
  Coin as GrpcCoin,
  StreamBidsResponse,
} from '@injectivelabs/exchange-api/injective_auction_rpc_pb'

export interface Coin {
  denom: string
  amount: string
}

export interface Bid {
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

export { GrpcAuction, GrpcBid, GrpcCoin, StreamBidsResponse }
