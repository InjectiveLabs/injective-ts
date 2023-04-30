import { IndexerGrpcExplorerTransformer } from './IndexerGrpcExplorerTransformer'
import { StreamOperation } from '../../../types'
import { InjectiveExplorerRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Stream Transformer
 */
export class ExplorerStreamTransformer {
  static blocksStreamCallback = (
    response: InjectiveExplorerRpc.StreamBlocksResponse,
  ) => ({
    block: IndexerGrpcExplorerTransformer.grpcBlockToBlock(response),
    operation: StreamOperation.Insert,
  })

  static blocksWithTxsStreamCallback = (
    response: InjectiveExplorerRpc.StreamBlocksResponse,
  ) => ({
    block: IndexerGrpcExplorerTransformer.grpcBlockToBlockWithTxs(response),
    operation: StreamOperation.Insert,
  })

  static transactionsStreamCallback = (
    response: InjectiveExplorerRpc.StreamTxsResponse,
  ) => ({
    tx: IndexerGrpcExplorerTransformer.streamTxResponseToTxs(response),
    operation: StreamOperation.Insert,
  })
}
