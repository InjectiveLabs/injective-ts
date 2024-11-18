import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

export declare namespace ExecArgDepositTokens {
  export interface Params {}

  export interface Data {}
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgDepositTokens extends ExecArgBase<
  ExecArgDepositTokens.Params,
  ExecArgDepositTokens.Data
> {
  static fromJSON(params: ExecArgDepositTokens.Params): ExecArgDepositTokens {
    return new ExecArgDepositTokens(params)
  }

  toData(): ExecArgDepositTokens.Data {
    return {}
  }

  toExecData(): ExecDataRepresentation<ExecArgDepositTokens.Data> {
    return dataToExecData('deposit_tokens', this.toData())
  }
}
