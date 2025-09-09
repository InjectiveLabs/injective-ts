import type { AminoSignResponse } from '@cosmjs/amino'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import type {
  CosmosTxV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
} from '@injectivelabs/core-proto-ts'

export interface Coin {
  denom: string
  amount: string
}

export type StreamOperation =
  | 'insert'
  | 'delete'
  | 'replace'
  | 'update'
  | 'invalidate'

export const StreamOperation = {
  Insert: 'insert',
  Delete: 'delete',
  Replace: 'replace',
  Update: 'update',
  Invalidate: 'invalidate',
} as const

export type GrpcCoin = CosmosBaseV1Beta1Coin.Coin
export type TxRaw = CosmosTxV1Beta1Tx.TxRaw
export type SignDoc = CosmosTxV1Beta1Tx.SignDoc

export type { DirectSignResponse, AminoSignResponse }
