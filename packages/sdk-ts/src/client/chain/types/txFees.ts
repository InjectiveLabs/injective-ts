import type * as InjectiveTxFeesV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/txfees/v1beta1/query_pb'
import type * as InjectiveTxFeesV1Beta1TxfeesPb from '@injectivelabs/core-proto-ts-v2/generated/injective/txfees/v1beta1/txfees_pb'

export interface TxFeesModuleStateParams {
  maxGasWantedPerTx: string
  highGasTxThreshold: string
  minGasPriceForHighGasTx: string
  mempool1559Enabled: boolean
  minGasPrice: string
  defaultBaseFeeMultiplier: string
  maxBaseFeeMultiplier: string
  resetInterval: string
  maxBlockChangeRate: string
  targetBlockSpacePercentRate: string
  recheckFeeLowBaseFee: string
  recheckFeeHighBaseFee: string
  recheckFeeBaseFeeThresholdMultiplier: string
}

export interface TxFeesEipBaseFee {
  baseFee?: string
}

export type GrpcTxFeesParams = InjectiveTxFeesV1Beta1TxfeesPb.Params
export type GrpcTxFeesEipBaseFee = InjectiveTxFeesV1Beta1QueryPb.EipBaseFee
