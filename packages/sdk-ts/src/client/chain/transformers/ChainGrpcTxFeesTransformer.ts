import { denomAmountFromGrpcChainDenomAmount } from './../../../utils/numbers.js'
import type * as InjectiveTxFeesV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/txfees/v1beta1/query_pb.mjs'
import type {
  TxFeesEipBaseFee,
  TxFeesModuleStateParams,
} from '../types/txFees.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcTxFeesTransformer {
  static moduleParamsResponseToModuleParams(
    response: InjectiveTxFeesV1Beta1QueryPb.QueryParamsResponse,
  ): TxFeesModuleStateParams {
    const params = response.params!

    return {
      maxGasWantedPerTx: params.maxGasWantedPerTx.toString(),
      highGasTxThreshold: params.highGasTxThreshold.toString(),
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
      resetInterval: params.resetInterval.toString(),
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
    response: InjectiveTxFeesV1Beta1QueryPb.QueryEipBaseFeeResponse,
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
