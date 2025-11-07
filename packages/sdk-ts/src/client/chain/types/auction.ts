import type { Coin } from '@injectivelabs/ts-types'
import type * as InjectiveAuctionV1Beta1AuctionPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/auction_pb.mjs'

export interface AuctionParams {
  auctionPeriod: number
  minNextBidIncrementRate: string
  injBasketMaxCap: string
}

export interface AuctionBid {
  bidder: string
  amount?: Coin
}

export interface AuctionLastAuctionResult {
  winner: string
  amount?: Coin
  round: string
}

export interface AuctionEventBid {
  bidder: string
  amount?: Coin
  round: string
}

export interface AuctionEventAuctionResult {
  winner: string
  amount?: Coin
  round: string
}

export interface AuctionEventAuctionStart {
  round: string
  endingTimestamp: string
  newBasket: Coin[]
}

export interface AuctionCurrentBasket {
  amountList: Coin[]
  auctionRound: number
  auctionClosingTime: number
  highestBidder: string
  highestBidAmount: string
}

export interface AuctionModuleParams {
  auctionPeriod: number
  minNextBidIncrementRate: string
}

export interface AuctionModuleStateParams {
  auctionPeriod: number
  minNextBidIncrementRate: string
}
export interface AuctionModuleState {
  params?: AuctionModuleStateParams
  auctionRound: number
  highestBid?: AuctionBid
  auctionEndingTimestamp: number
  lastAuctionResult?: AuctionLastAuctionResult
}

export interface AuctionModuleStateResponse {
  params?: AuctionParams
  auctionRound: string
  highestBid?: AuctionBid
  auctionEndingTimestamp: string
  lastAuctionResult?: AuctionLastAuctionResult
}

export type GrpcAuctionParams = InjectiveAuctionV1Beta1AuctionPb.Params
export type GrpcAuctionBid = InjectiveAuctionV1Beta1AuctionPb.Bid
export type GrpcAuctionLastAuctionResult =
  InjectiveAuctionV1Beta1AuctionPb.LastAuctionResult
export type GrpcAuctionEventBid = InjectiveAuctionV1Beta1AuctionPb.EventBid
export type GrpcAuctionEventAuctionResult =
  InjectiveAuctionV1Beta1AuctionPb.EventAuctionResult
export type GrpcAuctionEventAuctionStart =
  InjectiveAuctionV1Beta1AuctionPb.EventAuctionStart
