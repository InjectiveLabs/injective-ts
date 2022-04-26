import { AccountTransformer } from './AccountTransformer'
import { StreamSubaccountBalanceResponse } from './types'
import { StreamOperation } from '../../../types'

export class AccountStreamTransformer {
  static balanceStreamCallback = (
    response: StreamSubaccountBalanceResponse,
  ) => {
    const balance = response.getBalance()

    return {
      balance: balance
        ? AccountTransformer.grpcBalanceToBalance(balance)
        : undefined,
      operation: StreamOperation.Update,
      timestamp: response.getTimestamp(),
    }
  }
}
