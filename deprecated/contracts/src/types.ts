import { EthereumChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { ContractErrorModule } from '@injectivelabs/exceptions'

export interface ContractAddresses {
  peggy: string
  injective: string
}

export type ContractAddressesForChainId = Record<
  EthereumChainId,
  ContractAddresses
>
export type ContractAddressesForNetwork = Record<Network, ContractAddresses>

export interface ContractFunctionObj<T> {
  callAsync(): Promise<T>
  getABIEncodedTransactionData(): string
}

export interface ContractTxFunctionObj<T> extends ContractFunctionObj<T> {
  sendTransactionAsync(): Promise<string>
  estimateGasAsync(): Promise<number>
}

export const Contract = {
  ...ContractErrorModule,
}
