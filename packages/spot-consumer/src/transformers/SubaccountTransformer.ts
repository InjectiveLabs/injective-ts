import {
  GrpcCosmosCoin,
  GrpcSubaccountBalance,
  GrpcSubaccountBalanceTransfer,
  GrpcSubaccountDeposit,
  TransferType,
  UiCoin,
  UiSubaccountBalance,
  UiSubaccountDeposit,
  UiSubaccountTransfer,
} from '../types'

export class SubaccountTransformer {
  static amountToUiAmount(amount: GrpcCosmosCoin): UiCoin {
    return {
      amount: amount.getAmount(),
      denom: amount.getDenom(),
    }
  }

  static depositToUiDeposit(
    deposit: GrpcSubaccountDeposit,
  ): UiSubaccountDeposit {
    return {
      totalBalance: deposit.getTotalBalance(),
      availableBalance: deposit.getAvailableBalance(),
    }
  }

  static balanceToUiBalance(
    balance: GrpcSubaccountBalance,
  ): UiSubaccountBalance {
    const deposit = balance.getDeposit()

    return {
      subaccountId: balance.getSubaccountId(),
      accountAddress: balance.getAccountAddress(),
      denom: balance.getDenom(),
      deposit: deposit
        ? SubaccountTransformer.depositToUiDeposit(deposit)
        : undefined,
    }
  }

  static balancesToUiBalances(
    balances: GrpcSubaccountBalance[],
  ): UiSubaccountBalance[] {
    return balances.map((balance) =>
      SubaccountTransformer.balanceToUiBalance(balance),
    )
  }

  static transferHistoryEntryToUiTransferHistoryEntry(
    transfer: GrpcSubaccountBalanceTransfer,
  ): UiSubaccountTransfer {
    const amount = transfer.getAmount()

    return {
      transferType: transfer.getTransferType() as TransferType,
      srcSubaccountId: transfer.getSrcSubaccountId(),
      srcAccountAddress: transfer.getSrcAccountAddress(),
      dstSubaccountId: transfer.getDstSubaccountId(),
      dstAccountAddress: transfer.getDstAccountAddress(),
      executedAt: transfer.getExecutedAt(),
      amount: amount
        ? SubaccountTransformer.amountToUiAmount(amount)
        : undefined,
    }
  }

  static transferHistoryToUiTransferHistory(
    transfers: GrpcSubaccountBalanceTransfer[],
  ): UiSubaccountTransfer[] {
    return transfers.map((transfer) =>
      SubaccountTransformer.transferHistoryEntryToUiTransferHistoryEntry(
        transfer,
      ),
    )
  }
}
