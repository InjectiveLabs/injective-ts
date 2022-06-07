import {
  Params as GrpcAuctionParams,
  Bid as GrpcBid,
  EventBid as GrpcEventBid,
  EventAuctionResult as GrpcEventAuctionResult,
} from '@injectivelabs/chain-api/injective/auction/v1beta1/auction_pb'
import { Coin } from '@injectivelabs/ts-types'
import { QueryCurrentAuctionBasketResponse as GrpcQueryCurrentAuctionBasketResponse } from '@injectivelabs/chain-api/injective/auction/v1beta1/query_pb'

export interface GrpcCurrentBasket
  extends GrpcQueryCurrentAuctionBasketResponse.AsObject {
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

export { GrpcBid, GrpcEventAuctionResult, GrpcEventBid, GrpcAuctionParams }
