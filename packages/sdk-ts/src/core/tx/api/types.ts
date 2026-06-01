import type {
  TxResponse,
  TxFetchTxPollArgs,
  TxEventWebSocketFactory,
  TxClientInclusionOptions,
  TxClientBroadcastResponse,
} from '../types/tx.js'

export interface TendermintTxEventSubscription {
  close: () => void
  wait: () => Promise<TxClientBroadcastResponse>
}

export interface SubscribeToTendermintTxEventArgs {
  txHash: string
  timeout: number
  endpoint: string
  webSocketFactory?: TxEventWebSocketFactory
}

export type TxInclusionRequestExceptionFactory = (
  error: Error,
  contextModule: string,
) => Error

export interface PrepareTxInclusionWaiterArgs {
  txHash: string
  timeout: number
  options?: TxClientInclusionOptions
  fetchTx: (txHash: string) => Promise<TxResponse>
  fetchTxPoll: (
    args: TxFetchTxPollArgs & { timeout: number },
  ) => Promise<TxResponse>
  createRequestException: TxInclusionRequestExceptionFactory
}
