import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

export declare namespace ExecArgIncreaseAllowance {
  export interface Params {
    amount: string
    spender: string
    expires: Record<string, any>
  }

  export interface Data {
    amount: string
    spender: string
    expires: Record<string, any>
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgIncreaseAllowance extends ExecArgBase<
  ExecArgIncreaseAllowance.Params,
  ExecArgIncreaseAllowance.Data
> {
  static fromJSON(
    params: ExecArgIncreaseAllowance.Params,
  ): ExecArgIncreaseAllowance {
    return new ExecArgIncreaseAllowance(params)
  }

  toData(): ExecArgIncreaseAllowance.Data {
    const { params } = this

    return {
      amount: params.amount,
      spender: params.spender,
      expires: params.expires,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgIncreaseAllowance.Data> {
    return dataToExecData('increase_allowance', this.toData())
  }
}
