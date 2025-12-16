import type { AminoSignResponse } from '@cosmjs/amino'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import type * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import type * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'

export interface Coin {
  denom: string
  amount: string
}

export type TxRaw = CosmosTxV1Beta1TxPb.TxRaw
export type SignDoc = CosmosTxV1Beta1TxPb.SignDoc
export type GrpcCoin = CosmosBaseV1Beta1CoinPb.Coin

export type { DirectSignResponse, AminoSignResponse }
