import { IndexerGrpcExplorerTransformer } from './IndexerGrpcExplorerTransformer'
import { StreamOperation } from '../../../types'
import {
  StreamBlocksResponse,
  StreamTxsResponse,
} from '@injectivelabs/indexer-api/injective_explorer_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class ExplorerStreamTransformer {
  static blocksStreamCallback = (response: StreamBlocksResponse) => ({
    block: IndexerGrpcExplorerTransformer.grpcBlockToBlock(response),
    operation: StreamOperation.Insert,
  })

  static blocksWithTxsStreamCallback = (response: StreamBlocksResponse) => ({
    block: IndexerGrpcExplorerTransformer.grpcBlockToBlockWithTxs(response),
    operation: StreamOperation.Insert,
  })

  static transactionsStreamCallback = (response: StreamTxsResponse) => ({
    block: IndexerGrpcExplorerTransformer.streamTxResponseToTxs(response),
    operation: StreamOperation.Insert,
  })
}
