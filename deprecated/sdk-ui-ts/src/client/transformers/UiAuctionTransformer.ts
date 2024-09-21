import { AuctionModuleState } from '@injectivelabs/sdk-ts'

export class UiAuctionTransformer {
  static grpcAuctionModuleStateToModuleState(
    state: AuctionModuleState,
  ): AuctionModuleState {
    const highestBidAmount = state.highestBid ? state.highestBid.amount : '0'
    const highestBidAmountWithoutDenom = decodeURI(highestBidAmount).replace(
      /[^0-9]/g,
      '',
    )

    return {
      ...state,
      highestBid: {
        bidder: state.highestBid ? state.highestBid.bidder : '',
        amount: highestBidAmountWithoutDenom,
      },
    }
  }
}
