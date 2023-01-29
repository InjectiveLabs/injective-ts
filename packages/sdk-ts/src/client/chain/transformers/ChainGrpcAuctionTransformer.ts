import {
  QueryCurrentAuctionBasketResponse,
  QueryModuleStateResponse,
  QueryAuctionParamsResponse,
} from '@injectivelabs/core-proto-ts/injective/auction/v1beta1/query'
import { GenesisState } from '@injectivelabs/core-proto-ts/injective/auction/v1beta1/genesis'
import {
  AuctionModuleState,
  CurrentBasket,
  AuctionModuleStateParams,
} from '../types/auction'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcAuctionTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryAuctionParamsResponse,
  ): AuctionModuleStateParams {
    const params = response.params!

    return {
      auctionPeriod: parseInt(params?.auctionPeriod || '0', 10),
      minNextBidIncrementRate: params?.minNextBidIncrementRate || '0',
    }
  }

  static currentBasketResponseToCurrentBasket(
    response: QueryCurrentAuctionBasketResponse,
  ): CurrentBasket {
    return {
      amountList: response.amount.map((coin) => ({
        amount: coin.amount,
        denom: coin.denom,
      })),
      auctionRound: parseInt(response.auctionRound, 10),
      auctionClosingTime: parseInt(response.auctionClosingTime, 10),
      highestBidder: response.highestBidAmount,
      highestBidAmount: response.highestBidAmount,
    }
  }

  static auctionModuleStateResponseToAuctionModuleState(
    response: QueryModuleStateResponse,
  ): AuctionModuleState {
    const state = response.state as GenesisState
    const bid = state.highestBid
    const params = state.params!

    return {
      params: {
        auctionPeriod: parseInt(params.auctionPeriod, 10),
        minNextBidIncrementRate: params.minNextBidIncrementRate,
      },
      auctionRound: parseInt(state.auctionRound, 10),
      highestBid: bid
        ? {
            bidder: bid.bidder,
            amount: bid.amount,
          }
        : {
            amount: '',
            bidder: '',
          },
      auctionEndingTimestamp: parseInt(state.auctionEndingTimestamp, 10),
    }
  }
}
