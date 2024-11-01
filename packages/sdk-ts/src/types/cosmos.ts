import { DirectSignResponse } from '@cosmjs/proto-signing'
import { AminoSignResponse } from '@cosmjs/amino'
import {
  CosmosTxV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
} from '@injectivelabs/core-proto-ts'

export interface Coin {
  denom: string
  amount: string
}

export enum StreamOperation {
  Insert = 'insert',
  Delete = 'delete',
  Replace = 'replace',
  Update = 'update',
  Invalidate = 'invalidate',
}

export type GrpcCoin = CosmosBaseV1Beta1Coin.Coin
export type TxRaw = CosmosTxV1Beta1Tx.TxRaw
export type SignDoc = CosmosTxV1Beta1Tx.SignDoc

export { DirectSignResponse, AminoSignResponse }
