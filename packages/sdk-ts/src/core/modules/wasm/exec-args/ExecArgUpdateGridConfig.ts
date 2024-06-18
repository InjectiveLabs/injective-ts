import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUpdateGridConfig {
  export interface Params {
    maximumOrderValueDeviation?: string
    maximumRebalanceRetries?: number
    slippage?: string
  }

  export interface Data {
    maximum_order_value_deviation?: string
    maximum_rebalance_retries?: number
    slippage?: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgUpdateGridConfig extends ExecArgBase<
  ExecArgUpdateGridConfig.Params,
  ExecArgUpdateGridConfig.Data
> {
  static fromJSON(
    params: ExecArgUpdateGridConfig.Params,
  ): ExecArgUpdateGridConfig {
    return new ExecArgUpdateGridConfig(params)
  }

  toData(): ExecArgUpdateGridConfig.Data {
    const { params } = this

    return {
      maximum_order_value_deviation: params.maximumOrderValueDeviation,
      maximum_rebalance_retries: params.maximumRebalanceRetries,
      slippage: params.slippage,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUpdateGridConfig.Data> {
    return dataToExecData('update_config', this.toData())
  }
}
