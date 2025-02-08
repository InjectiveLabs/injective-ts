import { Coin } from '@injectivelabs/ts-types'
import { InjectiveAuctionV1Beta1Auction } from '@injectivelabs/core-proto-ts'

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

export type GrpcAuctionParams = InjectiveAuctionV1Beta1Auction.Params
export type GrpcAuctionBid = InjectiveAuctionV1Beta1Auction.Bid
export type GrpcAuctionLastAuctionResult =
  InjectiveAuctionV1Beta1Auction.LastAuctionResult
export type GrpcAuctionEventBid = InjectiveAuctionV1Beta1Auction.EventBid
export type GrpcAuctionEventAuctionResult =
  InjectiveAuctionV1Beta1Auction.EventAuctionResult
export type GrpcAuctionEventAuctionStart =
  InjectiveAuctionV1Beta1Auction.EventAuctionStart
