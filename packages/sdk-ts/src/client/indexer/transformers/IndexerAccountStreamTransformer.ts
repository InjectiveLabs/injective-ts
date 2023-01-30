import { IndexerGrpcAccountTransformer } from './IndexerGrpcAccountTransformer'
import { StreamSubaccountBalanceResponse } from '@injectivelabs/indexer-proto-ts/injective_accounts_rpc'
import { StreamOperation } from '../../../types'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAccountStreamTransformer {
  static balanceStreamCallback = (
    response: StreamSubaccountBalanceResponse,
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
