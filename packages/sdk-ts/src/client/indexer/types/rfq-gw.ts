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
  autosignAccountNumber: number
  feePayerAccountNumber: number
  autosignAccountSequence: number
  feePayerAccountSequence: number
  feePayerPubKey?: CosmosPubKeyType
  quotes: RFQGwPrepareQuoteResultType[]
}

export type GrpcCosmosPubKey = InjectiveRfqGwRpcPb.CosmosPubKey
export type GrpcRFQGwPrepareQuoteResult =
  InjectiveRfqGwRpcPb.RFQGwPrepareQuoteResult
export type GrpcRFQGwPrepareAutoSignResponse =
  InjectiveRfqGwRpcPb.PrepareAutoSignResponse
export type GrpcRFQGwPrepareAutoSignRequest =
  InjectiveRfqGwRpcPb.RFQGwPrepareAutoSignRequestType
