import { StreamOperation } from '../../../types/index.js'
import { IndexerGrpcAccountTransformer } from './IndexerGrpcAccountTransformer.js'
import type { InjectiveAccountRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAccountStreamTransformer {
  static balanceStreamCallback = (
    response: InjectiveAccountRpc.StreamSubaccountBalanceResponse,
  ) => {
    const balance = response.balance

    return {
      balance: balance
        ? IndexerGrpcAccountTransformer.grpcBalanceToBalance(balance)
        : undefined,
      operation: StreamOperation.Update,
      timestamp: response.timestamp,
    }
  }
}
