import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgCreateSpotGridStrategy {
  export interface Params {
    subaccountId: string
    lowerBound: string
    upperBound: string
    levels: number
    slippage?: string
    stopLoss?: string
    takeProfit?: string
    shouldExitWithQuoteOnly?: boolean
  }

  export interface Data {
    subaccount_id: string
    bounds: [string, string]
    levels: number
    slippage?: string
    stop_loss?: string
    take_profit?: string
    should_exit_with_quote_only: boolean
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgCreateSpotGridStrategy extends ExecArgBase<
  ExecArgCreateSpotGridStrategy.Params,
  ExecArgCreateSpotGridStrategy.Data
> {
  static fromJSON(
    params: ExecArgCreateSpotGridStrategy.Params,
  ): ExecArgCreateSpotGridStrategy {
    return new ExecArgCreateSpotGridStrategy(params)
  }

  toData(): ExecArgCreateSpotGridStrategy.Data {
    const { params } = this

    return {
      subaccount_id: params.subaccountId,
      levels: params.levels,
      bounds: [params.lowerBound, params.upperBound],
      slippage: params.slippage,
      stop_loss: params.stopLoss,
      take_profit: params.takeProfit,
      should_exit_with_quote_only: !!params.shouldExitWithQuoteOnly,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCreateSpotGridStrategy.Data> {
    return dataToExecData('create_strategy', this.toData())
  }
}
