import {
  SubaccountBalance,
  SubaccountTransfer,
} from '@injectivelabs/sdk-ts/dist/client/exchange/types/account'
import { UiSubaccountBalance, UiSubaccountTransfer } from '../types/account'

export const grpcAccountTransferToUiAccountTransfer = (
  balance: SubaccountTransfer,
): UiSubaccountTransfer => ({
  ...balance,
  amount: balance.amount!.amount,
  denom: balance.amount!.denom,
})

export const accountBalanceToUiAccountBalance = (
  balance: SubaccountBalance,
): UiSubaccountBalance => ({
  denom: balance.denom,
  totalBalance: balance.deposit ? balance.deposit.totalBalance : '0',
  availableBalance: balance.deposit ? balance.deposit.availableBalance : '0',
})

export class UiAccountTransformer {
  static accountBalanceToUiSubaccountBalance = accountBalanceToUiAccountBalance

  static grpcAccountTransferToUiAccountTransfer =
    grpcAccountTransferToUiAccountTransfer
}
