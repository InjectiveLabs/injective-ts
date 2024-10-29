import {
  CosmosTxV1Beta1Tx,
  CometCryptoV1Keys,
} from '@injectivelabs/core-proto-ts'

/* eslint-disable camelcase */
export interface RestSignerInfo {
  public_key: CometCryptoV1Keys.PublicKey | null
  mode_info: CosmosTxV1Beta1Tx.ModeInfo
  sequence: string
}

export interface RestAuthInfo {
  signer_infos: RestSignerInfo[]
  fee: CosmosTxV1Beta1Tx.Fee
}

export interface RestTxBody {
  messages: any[]
  memo: string
  timeout_height: string
}

export interface RestTx {
  body: RestTxBody
  auth_info: RestAuthInfo
  signatures: string[]
}

export interface RestTxLog {
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
  logs: RestTxLog[]
  info: string
  gas_wanted: string
  gas_used: string
  tx: RestTx
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
  logs: RestTxLog[]
  info: string
  tx: RestTx
  timestamp: string
}

export enum BroadcastMode {
  Sync = 'BROADCAST_MODE_SYNC',
  Async = 'BROADCAST_MODE_ASYNC',
  Block = 'BROADCAST_MODE_BLOCK',
}

export enum BroadcastModeKeplr {
  Sync = 'sync',
  Async = 'async',
  Block = 'block',
}

export interface TxResultResponse {
  tx: RestTx
  tx_response: TxInfoResponse
}

export interface TxResult {
  tx: RestTx
  txResponse: TxInfo
}

export interface TxSearchResult {
  pagination: any
  txs: TxInfo[]
}

export interface TxSearchResultParams {
  txs: RestTx[]
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
