/* eslint-disable camelcase */
import {
  BlockWithTxs as BaseBlockWithTxs,
  Transaction as BaseTransaction,
  ValidatorUptime,
} from './explorer'

export enum AccessTypeCode {
  AccessTypeUnspecified = 0,
  AccessTypeNobody = 1,
  AccessTypeOnlyAddress = 2,
  AccessTypeEverybody = 3,
}

export enum AccessType {
  AccessTypeUnspecified = 'Unspecified',
  AccessTypeNobody = 'Nobody',
  AccessTypeOnlyAddress = 'Only Address',
  AccessTypeEverybody = 'Everybody',
}

export interface Paging {
  from: number
  to: number
  total: number
}
export interface ExplorerApiResponse<T> {
  data: T
}

export interface ExplorerApiResponseWithPagination<T> {
  data: {
    paging: Paging
    data: T
  }
}

export interface TransactionFromExplorerApiResponse {
  id: string
  block_number: number
  block_timestamp: string
  signatures: Array<{
    pubkey: string
    address: string
    signature: string
    sequence: number
  }>
  tx_type: string
  hash: string
  code: number
  memo?: string
  data?: Uint8Array | string
  info: string
  gas_wanted: number
  gas_used: number
  gas_fee: {
    amount: {
      amount: string
      denom: string
    }[]
    gas_limit: number
    payer: string
    granter: string
  }
  events: Array<any> // TODO
  codespace: string
  messages: Array<{ value: any; type: string }> // TODO
}

export interface BlockFromExplorerApiResponse {
  height: number
  proposer: string
  moniker: string
  block_hash: string
  parent_hash: string
  num_pre_commits: number
  num_txs: number
  total_txs: number
  timestamp: string
  txs: TransactionFromExplorerApiResponse[]
}

export interface ExplorerTransactionApiResponse {
  paging: any
  data: TransactionFromExplorerApiResponse[]
}

export interface ExplorerBlockApiResponse {
  paging: any
  data: BlockFromExplorerApiResponse[]
}

export interface Message {
  type: string
  message: any
}

export interface ExplorerTransaction extends Omit<BaseTransaction, 'messages'> {
  memo: string
  messages: Message[]
  parsedMessages?: Message[]
}

export interface ExplorerBlockWithTxs extends Omit<BaseBlockWithTxs, 'txs'> {
  txs: ExplorerTransaction[]
}

export enum ValidatorUptimeStatus {
  Proposed = 'proposed',
  Signed = 'signed',
  Missed = 'missed',
}

export interface ValidatorUptimeFromExplorerApiResponse {
  block_number: number
  status: ValidatorUptimeStatus
}

export interface ExplorerValidatorUptime
  extends Omit<ValidatorUptime, 'status'> {
  status: ValidatorUptimeStatus
}

export interface CosmWasmPermission {
  access_type: AccessTypeCode
  address: string
}

export interface CosmWasmChecksum {
  algorithm: string
  hash: string
}

export interface WasmCodeExplorerApiResponse {
  checksum: CosmWasmChecksum
  code_id: number
  code_schema: string
  code_view: string
  contract_type: string
  created_at: number
  creator: string
  instantiates: number
  permission: CosmWasmPermission
  tx_hash: string
  version: string
}

export interface ContractExplorerApiResponse {
  label: string
  address: string
  tx_hash: string
  creator: string
  executes: number
  instantiated_at: number
  init_message: string
  last_executed_at: number
  funds?: number
  code_id: number
  admin?: string
  current_migrate_message: string
}

export interface ContractTransactionExplorerApiResponse {
  hash: string
  code: number
  block_number: number
  block_unix_timestamp: number
  gas_fee: {
    amount: [
      {
        amount: number
      },
    ]
  }
  messages: [
    {
      type: string
      value: {
        msg: {
          transfer: {
            amount: number
          }
        }
      }
    },
  ]
}

export interface CW20BalanceExplorerApiResponse {
  contract_address: string
  account: string
  balance: string
  updated_at: number
  cw20_metadata: {
    token_info: {
      name: string
      symbol: string
      decimals: number
      total_supply: string
    }
    marketing_info: {
      project?: string
      description?: string
      logo?: string
      marketing?: string
    }
  }
}

export { BaseTransaction }
