import { Msgs } from '@injectivelabs/sdk-ts'

export interface CosmosWalletSignTransactionArgs {
  gas: string
  memo: string
  address: string
  feePayer?: string
  message: Msgs | Msgs[]
}
