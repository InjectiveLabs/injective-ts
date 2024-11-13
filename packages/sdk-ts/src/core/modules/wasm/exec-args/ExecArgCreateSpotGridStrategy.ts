import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

import {
  ExitType,
  ExitConfig,
  StrategyType,
  TrailingArithmetic,
  TrailingArithmeticLP,
} from '../types.js'
export declare namespace ExecArgCreateSpotGridStrategy {
  export interface Params {
    subaccountId: string
    lowerBound: string
    upperBound: string
    levels: number
    slippage?: string
    stopLoss?: ExitConfig
    takeProfit?: ExitConfig
    exitType?: ExitType
    strategyType?: StrategyType
    trailingArithmetic?: {
      upperTrailing: string
      lowerTrailing: string
      lpMode?: boolean
    }
  }

  export interface Data {
    subaccount_id: string
    bounds: [string, string]
    levels: number
    slippage?: string
    stop_loss?: {
      exit_type: ExitType
      exit_price: string
    }
    take_profit?: {
      exit_type: ExitType
      exit_price: string
    }
    exit_type?: ExitType
    strategy_type?: StrategyType | TrailingArithmetic | TrailingArithmeticLP
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

    const trailingBounds = params.trailingArithmetic
      ? {
          upper_trailing_bound: params.trailingArithmetic.upperTrailing,
          lower_trailing_bound: params.trailingArithmetic.lowerTrailing,
        }
      : undefined

    const strategyType =
      params.trailingArithmetic && trailingBounds
        ? params.trailingArithmetic.lpMode
          ? { trailing_arithmetic_l_p: trailingBounds }
          : { trailing_arithmetic: trailingBounds }
        : params.strategyType ?? StrategyType.Arithmetic

    return {
      subaccount_id: params.subaccountId,
      levels: params.levels,
      bounds: [params.lowerBound, params.upperBound],
      slippage: params.slippage,
      exit_type: params.exitType,
      stop_loss: params.stopLoss
        ? {
            exit_type: params.stopLoss.exitType,
            exit_price: params.stopLoss.exitPrice,
          }
        : undefined,
      take_profit: params.takeProfit
        ? {
            exit_type: params.takeProfit.exitType,
            exit_price: params.takeProfit.exitPrice,
          }
        : undefined,
      strategy_type: strategyType,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCreateSpotGridStrategy.Data> {
    return dataToExecData('create_strategy', this.toData())
  }
}
