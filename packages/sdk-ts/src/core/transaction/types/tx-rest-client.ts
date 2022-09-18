import { Fee, ModeInfo } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { PublicKey } from '@injectivelabs/chain-api/tendermint/crypto/keys_pb'

/* eslint-disable camelcase */
export interface SignerInfo {
  public_key: PublicKey | null
  mode_info: ModeInfo
  sequence: string
}

export interface AuthInfo {
  signer_infos: SignerInfo[]
  fee: Fee
}

export interface TxBody {
  messages: any[]
  memo: string
  timeout_height: string
}

export interface Tx {
  body: TxBody
  auth_info: AuthInfo
  signatures: string[]
}

export interface TxLog {
  msg_index: number
  log: string
  events: { type: string; attributes: { key: string; value: string }[] }[]
}

export interface TxInfoResponse {
  height: string
  txhash: string
  codespace: string
  code: number
  data: string
  raw_log: string
  logs: TxLog[]
  info: string
  gas_wanted: string
  gas_used: string
  tx: Tx
  timestamp: string
}

export interface TxInfo {
  height: string
  txhash: string
  codespace: string
  code: number
  data: string
  rawLog: string
  gasWanted: string
  gasUsed: string
  logs: TxLog[]
  info: string
  tx: Tx
  timestamp: string
}

export interface WaitResponse {
  height: number
  txhash: string
  raw_log: string
  gas_wanted: number
  gas_used: number
  logs: TxLog[]
  timestamp: string
}

export interface Wait {
  height: number
  txhash: string
  rawLog: string
  gasWanted: number
  gasUsed: number
  logs: TxLog[]
  timestamp: string
}

export interface Block extends Wait {
  info: string
  data: string
}

export interface SyncResponse {
  height: number
  txhash: string
  raw_log: string
}

export interface Sync {
  height: number
  txhash: string
  rawLog: string
}

export interface Async {
  height: number
  txhash: string
}

export interface AsyncResponse {
  height: number
  txhash: string
}

export interface TxSuccess {
  logs: TxLog[]
}

export interface TxError {
  code: number | string
  codespace?: string
}

export type TxBroadcastResult<
  B extends Wait | Block | Sync | Async,
  C extends TxSuccess | TxError | {},
> = B & C

export type WaitTxBroadcastResult = TxBroadcastResult<Wait, TxSuccess | TxError>
export type BlockTxBroadcastResult = TxBroadcastResult<
  Block,
  TxSuccess | TxError
>
export type SyncTxBroadcastResult = TxBroadcastResult<Sync, TxError | {}>
export type AsyncTxBroadcastResult = TxBroadcastResult<Async, {}>

export enum BroadcastMode {
  Sync = 'BROADCAST_MODE_SYNC',
  Async = 'BROADCAST_MODE_ASYNC',
  Block = 'BROADCAST_MODE_BLOCK',
}

export interface TxResultResponse {
  tx: Tx
  tx_response: TxInfoResponse
}

export interface TxResult {
  tx: Tx
  txResponse: TxInfo
}

export interface TxSearchResult {
  pagination: any
  txs: TxInfo[]
}

export interface TxSearchResultParams {
  txs: Tx
  tx_responses: TxInfo
  pagination: any
}

export interface SimulationResponse {
  gas_info: {
    gas_wanted: string
    gas_used: string
  }
  result: {
    data: string
    log: string
    events: { type: string; attributes: { key: string; value: string }[] }[]
  }
}

export interface TxSimulation {
  gasInfo: {
    gasWanted: string
    gasUsed: string
  }
  result: {
    data: string
    log: string
    events: { type: string; attributes: { key: string; value: string }[] }[]
  }
}
