import { BroadcastMode } from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/service'
import {
  SignDoc,
  TxRaw,
} from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/tx'
import { StdFee } from '@cosmjs/amino'
import { SignMode } from '@injectivelabs/core-proto-ts/cosmos/tx/signing/v1beta1/signing'

export interface TxClientBroadcastOptions {
  mode: BroadcastMode
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

export type MsgArg = {
  type: string
  message: any
}

export interface SignerDetails {
  pubKey: string // the pubKey of the signer of the transaction in base64
  sequence: number // the sequence (nonce) of the signer of the transaction
  accountNumber: number // the account number of the signer of the transaction
}

/** @type {CreateTransactionWithSignersArgs} */
export interface CreateTransactionWithSignersArgs {
  fee?: StdFee // the fee to include in the transaction
  memo?: string // the memo to include in the transaction
  chainId: string // the chain id of the chain that the transaction is going to be broadcasted to
  message: MsgArg | MsgArg[] // the message that should be packed into the transaction
  signers: SignerDetails | SignerDetails[] // the signers of the transaction
  signMode?: SignMode
  timeoutHeight?: number // the height at which the transaction should be considered invalid
}

/** @type {CreateTransactionArgs} */
export interface CreateTransactionArgs {
  fee?: StdFee // the fee to include in the transaction
  memo?: string // the memo to include in the transaction
  chainId: string // the chain id of the chain that the transaction is going to be broadcasted to
  message: MsgArg | MsgArg[] // the message that should be packed into the transaction
  pubKey: string // the pubKey of the signer of the transaction in base64
  sequence: number // the sequence (nonce) of the signer of the transaction
  accountNumber: number // the account number of the signer of the transaction
  signMode?: SignMode
  timeoutHeight?: number // the height at which the transaction should be considered invalid
}

/** @type {CreateTransactionResult} */
export interface CreateTransactionResult {
  txRaw: TxRaw // the Tx raw that was created
  signDoc: SignDoc // the SignDoc that was created - used for signing of the transaction
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
