import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

import { ExitType } from '../types.js'

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
    feeRecipient?: string
  }

  export interface Data {
    subaccount_id: string
    bounds: [string, string]
    slippage?: string
    stop_loss?: {
      exit_type: ExitType
      exit_price: string
    }
    take_profit?: {
      exit_type: ExitType
      exit_price: string
    }
    levels: number
    strategy_type: {
      perpetual: {
        margin_ratio: string
      }
    }
    fee_recipient?: string
  }
}

/**
 * @category Contract Exec Arguments
 */
/** @deprecated */
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
            exit_type: ExitType.Default,
            exit_price: params.stopLoss,
          }
        : undefined,
      take_profit: params.takeProfit
        ? {
            exit_type: ExitType.Default,
            exit_price: params.takeProfit,
          }
        : undefined,
      ...(params.feeRecipient && {
        fee_recipient: params.feeRecipient,
      }),
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCreatePerpGridStrategy.Data> {
    return dataToExecData('create_strategy', this.toData())
  }
}
