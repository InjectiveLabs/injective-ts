import type * as InjectiveRfqGwRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_gw_rpc_pb'
import type { RFQSettlementUnfilledActionType } from './rfq.js'

export interface RFQGwPrepareAutoSignRequestType {
  cid?: string
  margin: string
  expiry?: number
  clientId: string
  marketId: string
  quantity: string
  direction: string
  simulate?: boolean
  worstPrice: string
  takerAddress?: string
  autosignPubKey: string
  autosignAddress: string
  subaccountNonce?: number
  quotesWaitTimeMs?: number
  autosignAccountNumber?: number
  feePayerAccountNumber?: number
  autosignAccountSequence?: number
  feePayerAccountSequence?: number
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

export interface RFQGwPrepareAutoSignResponseType {
  rfqId: number
  tx: Uint8Array
  feePayer: string
  signMode: string
  pubKeyType: string
  feePayerSig: string
  quotesWaitMs: number
  expiredQuotesCount: number
  autosignAccountNumber: number
  feePayerAccountNumber: number
  autosignAccountSequence: number
  feePayerAccountSequence: number
  feePayerPubKey?: CosmosPubKeyType
  quotes: RFQGwPrepareQuoteResultType[]
}

export interface RFQGwPrepareRequestType {
  cid?: string
  margin: string
  expiry?: number
  clientId: string
  marketId: string
  quantity: string
  direction: string
  simulate?: boolean
  worstPrice: string
  takerAddress: string
  takerPubKey: string
  subaccountNonce?: number
  quotesWaitTimeMs?: number
  takerAccountNumber?: number
  takerAccountSequence?: number
  feePayerAccountNumber?: number
  feePayerAccountSequence?: number
  unfilledAction?: RFQSettlementUnfilledActionType
}

export interface RFQGwPrepareResponseType {
  rfqId: number
  tx: Uint8Array
  feePayer: string
  signMode: string
  pubKeyType: string
  feePayerSig: string
  quotesWaitMs: number
  expiredQuotesCount: number
  takerAccountNumber: number
  takerAccountSequence: number
  feePayerAccountNumber: number
  feePayerAccountSequence: number
  feePayerPubKey?: CosmosPubKeyType
  quotes: RFQGwPrepareQuoteResultType[]
}

export interface RFQGwPrepareEip712RequestType {
  cid?: string
  gas?: number
  margin: string
  expiry?: number
  clientId: string
  marketId: string
  quantity: string
  direction: string
  simulate?: boolean
  worstPrice: string
  takerAddress: string
  takerPubKey: string
  ethChainId?: number
  eip712Wrapper?: string
  subaccountNonce?: number
  quotesWaitTimeMs?: number
  takerAccountNumber?: number
  takerAccountSequence?: number
  feePayerAccountNumber?: number
  feePayerAccountSequence?: number
  unfilledAction?: RFQSettlementUnfilledActionType
}

export interface RFQGwPrepareEip712ResponseType {
  rfqId: number
  data: string
  feePayer: string
  signMode: string
  pubKeyType: string
  feePayerSig: string
  quotesWaitMs: number
  expiredQuotesCount: number
  takerAccountNumber: number
  takerAccountSequence: number
  feePayerPubKey?: CosmosPubKeyType
  quotes: RFQGwPrepareQuoteResultType[]
}

export interface RFQGwPrepareEip712AutoSignRequestType {
  cid?: string
  gas?: number
  margin: string
  expiry?: number
  clientId: string
  marketId: string
  quantity: string
  direction: string
  simulate?: boolean
  worstPrice: string
  takerAddress?: string
  ethChainId?: number
  autosignPubKey: string
  eip712Wrapper?: string
  autosignAddress: string
  subaccountNonce?: number
  quotesWaitTimeMs?: number
  autosignAccountNumber?: number
  feePayerAccountNumber?: number
  autosignAccountSequence?: number
  feePayerAccountSequence?: number
  unfilledAction?: RFQSettlementUnfilledActionType
}

export interface RFQGwPrepareEip712AutoSignResponseType {
  rfqId: number
  data: string
  feePayer: string
  signMode: string
  pubKeyType: string
  feePayerSig: string
  quotesWaitMs: number
  expiredQuotesCount: number
  autosignAccountNumber: number
  autosignAccountSequence: number
  feePayerPubKey?: CosmosPubKeyType
  quotes: RFQGwPrepareQuoteResultType[]
}

export type GrpcCosmosPubKey = InjectiveRfqGwRpcPb.CosmosPubKey
export type GrpcRFQGwPrepareRequest =
  InjectiveRfqGwRpcPb.RFQGwPrepareRequestType
export type GrpcRFQGwPrepareResponse = InjectiveRfqGwRpcPb.PrepareResponse
export type GrpcRFQGwPrepareQuoteResult =
  InjectiveRfqGwRpcPb.RFQGwPrepareQuoteResult
export type GrpcRFQGwPrepareAutoSignResponse =
  InjectiveRfqGwRpcPb.PrepareAutoSignResponse
export type GrpcRFQGwPrepareAutoSignRequest =
  InjectiveRfqGwRpcPb.RFQGwPrepareAutoSignRequestType
export type GrpcRFQGwPrepareEip712Request =
  InjectiveRfqGwRpcPb.RFQGwPrepareEip712RequestType
export type GrpcRFQGwPrepareEip712Response =
  InjectiveRfqGwRpcPb.PrepareEip712Response
export type GrpcRFQGwPrepareEip712AutoSignRequest =
  InjectiveRfqGwRpcPb.RFQGwPrepareEip712AutoSignRequestType
export type GrpcRFQGwPrepareEip712AutoSignResponse =
  InjectiveRfqGwRpcPb.PrepareEip712AutoSignResponse
