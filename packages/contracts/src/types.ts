import { ChainId } from '@injectivelabs/ts-types'

export interface ChainIdContractAddresses {
  depositManager: string
  futures: string
  baseCurrency: string
  priceFeeder: string
  peggy: string
  injective: string
}

export type ContractAddresses = Record<ChainId, ChainIdContractAddresses>

export interface ContractFunctionObj<T> {
  callAsync(): Promise<T>
  getABIEncodedTransactionData(): string
}

export interface ContractTxFunctionObj<T> extends ContractFunctionObj<T> {
  sendTransactionAsync(): Promise<string>
  estimateGasAsync(): Promise<number>
}
