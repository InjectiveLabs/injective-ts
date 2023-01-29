import {
  ContractInfo as grpcContractInfo,
  ContractInfo as GrpcContractInfo,
  ContractCodeHistoryEntry as GrpcContractCodeHistoryEntry,
  ContractCodeHistoryOperationType,
  AbsoluteTxPosition as GrpcAbsoluteTxPosition,
} from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/types'
import { CodeInfoResponse as GrpcCodeInfoResponse } from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/query'
import { Pagination } from './../../../types/pagination'

export interface AbsoluteTxPosition {
  blockHeight: number
  txIndex: number
}

export interface GoogleProtoBufAny {
  typeUrl: string
  value: Uint8Array | string
}

export interface ContractAccountBalance {
  account: string
  balance: string
}

export interface ContractAccountsBalanceWithPagination {
  contractAccountsBalance: ContractAccountBalance[]
  pagination?: Pagination
}

export interface ContractInfo {
  codeId: number
  creator: string
  admin: string
  label: string
  created?: AbsoluteTxPosition
  ibcPortId: string
  extension?: GoogleProtoBufAny
}

export interface AbsoluteTxPosition {
  blockHeight: number
  txIndex: number
}

export interface ContractCodeHistoryEntry {
  operation: ContractCodeHistoryOperationType
  codeId: number
  updated?: AbsoluteTxPosition
  msg: Uint8Array | string
}

export interface CodeInfoResponse {
  codeId: number
  creator: string
  dataHash: Uint8Array | string
}

export {
  grpcContractInfo,
  GrpcContractInfo,
  GrpcContractCodeHistoryEntry,
  GrpcAbsoluteTxPosition,
  ContractCodeHistoryOperationType,
  GrpcCodeInfoResponse,
}
