import { StreamOperation } from '../../../types/index.js'
import { IndexerGrpcAccountTransformer } from './IndexerGrpcAccountTransformer.js'
import type * as InjectiveAccountsRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerAccountStreamTransformer {
  static balanceStreamCallback = (
    response: InjectiveAccountsRpcPb.StreamSubaccountBalanceResponse,
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
