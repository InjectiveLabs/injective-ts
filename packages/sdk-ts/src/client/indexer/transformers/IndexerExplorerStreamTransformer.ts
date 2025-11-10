import { StreamOperation } from '../../../types/index.js'
import { IndexerGrpcExplorerTransformer } from './IndexerGrpcExplorerTransformer.js'
import type * as InjectiveExplorerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class ExplorerStreamTransformer {
  static blocksStreamCallback = (
    response: InjectiveExplorerRpcPb.StreamBlocksResponse,
  ) => ({
    block: IndexerGrpcExplorerTransformer.grpcBlockToBlock(response),
    operation: StreamOperation.Insert,
  })

  static blocksWithTxsStreamCallback = (
    response: InjectiveExplorerRpcPb.StreamBlocksResponse,
  ) => ({
    block: IndexerGrpcExplorerTransformer.grpcBlockToBlockWithTxs(response),
    operation: StreamOperation.Insert,
  })

  static transactionsStreamCallback = (
    response: InjectiveExplorerRpcPb.StreamTxsResponse,
  ) => ({
    block: IndexerGrpcExplorerTransformer.streamTxResponseToTxs(response),
    operation: StreamOperation.Insert,
  })
}
