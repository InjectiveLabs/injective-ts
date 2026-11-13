import type { RequestOptions } from '@injectivelabs/utils'
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
  /** Cancels subscription readiness, the pending wait and the socket. */
  signal?: AbortSignal
}

export type TxInclusionRequestExceptionFactory = (
  error: Error,
  contextModule: string,
) => Error

export interface PrepareTxInclusionWaiterArgs {
  txHash: string
  timeout: number
  options?: TxClientInclusionOptions
  signal?: AbortSignal
  abortSignal?: AbortSignal
  requestOptions?: RequestOptions
  /** Client-wide cancellation constraint. */
  clientSignal?: AbortSignal
  /** Releases an owned client scope when the waiter aborts, closes or settles. */
  disposeClientSignal?: () => void
  fetchTx: (txHash: string, options?: RequestOptions) => Promise<TxResponse>
  fetchTxPoll: (
    args: TxFetchTxPollArgs & { timeout: number },
    options?: RequestOptions,
  ) => Promise<TxResponse>
  createRequestException: TxInclusionRequestExceptionFactory
}

export interface TxSafeFetchArgs {
  txHash: string
  delay?: number
  abortSignal?: AbortSignal
  signal?: AbortSignal
}

export interface TxFetchDualArgs {
  txHash: string
  deadline: number
  abortSignal?: AbortSignal
  signal?: AbortSignal
}

export interface WaitTxBroadcastedOptions extends RequestOptions {
  endpoints: { grpc?: string; rest: string }
  txTimeout?: number
  txInclusion?: TxClientInclusionOptions
  /** Existing-style alias composed with `signal`. */
  abortSignal?: AbortSignal
}

export type WaitTxBroadcastedArgs = WaitTxBroadcastedOptions
