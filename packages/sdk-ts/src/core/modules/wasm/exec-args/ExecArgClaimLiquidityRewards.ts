import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgClaimLiquidityRewards {
  export interface Params {}

  export interface Data {}
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgClaimLiquidityRewards extends ExecArgBase<
  ExecArgClaimLiquidityRewards.Params,
  ExecArgClaimLiquidityRewards.Data
> {
  static fromJSON(
    params: ExecArgClaimLiquidityRewards.Params,
  ): ExecArgClaimLiquidityRewards {
    return new ExecArgClaimLiquidityRewards(params)
  }

  toData(): ExecArgClaimLiquidityRewards.Data {
    return {}
  }

  toExecData(): ExecDataRepresentation<ExecArgClaimLiquidityRewards.Data> {
    return dataToExecData('claim_reward', this.toData())
  }
}
