import { ExplorerTransformer } from './ExplorerTransformer'
import { StreamOperation } from '../../../types'
import { StreamBlocksResponse, StreamTxsResponse } from './types'

export class ExplorerStreamTransformer {
  static blocksStreamCallback = (response: StreamBlocksResponse) => ({
    block: ExplorerTransformer.grpcBlockToBlock(response),
    operation: StreamOperation.Insert,
  })

  static blocksWithTxsStreamCallback = (response: StreamBlocksResponse) => ({
    block: ExplorerTransformer.grpcBlockToBlockWithTxs(response),
    operation: StreamOperation.Insert,
  })

  static transactionsStreamCallback = (response: StreamTxsResponse) => ({
    block: ExplorerTransformer.grpcTransactionToTransaction(response),
    operation: StreamOperation.Insert,
  })
}
