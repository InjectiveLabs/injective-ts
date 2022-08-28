import { ExchangeGrpcAccountTransformer } from './ExchangeGrpcAccountTransformer'
import { StreamSubaccountBalanceResponse } from '@injectivelabs/exchange-api/injective_accounts_rpc_pb'
import { StreamOperation } from '../../../types'

/**
 * @category Exchange Grpc Stream Transformer
 */
export class ExchangeAccountStreamTransformer {
  static balanceStreamCallback = (
    response: StreamSubaccountBalanceResponse,
  ) => {
    const balance = response.getBalance()

    return {
      balance: balance
        ? ExchangeGrpcAccountTransformer.grpcBalanceToBalance(balance)
        : undefined,
      operation: StreamOperation.Update,
      timestamp: response.getTimestamp(),
    }
  }
}
