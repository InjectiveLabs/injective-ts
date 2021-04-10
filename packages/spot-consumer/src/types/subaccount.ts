import {
  SubaccountDeposit as GrpcSubaccountDeposit,
  SubaccountBalance as GrpcSubaccountBalance,
  SubaccountBalanceTransfer as GrpcSubaccountBalanceTransfer,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'

export interface UiCoin {
  denom: string
  amount: string
}

export enum TransferType {
  Internal = 'internal',
  External = 'external',
  Withdraw = 'withdraw',
  Deposit = 'deposit',
}

export interface UiSubaccountTransfer {
  transferType: TransferType
  srcSubaccountId: string
  srcAccountAddress: string
  dstSubaccountId: string
  dstAccountAddress: string
  amount?: UiCoin
  executedAt: string
}

export interface UiSubaccountDeposit {
  totalBalance: string
  availableBalance: string
}

export interface UiSubaccountBalance {
  subaccountId: string
  accountAddress: string
  denom: string
  deposit?: UiSubaccountDeposit
}

export {
  GrpcSubaccountDeposit,
  GrpcSubaccountBalance,
  GrpcSubaccountBalanceTransfer,
}
