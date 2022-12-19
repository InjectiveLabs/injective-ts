import { BroadcastModeMap } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/service_pb'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'

export interface TxClientBroadcastOptions {
  mode: BroadcastModeMap[keyof BroadcastModeMap]
  timeout: number
}

export interface TxClientBroadcastResponse {
  height: number
  txHash: string
  codespace: string
  code: number
  data?: string
  rawLog: string
  logs?: any[]
  info?: string
  gasWanted: number
  gasUsed: number
  timestamp: string
  events?: any[]
}

export interface TxClientSimulateResponse {
  result: {
    data: Uint8Array | string
    log: string
    eventsList: any[]
  }
  gasInfo: {
    gasWanted: number
    gasUsed: number
  }
}

export interface TxConcreteApi {
  broadcast(
    txRaw: TxRaw,
    options?: TxClientBroadcastOptions,
  ): Promise<TxClientBroadcastResponse>
  broadcastBlock(txRaw: TxRaw): Promise<TxClientBroadcastResponse>
  fetchTx(txHash: string): Promise<TxClientBroadcastResponse | undefined>
  fetchTxPoll(txHash: string): Promise<TxClientBroadcastResponse | undefined>
  simulate(txRaw: TxRaw): Promise<TxClientSimulateResponse>
}

export enum TxClientMode {
  gRpc = 'grpc',
  rest = 'rest',
}
