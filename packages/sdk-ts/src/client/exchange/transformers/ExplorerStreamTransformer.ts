import { ExplorerGrpcTransformer } from './ExplorerGrpcTransformer'
import { StreamOperation } from '../../../types'
import {
  StreamBlocksResponse,
  StreamTxsResponse,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'

export class ExplorerStreamTransformer {
  static blocksStreamCallback = (response: StreamBlocksResponse) => ({
    block: ExplorerGrpcTransformer.grpcBlockToBlock(response),
    operation: StreamOperation.Insert,
  })

  static blocksWithTxsStreamCallback = (response: StreamBlocksResponse) => ({
    block: ExplorerGrpcTransformer.grpcBlockToBlockWithTxs(response),
    operation: StreamOperation.Insert,
  })

  static transactionsStreamCallback = (response: StreamTxsResponse) => ({
    block: ExplorerGrpcTransformer.grpcTransactionToTransaction(response),
    operation: StreamOperation.Insert,
  })
}
