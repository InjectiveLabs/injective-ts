import { TxFeesEipBaseFee, TxFeesModuleStateParams } from '../types/txFees.js'
import { denomAmountFromGrpcChainDenomAmount } from './../../../utils/numbers.js'
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
      minGasPrice: denomAmountFromGrpcChainDenomAmount(
        params.minGasPrice,
      ).toFixed(),
      defaultBaseFeeMultiplier: denomAmountFromGrpcChainDenomAmount(
        params.defaultBaseFeeMultiplier,
      ).toFixed(),
      maxBaseFeeMultiplier: denomAmountFromGrpcChainDenomAmount(
        params.maxBaseFeeMultiplier,
      ).toFixed(),
      resetInterval: params.resetInterval,
      maxBlockChangeRate: denomAmountFromGrpcChainDenomAmount(
        params.maxBlockChangeRate,
      ).toFixed(),
      targetBlockSpacePercentRate: denomAmountFromGrpcChainDenomAmount(
        params.targetBlockSpacePercentRate,
      ).toFixed(),
      recheckFeeLowBaseFee: denomAmountFromGrpcChainDenomAmount(
        params.recheckFeeLowBaseFee,
      ).toFixed(),
      recheckFeeHighBaseFee: denomAmountFromGrpcChainDenomAmount(
        params.recheckFeeHighBaseFee,
      ).toFixed(),
      recheckFeeBaseFeeThresholdMultiplier: denomAmountFromGrpcChainDenomAmount(
        params.recheckFeeBaseFeeThresholdMultiplier,
      ).toFixed(),
    }
  }

  static eipBaseFeeResponseToEipBaseFee(
    response: InjectiveTxFeesV1Beta1Query.QueryEipBaseFeeResponse,
  ): TxFeesEipBaseFee {
    return {
      baseFee: response.baseFee
        ? denomAmountFromGrpcChainDenomAmount(
            response.baseFee.baseFee,
          ).toFixed()
        : undefined,
    }
  }
}
