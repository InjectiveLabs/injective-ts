import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

export declare namespace ExecArgNeptuneDeposit {
  export interface Params {}

  export interface Data {}
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgNeptuneDeposit extends ExecArgBase<
  ExecArgNeptuneDeposit.Params,
  ExecArgNeptuneDeposit.Data
> {
  static fromJSON(
    params: ExecArgNeptuneDeposit.Params,
  ): ExecArgNeptuneDeposit {
    return new ExecArgNeptuneDeposit(params)
  }

  public toData(): ExecArgNeptuneDeposit.Data {
    return {}
  }

  public toExecData(): ExecDataRepresentation<ExecArgNeptuneDeposit.Data> {
    return dataToExecData('lend', this.toData())
  }
}
