import {
  Supply as GrpcSupply,
  Params as GrpcBankParams,
  SendEnabled,
} from '@injectivelabs/core-proto-ts/cosmos/bank/v1beta1/bank'
import { Coin } from '@injectivelabs/ts-types'

export interface BankModuleParams {
  sendEnabledList: Array<SendEnabled>
  defaultSendEnabled: boolean
}

export interface TotalSupply extends Array<Coin> {
  //
}

export { GrpcSupply, GrpcBankParams }
