import type { StdFee } from '@cosmjs/amino'
import type { RequestOptions } from '@injectivelabs/utils'
import type * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import type * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import type * as CosmosTxV1Beta1ServicePb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/service_pb'
import type * as CosmosTxSigningV1Beta1SigningPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/signing/v1beta1/signing_pb'
import type { Msgs } from '../../modules/msgs.js'

export type TxEventWebSocketFactory = (endpoint: string) => WebSocket

export const TxInclusionStrategy = {
  Poll: 'poll',
  TendermintEvent: 'tendermint-event',
  TendermintEventAndPoll: 'tendermint-event-and-poll',
} as const

export type TxInclusionStrategy =
  (typeof TxInclusionStrategy)[keyof typeof TxInclusionStrategy]

export interface TxEventInclusionOptions {
  rpcEndpoint?: string
  timeout?: number
  fallbackToPolling?: boolean
  webSocketFactory?: TxEventWebSocketFactory
  onFallback?: (error: Error) => void
  /** Cancels the Tendermint event subscription and its pending wait. */
  signal?: AbortSignal
}

export interface TxClientInclusionOptions {
  inclusionStrategy?: TxInclusionStrategy
  pollingInterval?: number
  eventInclusion?: TxEventInclusionOptions
  /**
   * Cancels inclusion observation (event subscription, polling and the final
   * transaction fetch). It is observation-only and does not cancel signing or
   * the broadcast request itself.
   */
  signal?: AbortSignal
  /** Existing-style alias composed with `signal`. */
  abortSignal?: AbortSignal
}

export interface TxInclusionWaiter {
  txHash: string
  inclusionStrategy: TxInclusionStrategy
  close: () => void
  wait: (txHash?: string) => Promise<TxClientBroadcastResponse | undefined>
}

export interface TxFetchTxPollArgs {
  txHash: string
  timeout?: number
  pollingInterval?: number
  /** Existing cancellation field, kept for backwards compatibility. */
  abortSignal?: AbortSignal
  /** Alias composed with `abortSignal`. */
  signal?: AbortSignal
}

export interface TxWaitForTxInclusionArgs {
  txHash: string
  timeout?: number
  options?: TxClientInclusionOptions
  signal?: AbortSignal
  abortSignal?: AbortSignal
}

export interface TxPrepareTxInclusionWaitArgs {
  txHash: string
  timeout?: number
  options?: TxClientInclusionOptions
  signal?: AbortSignal
  abortSignal?: AbortSignal
}

export interface TxClientBroadcastOptions extends TxClientInclusionOptions {
  mode?: CosmosTxV1Beta1ServicePb.BroadcastMode
  timeout?: number // timeout in ms
  txTimeout?: number // blocks to wait for tx to be included in a block
  onBroadcast?: (txHash: string) => void // called after broadcast, before inclusion detection
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
    txRaw: CosmosTxV1Beta1TxPb.TxRaw,
    options?: TxClientBroadcastOptions,
    requestOptions?: RequestOptions,
  ): Promise<TxClientBroadcastResponse>
  broadcastBlock(
    txRaw: CosmosTxV1Beta1TxPb.TxRaw,
  ): Promise<TxClientBroadcastResponse>
  /**
   * Common cancellation shape: keep the optional positional params/placeholder
   * second and append `RequestOptions` third. This deliberately does not
   * inspect the second argument to guess whether it is a params dictionary or
   * request options (REST treats it as query data). Direct gRPC callers also
   * have a concrete second-`RequestOptions` convenience overload.
   */
  fetchTx(
    txHash: string,
    params?: unknown,
    options?: RequestOptions,
  ): Promise<TxClientBroadcastResponse | undefined>
  fetchTxPoll(
    args: TxFetchTxPollArgs,
    options?: RequestOptions,
  ): Promise<TxClientBroadcastResponse | undefined>
  waitForTxInclusion(
    args: TxWaitForTxInclusionArgs,
    options?: RequestOptions,
  ): Promise<TxClientBroadcastResponse | undefined>
  prepareTxInclusionWait(
    args: TxPrepareTxInclusionWaitArgs,
    options?: RequestOptions,
  ): Promise<TxInclusionWaiter>
  simulate(
    txRaw: CosmosTxV1Beta1TxPb.TxRaw,
    options?: RequestOptions,
  ): Promise<TxClientSimulateResponse>
}

export const TxClientMode = {
  gRpc: 'grpc',
  rest: 'rest',
} as const

export type TxClientMode = (typeof TxClientMode)[keyof typeof TxClientMode]

export type MsgArg = {
  type: string
  message: any
}

export interface SignerDetails {
  pubKey: string | GoogleProtobufAnyPb.Any // the pubKey of the signer of the transaction in base64 or protobuf Any
  sequence: number // the sequence (nonce) of the signer of the transaction
  accountNumber: number // the account number of the signer of the transaction
}

/** @type {CreateTransactionWithSignersArgs} */
export interface CreateTransactionWithSignersArgs {
  fee?: StdFee | string // the fee to include in the transaction
  memo?: string // the memo to include in the transaction
  chainId: string // the chain id of the chain that the transaction is going to be broadcasted to
  message: Msgs | Msgs[] // the message that should be packed into the transaction
  signers: SignerDetails | SignerDetails[] // the signers of the transaction
  signMode?: CosmosTxSigningV1Beta1SigningPb.SignMode
  timeoutHeight?: number // the height at which the transaction should be considered invalid
}

/** @type {CreateTransactionArgs} */
export interface CreateTransactionArgs {
  fee?: StdFee // the fee to include in the transaction
  memo?: string // the memo to include in the transaction
  chainId: string // the chain id of the chain that the transaction is going to be broadcasted to
  message: Msgs | Msgs[] // the message that should be packed into the transaction
  pubKey: string // the pubKey of the signer of the transaction in base64
  sequence: number // the sequence (nonce) of the signer of the transaction
  accountNumber: number // the account number of the signer of the transaction
  signMode?: CosmosTxSigningV1Beta1SigningPb.SignMode
  timeoutHeight?: number // the height at which the transaction should be considered invalid
}

/** @type {CreateTransactionResult} */
export interface CreateTransactionResult {
  txRaw: CosmosTxV1Beta1TxPb.TxRaw // the Tx raw that was created
  signDoc: CosmosTxV1Beta1TxPb.SignDoc // the SignDoc that was created - used for signing of the transaction
  bodyBytes: Uint8Array // the body bytes of the transaction
  signers: SignerDetails | SignerDetails[] // the signers of the transaction
  signer: SignerDetails // the signer of the transaction
  authInfoBytes: Uint8Array // the auth info bytes of the transaction
  signBytes: Uint8Array // the sign bytes of the transaction (SignDoc serialized to binary)
  signHashedBytes: Uint8Array // the sign bytes of the transaction (SignDoc serialized to binary) and hashed using keccak256
}
export interface TxResponse {
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
