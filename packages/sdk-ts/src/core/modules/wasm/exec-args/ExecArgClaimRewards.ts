import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgClaimRewards {
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
export default class ExecArgClaimRewards extends ExecArgBase<
  ExecArgClaimRewards.Params,
  ExecArgClaimRewards.Data
> {
  static fromJSON(params: ExecArgClaimRewards.Params): ExecArgClaimRewards {
    return new ExecArgClaimRewards(params)
  }

  toData(): ExecArgClaimRewards.Data {
    const { params } = this

    return {
      lp_token: params.lpToken,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgClaimRewards.Data> {
    return dataToExecData('claim_rewards', this.toData())
  }
}
