import { GrpcSubaccountBalance } from '@injectivelabs/subaccount-consumer'
import { UiSubaccountBalance } from './types'
import { ZERO_TO_STRING } from '../constants'

export const grpcSubaccountBalanceToUiSubaccountBalance = (
  balance: GrpcSubaccountBalance,
): UiSubaccountBalance => {
  const deposit = balance.getDeposit()

  return {
    denom: balance.getDenom(),
    totalBalance: deposit ? deposit.getTotalBalance() : ZERO_TO_STRING,
    availableBalance: deposit ? deposit.getAvailableBalance() : ZERO_TO_STRING,
  }
}

export class SubaccountTransformer {
  static grpcSubaccountBalanceToUiSubaccountBalance =
    grpcSubaccountBalanceToUiSubaccountBalance
}
