import { Coin } from '@injectivelabs/ts-types'
import {
  InjectiveAuctionV1Beta1Auction,
  InjectiveAuctionV1Beta1Query,
} from '@injectivelabs/core-proto-ts'

export interface GrpcCurrentBasket
  extends GrpcQueryCurrentAuctionBasketResponse {
  //
}

export interface CurrentBasket {
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

export interface AuctionModuleHighestBid {
  bidder: string
  amount: string
}

export interface AuctionModuleState {
  params: AuctionModuleStateParams | undefined
  auctionRound: number
  highestBid: AuctionModuleHighestBid | undefined
  auctionEndingTimestamp: number
}

export type GrpcQueryCurrentAuctionBasketResponse =
  InjectiveAuctionV1Beta1Query.QueryCurrentAuctionBasketResponse
export type GrpcAuctionParams = InjectiveAuctionV1Beta1Auction.Params
export type GrpcBid = InjectiveAuctionV1Beta1Auction.Bid
export type GrpcEventBid = InjectiveAuctionV1Beta1Auction.EventBid
export type GrpcEventAuctionResult =
  InjectiveAuctionV1Beta1Auction.EventAuctionResult
