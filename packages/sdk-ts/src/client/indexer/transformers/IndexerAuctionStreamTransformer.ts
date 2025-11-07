import { StreamOperation } from '@injectivelabs/ts-types'
import type { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'
import type { IndexerAuctionBid } from '../types/index.js'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAuctionStreamTransformer {
  static bidsStreamCallback = (
    response: InjectiveAuctionRpc.StreamBidsResponse,
  ) => ({
    bid: {
      bidder: response.bidder,
      bidAmount: response.bidAmount,
      bidTimestamp: parseInt(response.timestamp, 10),
    } as IndexerAuctionBid,
    operation: StreamOperation.Insert,
  })
}
