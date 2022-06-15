import { ContractInfo as grpcContractInfo } from '@injectivelabs/chain-api/cosmwasm/wasm/v1/types_pb'
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

export { grpcContractInfo }
