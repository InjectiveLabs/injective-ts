import { AccountGrpcTransformer } from './AccountGrpcTransformer'
import { StreamSubaccountBalanceResponse } from '@injectivelabs/exchange-api/injective_accounts_rpc_pb'
import { StreamOperation } from '../../../types'

export class AccountStreamTransformer {
  static balanceStreamCallback = (
    response: StreamSubaccountBalanceResponse,
  ) => {
    const balance = response.getBalance()

    return {
      balance: balance
        ? AccountGrpcTransformer.grpcBalanceToBalance(balance)
        : undefined,
      operation: StreamOperation.Update,
      timestamp: response.getTimestamp(),
    }
  }
}
