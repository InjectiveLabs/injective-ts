import { ChainId } from '@injectivelabs/ts-types'
import { ContractEventArg } from 'ethereum-types'
import { DepositManager } from '@injectivelabs/web3-contract-typings/types/DepositManager'
import { Peggy } from '@injectivelabs/web3-contract-typings/types/Peggy'
import { BaseCurrency } from '@injectivelabs/web3-contract-typings/types/BaseCurrency'
import { InjectiveFutures } from '@injectivelabs/web3-contract-typings/types/InjectiveFutures'

export interface ChainIdContractAddresses {
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

export interface EventFilters {
  [index: string]: ContractEventArg
}

export type InjectiveContracts =
  | DepositManager
  | Peggy
  | BaseCurrency
  | InjectiveFutures
