/* eslint-disable camelcase */
import {
  BlockWithTxs as BaseBlockWithTxs,
  Transaction as BaseTransaction,
  ValidatorUptime,
} from './explorer'

export interface ExplorerApiResponse<T> {
  data: {
    paging: any
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

export interface Transaction extends Omit<BaseTransaction, 'messages'> {
  memo: string
  messages: Message[]
  parsedMessages?: Message[]
}

export type TransactionListItem = {
  key: number
  list: Transaction[]
}

export interface BlockWithTxs extends Omit<BaseBlockWithTxs, 'txs'> {
  txs: Transaction[]
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

export { BaseTransaction }
