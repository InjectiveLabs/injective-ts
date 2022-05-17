import { StreamOperation } from '@injectivelabs/ts-types'
import { StreamBidsResponse } from '@injectivelabs/exchange-api/injective_auction_rpc_pb'

export class AuctionStreamTransformer {
  static bidsStreamCallback = (response: StreamBidsResponse) => ({
    bid: {
      bidder: response.getBidder(),
      bidAmount: response.getBidAmount(),
      bidTimestamp: response.getTimestamp(),
    },
    operation: StreamOperation.Insert,
  })
}
