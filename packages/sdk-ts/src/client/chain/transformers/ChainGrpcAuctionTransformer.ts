import {
  QueryCurrentAuctionBasketResponse,
  QueryModuleStateResponse,
  QueryAuctionParamsResponse,
} from '@injectivelabs/chain-api/injective/auction/v1beta1/query_pb'
import { GenesisState } from '@injectivelabs/chain-api/injective/auction/v1beta1/genesis_pb'
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
    const params = response.getParams()

    return {
      auctionPeriod: params?.getAuctionPeriod() || 0,
      minNextBidIncrementRate: params?.getMinNextBidIncrementRate() || '0',
    }
  }

  static currentBasketResponseToCurrentBasket(
    response: QueryCurrentAuctionBasketResponse,
  ): CurrentBasket {
    return {
      amountList: response
        .getAmountList()
        .map((coin) => ({ amount: coin.getAmount(), denom: coin.getDenom() })),
      auctionRound: response.getAuctionround(),
      auctionClosingTime: response.getAuctionclosingtime(),
      highestBidder: response.getHighestbidder(),
      highestBidAmount: response.getHighestbidamount(),
    }
  }

  static auctionModuleStateResponseToAuctionModuleState(
    response: QueryModuleStateResponse,
  ): AuctionModuleState {
    const state = response.getState() as GenesisState
    const bid = state.getHighestBid()
    const params = state.getParams()!

    return {
      params: {
        auctionPeriod: params.getAuctionPeriod(),
        minNextBidIncrementRate: params.getMinNextBidIncrementRate(),
      },
      auctionRound: state.getAuctionRound(),
      highestBid: bid
        ? {
            bidder: bid.getBidder(),
            amount: bid.getAmount(),
          }
        : {
            amount: '',
            bidder: '',
          },
      auctionEndingTimestamp: state.getAuctionEndingTimestamp(),
    }
  }
}
