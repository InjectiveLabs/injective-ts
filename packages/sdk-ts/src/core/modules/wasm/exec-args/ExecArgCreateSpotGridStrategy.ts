import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

import { ExitType, ExitConfig } from '../types'
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
      should_exit_with_quote_only: false, // dummy value for backwards compatibility
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCreateSpotGridStrategy.Data> {
    return dataToExecData('create_strategy', this.toData())
  }
}
