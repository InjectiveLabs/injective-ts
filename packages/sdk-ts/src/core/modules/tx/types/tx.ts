import { Msgs } from '../../msgs'
import { StdFee } from '@cosmjs/amino'
import {
  CosmosTxV1Beta1Tx,
  CosmosTxV1Beta1Service,
  CosmosTxSigningV1Beta1Signing,
  GoogleProtobufAny,
} from '@injectivelabs/core-proto-ts'

export interface TxClientBroadcastOptions {
  mode?: CosmosTxV1Beta1Service.BroadcastMode
  timeout?: number // timeout in ms
  txTimeout?: number // blocks to wait for tx to be included in a block
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
    txRaw: CosmosTxV1Beta1Tx.TxRaw,
    options?: TxClientBroadcastOptions,
  ): Promise<TxClientBroadcastResponse>
  broadcastBlock(
    txRaw: CosmosTxV1Beta1Tx.TxRaw,
  ): Promise<TxClientBroadcastResponse>
  fetchTx(txHash: string): Promise<TxClientBroadcastResponse | undefined>
  fetchTxPoll(txHash: string): Promise<TxClientBroadcastResponse | undefined>
  simulate(txRaw: CosmosTxV1Beta1Tx.TxRaw): Promise<TxClientSimulateResponse>
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
  pubKey: string | GoogleProtobufAny.Any // the pubKey of the signer of the transaction in base64 or protobuf Any
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
  signMode?: CosmosTxSigningV1Beta1Signing.SignMode
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
  signMode?: CosmosTxSigningV1Beta1Signing.SignMode
  timeoutHeight?: number // the height at which the transaction should be considered invalid
}

/** @type {CreateTransactionResult} */
export interface CreateTransactionResult {
  txRaw: CosmosTxV1Beta1Tx.TxRaw // the Tx raw that was created
  signDoc: CosmosTxV1Beta1Tx.SignDoc // the SignDoc that was created - used for signing of the transaction
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
