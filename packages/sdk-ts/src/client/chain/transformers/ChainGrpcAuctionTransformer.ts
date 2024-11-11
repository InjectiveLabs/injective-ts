import {
  AuctionModuleState,
  CurrentBasket,
  AuctionModuleStateParams,
} from '../types/auction.js'
import {
  InjectiveAuctionV1Beta1Genesis,
  InjectiveAuctionV1Beta1Query,
} from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcAuctionTransformer {
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
    response: InjectiveAuctionV1Beta1Query.QueryModuleStateResponse,
  ): AuctionModuleState {
    const state = response.state as InjectiveAuctionV1Beta1Genesis.GenesisState
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
