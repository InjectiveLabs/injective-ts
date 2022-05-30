import {
  QueryCurrentAuctionBasketResponse,
  QueryModuleStateResponse,
} from '@injectivelabs/chain-api/injective/auction/v1beta1/query_pb'
import { GenesisState } from '@injectivelabs/chain-api/injective/auction/v1beta1/genesis_pb'
import { AuctionModuleState, CurrentBasket } from '../types/auction'

export class ChainGrpcAuctionTransformer {
  static grpcCurrentBasketToCurrentBasket(
    basket: QueryCurrentAuctionBasketResponse,
  ): CurrentBasket {
    return {
      amountList: basket
        .getAmountList()
        .map((coin) => ({ amount: coin.getAmount(), denom: coin.getDenom() })),
      auctionRound: basket.getAuctionround(),
      auctionClosingTime: basket.getAuctionclosingtime(),
      highestBidder: basket.getHighestbidder(),
      highestBidAmount: basket.getHighestbidamount(),
    }
  }

  static grpcAuctionModuleStateToAuctionModuleState(
    auctionModuleState: QueryModuleStateResponse,
  ): AuctionModuleState {
    const state = auctionModuleState.getState() as GenesisState
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
