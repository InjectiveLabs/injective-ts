import { StreamOperation } from '@injectivelabs/ts-types'
import { StreamBidsResponse } from '@injectivelabs/exchange-api/injective_auction_rpc_pb'
import { ExchangeBid } from '../types'

/**
 * @category Exchange Grpc Stream Transformer
 */
export class ExchangeAuctionStreamTransformer {
  static bidsStreamCallback = (response: StreamBidsResponse) => ({
    bid: {
      bidder: response.getBidder(),
      bidAmount: response.getBidAmount(),
      bidTimestamp: response.getTimestamp(),
    } as ExchangeBid,
    operation: StreamOperation.Insert,
  })
}
