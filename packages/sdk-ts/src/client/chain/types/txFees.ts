import type {
  InjectiveTxFeesV1Beta1Txfees,
  InjectiveTxFeesV1Beta1Query,
} from '@injectivelabs/core-proto-ts'

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

export type GrpcTxFeesParams = InjectiveTxFeesV1Beta1Txfees.Params
export type GrpcTxFeesEipBaseFee = InjectiveTxFeesV1Beta1Query.EipBaseFee
