import { StreamOperation } from '../../../types/index.js'
import { bigIntToNumber } from '../../../utils/helpers.js'
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
      bidTimestamp: bigIntToNumber(response.timestamp),
    } as IndexerAuctionBid,
    operation: StreamOperation.Insert,
  })
}
