import { StreamOperation } from '../../../types'
import { AuctionTransformer } from './AuctionTransformer'
import { StreamBidsResponse } from './types'

export class AuctionStreamTransformer {
  static bidsStreamCallback = (response: StreamBidsResponse) => ({
    bid: AuctionTransformer.grpcStreamBidToBid(response),
    operation: StreamOperation.Insert,
  })
}
