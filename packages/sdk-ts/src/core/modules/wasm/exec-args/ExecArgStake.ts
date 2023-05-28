import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgStake {
  export interface Params {}

  export interface Data {}
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgStake extends ExecArgBase<
  ExecArgStake.Params,
  ExecArgStake.Data
> {
  static fromJSON(params: ExecArgStake.Params): ExecArgStake {
    return new ExecArgStake(params)
  }

  toData(): ExecArgStake.Data {
    return {}
  }

  toExecData(): ExecDataRepresentation<ExecArgStake.Data> {
    return dataToExecData('stake', this.toData())
  }
}
