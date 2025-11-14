import type { Coin } from '@injectivelabs/ts-types'
import type * as CosmosBankV1Beta1BankPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/bank_pb'

export interface BankModuleParams {
  sendEnabledList: Array<SendEnabled>
  defaultSendEnabled: boolean
}

export interface TotalSupply extends Array<Coin> {
  //
}

export type GrpcSupply = CosmosBankV1Beta1BankPb.Supply
export type GrpcBankParams = CosmosBankV1Beta1BankPb.Params
export type SendEnabled = CosmosBankV1Beta1BankPb.SendEnabled
export type Metadata = CosmosBankV1Beta1BankPb.Metadata
