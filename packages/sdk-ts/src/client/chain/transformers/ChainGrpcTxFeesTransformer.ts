import { TxFeesEipBaseFee, TxFeesModuleStateParams } from '../types/txFees.js'
import { InjectiveTxFeesV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcTxFeesTransformer {
  static moduleParamsResponseToModuleParams(
    response: InjectiveTxFeesV1Beta1Query.QueryParamsResponse,
  ): TxFeesModuleStateParams {
    const params = response.params!

    return {
      maxGasWantedPerTx: params.maxGasWantedPerTx,
      highGasTxThreshold: params.highGasTxThreshold,
      minGasPriceForHighGasTx: params.minGasPriceForHighGasTx,
      mempool1559Enabled: params.mempool1559Enabled,
      minGasPrice: params.minGasPrice,
      defaultBaseFeeMultiplier: params.defaultBaseFeeMultiplier,
      maxBaseFeeMultiplier: params.maxBaseFeeMultiplier,
      resetInterval: params.resetInterval,
      maxBlockChangeRate: params.maxBlockChangeRate,
      targetBlockSpacePercentRate: params.targetBlockSpacePercentRate,
      recheckFeeLowBaseFee: params.recheckFeeLowBaseFee,
      recheckFeeHighBaseFee: params.recheckFeeHighBaseFee,
      recheckFeeBaseFeeThresholdMultiplier:
        params.recheckFeeBaseFeeThresholdMultiplier,
    }
  }

  static eipBaseFeeResponseToEipBaseFee(
    response: InjectiveTxFeesV1Beta1Query.QueryEipBaseFeeResponse,
  ): TxFeesEipBaseFee {
    return {
      baseFee: response.baseFee?.baseFee,
    }
  }
}
