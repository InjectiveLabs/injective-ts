import { StreamOperation } from '@injectivelabs/ts-types'
import { IndexerBid } from '../types/index.js'
import { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'

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
    } as IndexerBid,
    operation: StreamOperation.Insert,
  })
}
