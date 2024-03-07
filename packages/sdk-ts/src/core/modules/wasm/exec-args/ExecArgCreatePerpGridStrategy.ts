import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

import { ExitConfig, ExitType } from '../types'
export declare namespace ExecArgCreatePerpGridStrategy {
  export interface Params {
    subaccountId: string
    lowerBound: string
    upperBound: string
    levels: number
    slippage?: string
    stopLoss?: string
    takeProfit?: string
    marginRatio: string
  }

  export interface Data {
    subaccount_id: string
    bounds: [string, string]
    slippage?: string
    stop_loss?: ExitConfig
    take_profit?: ExitConfig
    levels: number
    strategy_type: {
      perpetual: {
        margin_ratio: string
      }
    }
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgCreatePerpGridStrategy extends ExecArgBase<
  ExecArgCreatePerpGridStrategy.Params,
  ExecArgCreatePerpGridStrategy.Data
> {
  static fromJSON(
    params: ExecArgCreatePerpGridStrategy.Params,
  ): ExecArgCreatePerpGridStrategy {
    return new ExecArgCreatePerpGridStrategy(params)
  }

  toData(): ExecArgCreatePerpGridStrategy.Data {
    const { params } = this

    return {
      subaccount_id: params.subaccountId,
      bounds: [params.lowerBound, params.upperBound],
      levels: params.levels,
      slippage: params.slippage,
      strategy_type: {
        perpetual: {
          margin_ratio: params.marginRatio,
        },
      },
      stop_loss: params.stopLoss
        ? {
            exitType: ExitType.Default,
            exitPrice: params.stopLoss,
          }
        : undefined,
      take_profit: params.takeProfit
        ? {
            exitType: ExitType.Default,
            exitPrice: params.takeProfit,
          }
        : undefined,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCreatePerpGridStrategy.Data> {
    return dataToExecData('create_strategy', this.toData())
  }
}
