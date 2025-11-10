import { StreamOperation } from '@injectivelabs/ts-types'
import type * as InjectiveAuctionRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb'
import type { IndexerAuctionBid } from '../types/index.js'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAuctionStreamTransformer {
  static bidsStreamCallback = (
    response: InjectiveAuctionRpcPb.StreamBidsResponse,
  ) => ({
    bid: {
      bidder: response.bidder,
      bidAmount: response.bidAmount,
      bidTimestamp:
        typeof response.timestamp === 'bigint'
          ? Number(response.timestamp)
          : parseInt(response.timestamp, 10),
    } as IndexerAuctionBid,
    operation: StreamOperation.Insert,
  })
}
