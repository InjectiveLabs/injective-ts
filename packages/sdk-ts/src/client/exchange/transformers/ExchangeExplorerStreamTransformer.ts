import { ExchangeGrpcExplorerTransformer } from './ExchangeGrpcExplorerTransformer'
import { StreamOperation } from '../../../types'
import {
  StreamBlocksResponse,
  StreamTxsResponse,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'

/**
 * @category Exchange Grpc Stream Transformer
 */
export class ExplorerStreamTransformer {
  static blocksStreamCallback = (response: StreamBlocksResponse) => ({
    block: ExchangeGrpcExplorerTransformer.grpcBlockToBlock(response),
    operation: StreamOperation.Insert,
  })

  static blocksWithTxsStreamCallback = (response: StreamBlocksResponse) => ({
    block: ExchangeGrpcExplorerTransformer.grpcBlockToBlockWithTxs(response),
    operation: StreamOperation.Insert,
  })

  static transactionsStreamCallback = (response: StreamTxsResponse) => ({
    block:
      ExchangeGrpcExplorerTransformer.grpcTransactionToTransaction(response),
    operation: StreamOperation.Insert,
  })
}
