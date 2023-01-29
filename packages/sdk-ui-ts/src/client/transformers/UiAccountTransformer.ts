import { SubaccountBalance, SubaccountTransfer } from '@injectivelabs/sdk-ts'
import { UiSubaccountBalance } from '../types/account'

export class UiAccountTransformer {
  static accountBalanceToUiAccountBalance(
    balance: SubaccountBalance,
  ): UiSubaccountBalance {
    return {
      denom: balance.denom,
      totalBalance: balance.deposit ? balance.deposit.totalBalance : '0',
      availableBalance: balance.deposit
        ? balance.deposit.availableBalance
        : '0',
    }
  }

  static grpcAccountTransferToUiAccountTransfer(balance: SubaccountTransfer) {
    return {
      ...balance,
      amount: balance.amount!.amount,
      denom: balance.amount!.denom,
    }
  }
}
