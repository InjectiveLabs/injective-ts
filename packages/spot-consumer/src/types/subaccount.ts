import {
  SubaccountDeposit as GrpcSubaccountDeposit,
  SubaccountBalance as GrpcSubaccountBalance,
  SubaccountBalanceTransfer as GrpcSubaccountBalanceTransfer,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'

export interface Coin {
  denom: string
  amount: string
}

export enum TransferType {
  Internal = 'internal',
  External = 'external',
  Withdraw = 'withdraw',
  Deposit = 'deposit',
}

export interface SubaccountTransfer {
  transferType: TransferType
  srcSubaccountId: string
  srcAccountAddress: string
  dstSubaccountId: string
  dstAccountAddress: string
  amount?: Coin
  executedAt: string
}

export interface SubaccountDeposit {
  totalBalance: string
  availableBalance: string
}

export interface SubaccountBalance {
  subaccountId: string
  accountAddress: string
  denom: string
  deposit?: SubaccountDeposit
}

export {
  GrpcSubaccountDeposit,
  GrpcSubaccountBalance,
  GrpcSubaccountBalanceTransfer,
}
