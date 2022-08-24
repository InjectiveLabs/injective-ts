import { IndexerGrpcAccountTransformer } from './IndexerGrpcAccountTransformer'
import { StreamSubaccountBalanceResponse } from '@injectivelabs/indexer-api/injective_accounts_rpc_pb'
import { StreamOperation } from '../../../types'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAccountStreamTransformer {
  static balanceStreamCallback = (
    response: StreamSubaccountBalanceResponse,
  ) => {
    const balance = response.getBalance()

    return {
      balance: balance
        ? IndexerGrpcAccountTransformer.grpcBalanceToBalance(balance)
        : undefined,
      operation: StreamOperation.Update,
      timestamp: response.getTimestamp(),
    }
  }
}
