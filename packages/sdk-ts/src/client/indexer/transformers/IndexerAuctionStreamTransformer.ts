import { StreamOperation } from '@injectivelabs/ts-types'
import { StreamBidsResponse } from '@injectivelabs/indexer-api/injective_auction_rpc_pb'
import { IndexerBid } from '../types'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAuctionStreamTransformer {
  static bidsStreamCallback = (response: StreamBidsResponse) => ({
    bid: {
      bidder: response.getBidder(),
      bidAmount: response.getBidAmount(),
      bidTimestamp: response.getTimestamp(),
    } as IndexerBid,
    operation: StreamOperation.Insert,
  })
}
