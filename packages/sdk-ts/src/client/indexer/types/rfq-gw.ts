import type * as InjectiveRfqGwRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_gw_rpc_pb'
import type { RFQSettlementUnfilledActionType } from '../types'

export interface RFQGwPrepareRequestType {
  cid?: string
  margin: string
  expiry?: number
  clientId: string
  marketId: string
  quantity: string
  direction: string
  worstPrice: string
  takerPubKey: string
  takerAddress: string
  subaccountNonce?: number
  quotesWaitTimeMs?: number
  takerAccountNumber?: number
  takerAccountSequence?: number
  unfilledAction?: RFQSettlementUnfilledActionType
}

export interface RFQGwPrepareEip712RequestType {
  cid?: string
  margin: string
  expiry?: number
  clientId: string
  marketId: string
  quantity: string
  direction: string
  worstPrice: string
  takerPubKey: string
  takerAddress: string
  subaccountNonce?: number
  quotesWaitTimeMs?: number
  takerAccountNumber?: number
  takerAccountSequence?: number
  unfilledAction?: RFQSettlementUnfilledActionType
}

export interface RFQGwPrepareAutoSignRequestType {
  cid?: string
  margin: string
  expiry?: number
  clientId: string
  marketId: string
  quantity: string
  direction: string
  worstPrice: string
  takerAddress?: string
  autosignPubKey: string
  autosignAddress: string
  subaccountNonce?: number
  quotesWaitTimeMs?: number
  autosignAccountNumber?: number
  autosignAccountSequence?: number
  unfilledAction?: RFQSettlementUnfilledActionType
}

export interface CosmosPubKeyType {
  key: string
  type: string
}

export interface RFQGwPrepareQuoteResultType {
  maker: string
  price: string
  margin: string
  quantity: string
}

export interface RFQGwPrepareResponseType {
  rfqId: number
  tx: Uint8Array
  feePayer: string
  signMode: string
  pubKeyType: string
  feePayerSig: string
  takerAccountNumber: number
  takerAccountSequence: number
  feePayerPubKey?: CosmosPubKeyType
  quotes: RFQGwPrepareQuoteResultType[]
}

export interface RFQGwPrepareEip712ResponseType {
  rfqId: number
  data: string
  feePayer: string
  signMode: string
  pubKeyType: string
  feePayerSig: string
  feePayerPubKey?: CosmosPubKeyType
  quotes: RFQGwPrepareQuoteResultType[]
}

export interface RFQGwPrepareAutoSignResponseType {
  rfqId: number
  tx: Uint8Array
  feePayer: string
  signMode: string
  pubKeyType: string
  feePayerSig: string
  quotesWaitMs: number
  autosignAccountNumber: number
  feePayerAccountNumber: number
  autosignAccountSequence: number
  feePayerAccountSequence: number
  feePayerPubKey?: CosmosPubKeyType
  quotes: RFQGwPrepareQuoteResultType[]
}

export type GrpcCosmosPubKey = InjectiveRfqGwRpcPb.CosmosPubKey
export type GrpcRFQGwPrepareResponse = InjectiveRfqGwRpcPb.PrepareResponse
export type GrpcRFQGwPrepareRequest =
  InjectiveRfqGwRpcPb.RFQGwPrepareRequestType
export type GrpcRFQGwPrepareQuoteResult =
  InjectiveRfqGwRpcPb.RFQGwPrepareQuoteResult
export type GrpcRFQGwPrepareAutoSignResponse =
  InjectiveRfqGwRpcPb.PrepareAutoSignResponse
export type GrpcRFQGwPrepareAutoSignRequest =
  InjectiveRfqGwRpcPb.RFQGwPrepareAutoSignRequestType
export type GrpcRFQGwPrepareEip712Response =
  InjectiveRfqGwRpcPb.PrepareEip712Response
export type GrpcRFQGwPrepareEip712Request =
  InjectiveRfqGwRpcPb.RFQGwPrepareEip712RequestType
