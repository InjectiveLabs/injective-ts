import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUnStake {
  export interface Params {
    denom: string
    amount: string
  }

  export interface Data {
    coin: {
      denom: string
      amount: string
    }
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgUnStake extends ExecArgBase<
  ExecArgUnStake.Params,
  ExecArgUnStake.Data
> {
  static fromJSON(params: ExecArgUnStake.Params): ExecArgUnStake {
    return new ExecArgUnStake(params)
  }

  toData(): ExecArgUnStake.Data {
    const { params } = this

    return {
      coin: {
        denom: params.denom,
        amount: params.amount,
      },
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUnStake.Data> {
    return dataToExecData('unstake', this.toData())
  }
}
