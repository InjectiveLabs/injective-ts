import {
  AuctionBid,
  GrpcAuctionBid,
  AuctionModuleState,
  AuctionCurrentBasket,
  AuctionModuleStateParams,
  AuctionLastAuctionResult,
  GrpcAuctionLastAuctionResult,
} from '../types/auction.js'
import {
  InjectiveAuctionV1Beta1Genesis,
  InjectiveAuctionV1Beta1Query,
} from '@injectivelabs/core-proto-ts'
import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'

/**
 * @category Chain Grpc Transformer
 */

export class ChainGrpcAuctionTransformer {
  static grpcBidToBid(grpcBid: GrpcAuctionBid): AuctionBid {
    return {
      bidder: grpcBid.bidder,
      amount: grpcBid.amount
        ? ChainGrpcCommonTransformer.grpcCoinToCoin(grpcBid.amount)
        : undefined,
    }
  }

  static grpcLastAuctionResultToLastAuctionResult(
    grpcLastAuctionResult: GrpcAuctionLastAuctionResult,
  ): AuctionLastAuctionResult {
    return {
      winner: grpcLastAuctionResult.winner,
      amount: grpcLastAuctionResult.amount
        ? ChainGrpcCommonTransformer.grpcCoinToCoin(
            grpcLastAuctionResult.amount,
          )
        : undefined,
      round: grpcLastAuctionResult.round,
    }
  }

  static moduleParamsResponseToModuleParams(
    response: InjectiveAuctionV1Beta1Query.QueryAuctionParamsResponse,
  ): AuctionModuleStateParams {
    const params = response.params!

    return {
      auctionPeriod: parseInt(params?.auctionPeriod || '0', 10),
      minNextBidIncrementRate: params?.minNextBidIncrementRate || '0',
    }
  }

  static currentBasketResponseToCurrentBasket(
    response: InjectiveAuctionV1Beta1Query.QueryCurrentAuctionBasketResponse,
  ): AuctionCurrentBasket {
    return {
      amountList: response.amount.map(
        ChainGrpcCommonTransformer.grpcCoinToCoin,
      ),
      auctionRound: parseInt(response.auctionRound, 10),
      auctionClosingTime: parseInt(response.auctionClosingTime, 10),
      highestBidder: response.highestBidAmount,
      highestBidAmount: response.highestBidAmount,
    }
  }

  static auctionModuleStateResponseToAuctionModuleState(
    response: InjectiveAuctionV1Beta1Query.QueryModuleStateResponse,
  ): AuctionModuleState {
    const state = response.state as InjectiveAuctionV1Beta1Genesis.GenesisState

    const params = state.params!

    return {
      params: {
        auctionPeriod: parseInt(params.auctionPeriod, 10),
        minNextBidIncrementRate: params.minNextBidIncrementRate,
      },
      auctionRound: parseInt(state.auctionRound, 10),
      highestBid: state.highestBid
        ? ChainGrpcAuctionTransformer.grpcBidToBid(state.highestBid)
        : undefined,
      auctionEndingTimestamp: parseInt(state.auctionEndingTimestamp, 10),
      lastAuctionResult: state.lastAuctionResult
        ? ChainGrpcAuctionTransformer.grpcLastAuctionResultToLastAuctionResult(
            state.lastAuctionResult,
          )
        : undefined,
    }
  }

  static LastAuctionResultResponseToLastAuctionResult(
    response: InjectiveAuctionV1Beta1Query.QueryLastAuctionResultResponse,
  ) {
    if (!response.lastAuctionResult) {
      return
    }

    return ChainGrpcAuctionTransformer.grpcLastAuctionResultToLastAuctionResult(
      response.lastAuctionResult,
    )
  }
}
