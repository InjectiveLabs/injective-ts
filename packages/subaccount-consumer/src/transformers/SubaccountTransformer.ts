import { Coin } from '@injectivelabs/ts-types'
import {
  GrpcCosmosCoin,
  GrpcSubaccountBalance,
  GrpcSubaccountBalanceTransfer,
  GrpcSubaccountDeposit,
  TransferType,
  SubaccountBalance,
  SubaccountDeposit,
  SubaccountTransfer,
} from '../types'

export class SubaccountTransformer {
  static grpcAmountToAmount(amount: GrpcCosmosCoin): Coin {
    return {
      amount: amount.getAmount(),
      denom: amount.getDenom(),
    }
  }

  static grpcDepositToDeposit(
    deposit: GrpcSubaccountDeposit,
  ): SubaccountDeposit {
    return {
      totalBalance: deposit.getTotalBalance(),
      availableBalance: deposit.getAvailableBalance(),
    }
  }

  static grpcBalanceToBalance(
    balance: GrpcSubaccountBalance,
  ): SubaccountBalance {
    const deposit = balance.getDeposit()

    return {
      subaccountId: balance.getSubaccountId(),
      accountAddress: balance.getAccountAddress(),
      denom: balance.getDenom(),
      deposit: deposit
        ? SubaccountTransformer.grpcDepositToDeposit(deposit)
        : undefined,
    }
  }

  static grpcBalancesToBalances(
    balances: GrpcSubaccountBalance[],
  ): SubaccountBalance[] {
    return balances.map((balance) =>
      SubaccountTransformer.grpcBalanceToBalance(balance),
    )
  }

  static grpcTransferHistoryEntryToTransferHistoryEntry(
    transfer: GrpcSubaccountBalanceTransfer,
  ): SubaccountTransfer {
    const amount = transfer.getAmount()

    return {
      transferType: transfer.getTransferType() as TransferType,
      srcSubaccountId: transfer.getSrcSubaccountId(),
      srcSubaccountAddress: transfer.getSrcAccountAddress(),
      dstSubaccountId: transfer.getDstSubaccountId(),
      dstSubaccountAddress: transfer.getDstAccountAddress(),
      executedAt: transfer.getExecutedAt(),
      amount: amount
        ? SubaccountTransformer.grpcAmountToAmount(amount)
        : undefined,
    }
  }

  static grpcTransferHistoryToTransferHistory(
    transfers: GrpcSubaccountBalanceTransfer[],
  ): SubaccountTransfer[] {
    return transfers.map((transfer) =>
      SubaccountTransformer.grpcTransferHistoryEntryToTransferHistoryEntry(
        transfer,
      ),
    )
  }
}
