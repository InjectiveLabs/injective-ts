import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgCreateStrategy {
  export interface Params {
    subaccountId: string
    lowerBound: string
    upperBound: string
    levels: number
    slippage?: string
    stopLoss?: string
    takeProfit?: string
  }

  export interface Data {
    subaccount_id: string
    lower_bound: string
    upper_bound: string
    levels: number
    slippage?: string
    stop_loss?: string
    take_profit?: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgCreateStrategy extends ExecArgBase<
  ExecArgCreateStrategy.Params,
  ExecArgCreateStrategy.Data
> {
  static fromJSON(params: ExecArgCreateStrategy.Params): ExecArgCreateStrategy {
    return new ExecArgCreateStrategy(params)
  }

  toData(): ExecArgCreateStrategy.Data {
    const { params } = this

    return {
      subaccount_id: params.subaccountId,
      levels: params.levels,
      lower_bound: params.lowerBound,
      upper_bound: params.upperBound,
      slippage: params.slippage,
      stop_loss: params.stopLoss,
      take_profit: params.takeProfit,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCreateStrategy.Data> {
    return dataToExecData('create_strategy', this.toData())
  }
}
