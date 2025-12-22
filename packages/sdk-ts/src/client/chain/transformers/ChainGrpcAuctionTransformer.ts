import { GeneralException } from '@injectivelabs/exceptions'
import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type * as InjectiveAuctionV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/query_pb'
import type * as InjectiveAuctionV1Beta1GenesisPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/genesis_pb'
import type {
  AuctionBid,
  GrpcAuctionBid,
  AuctionModuleState,
  AuctionCurrentBasket,
  AuctionModuleStateParams,
  AuctionLastAuctionResult,
  GrpcAuctionLastAuctionResult,
} from '../types/auction.js'

/**
 * Transformer for Auction module gRPC responses
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
      round: grpcLastAuctionResult.round.toString(),
    }
  }

  static moduleParamsResponseToModuleParams(
    response: InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsResponse,
  ): AuctionModuleStateParams {
    if (!response.params) {
      throw new GeneralException(
        new Error('Auction params not found in response'),
      )
    }

    const params = response.params

    return {
      auctionPeriod: Number(params.auctionPeriod ?? 0n),
      minNextBidIncrementRate: params.minNextBidIncrementRate ?? '0',
    }
  }

  static currentBasketResponseToCurrentBasket(
    response: InjectiveAuctionV1Beta1QueryPb.QueryCurrentAuctionBasketResponse,
  ): AuctionCurrentBasket {
    return {
      amountList: response.amount.map(
        ChainGrpcCommonTransformer.grpcCoinToCoin,
      ),
      auctionRound: Number(response.auctionRound),
      auctionClosingTime: Number(response.auctionClosingTime),
      highestBidder: response.highestBidAmount,
      highestBidAmount: response.highestBidAmount,
    }
  }

  static auctionModuleStateResponseToAuctionModuleState(
    response: InjectiveAuctionV1Beta1QueryPb.QueryModuleStateResponse,
  ): AuctionModuleState {
    if (!response.state) {
      throw new GeneralException(
        new Error('Auction module state not found in response'),
      )
    }

    const state =
      response.state as InjectiveAuctionV1Beta1GenesisPb.GenesisState

    if (!state.params) {
      throw new GeneralException(new Error('Auction params not found in state'))
    }

    const params = state.params

    return {
      params: {
        auctionPeriod: Number(params.auctionPeriod),
        minNextBidIncrementRate: params.minNextBidIncrementRate,
      },
      auctionRound: Number(state.auctionRound),
      highestBid: state.highestBid
        ? ChainGrpcAuctionTransformer.grpcBidToBid(state.highestBid)
        : undefined,
      auctionEndingTimestamp: Number(state.auctionEndingTimestamp),
      lastAuctionResult: state.lastAuctionResult
        ? ChainGrpcAuctionTransformer.grpcLastAuctionResultToLastAuctionResult(
            state.lastAuctionResult,
          )
        : undefined,
    }
  }

  static lastAuctionResultResponseToLastAuctionResult(
    response: InjectiveAuctionV1Beta1QueryPb.QueryLastAuctionResultResponse,
  ): AuctionLastAuctionResult | undefined {
    if (!response.lastAuctionResult) {
      return undefined
    }

    return ChainGrpcAuctionTransformer.grpcLastAuctionResultToLastAuctionResult(
      response.lastAuctionResult,
    )
  }
}
