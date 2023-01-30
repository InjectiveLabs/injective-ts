import { StreamOperation } from '@injectivelabs/ts-types'
import { StreamBidsResponse } from '@injectivelabs/indexer-proto-ts/injective_auction_rpc'
import { IndexerBid } from '../types'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAuctionStreamTransformer {
  static bidsStreamCallback = (response: StreamBidsResponse) => ({
    bid: {
      bidder: response.bidder,
      bidAmount: response.bidAmount,
      bidTimestamp: parseInt(response.timestamp, 10),
    } as IndexerBid,
    operation: StreamOperation.Insert,
  })
}
