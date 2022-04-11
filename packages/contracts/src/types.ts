import { ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'

export interface ContractAddresses {
  peggy: string
  injective: string
}

export type ContractAddressesForChainId = Record<ChainId, ContractAddresses>
export type ContractAddressesForNetwork = Record<Network, ContractAddresses>

export interface ContractFunctionObj<T> {
  callAsync(): Promise<T>
  getABIEncodedTransactionData(): string
}

export interface ContractTxFunctionObj<T> extends ContractFunctionObj<T> {
  sendTransactionAsync(): Promise<string>
  estimateGasAsync(): Promise<number>
}
