import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgClaimStake {
  export interface Params {
    lpToken: string
  }

  export interface Data {
    lp_token: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgClaimStake extends ExecArgBase<
  ExecArgClaimStake.Params,
  ExecArgClaimStake.Data
> {
  static fromJSON(params: ExecArgClaimStake.Params): ExecArgClaimStake {
    return new ExecArgClaimStake(params)
  }

  toData(): ExecArgClaimStake.Data {
    const { params } = this

    return {
      lp_token: params.lpToken,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgClaimStake.Data> {
    return dataToExecData('claim_stake', this.toData())
  }
}
