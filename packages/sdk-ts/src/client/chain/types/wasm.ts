import { Pagination } from './../../../types/pagination'
import {
  CosmwasmWasmV1Query,
  CosmwasmWasmV1Types,
} from '@injectivelabs/core-proto-ts'

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

export interface ContractInfo {
  codeId: number
  creator: string
  admin: string
  label: string
  created?: AbsoluteTxPosition
  ibcPortId: string
  extension?: GoogleProtoBufAny
}

export interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  total_supply: string
  mint: string
}

export interface MarketingInfo {
  project: string
  description: string
  logo: { url: string }
  marketing: string
}

export interface ContractAccountsBalanceWithPagination {
  tokenInfo: TokenInfo
  contractInfo: ContractInfo
  marketingInfo: MarketingInfo
  contractAccountsBalance: ContractAccountBalance[]
  pagination?: Pagination
}

export interface ContractStateWithPagination {
  tokenInfo: TokenInfo
  contractInfo: ContractInfo
  marketingInfo: MarketingInfo
  contractAccountsBalance: ContractAccountBalance[]
  pagination?: Pagination
}

export interface AbsoluteTxPosition {
  blockHeight: number
  txIndex: number
}

export interface ContractCodeHistoryEntry {
  operation: CosmwasmWasmV1Types.ContractCodeHistoryOperationType
  codeId: number
  updated?: AbsoluteTxPosition
  msg: Uint8Array | string
}

export interface CodeInfoResponse {
  codeId: number
  creator: string
  dataHash: Uint8Array | string
}

export type GrpcCodeInfoResponse = CosmwasmWasmV1Query.CodeInfoResponse
export type grpcContractInfo = CosmwasmWasmV1Types.ContractInfo
export type GrpcContractInfo = CosmwasmWasmV1Types.ContractInfo
export type GrpcContractCodeHistoryEntry =
  CosmwasmWasmV1Types.ContractCodeHistoryEntry
export type GrpcAbsoluteTxPosition = CosmwasmWasmV1Types.AbsoluteTxPosition

export type ContractCodeHistoryOperationType =
  CosmwasmWasmV1Types.ContractCodeHistoryOperationType
export const ContractCodeHistoryOperationTypeMap =
  CosmwasmWasmV1Types.ContractCodeHistoryOperationType
