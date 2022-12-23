import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgCW20Transfer {
  export interface Params {
    amount: string
    recipient: string
  }

  export interface Data {
    recipient: string
    amount: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgCW20Transfer extends ExecArgBase<
  ExecArgCW20Transfer.Params,
  ExecArgCW20Transfer.Data
> {
  static fromJSON(params: ExecArgCW20Transfer.Params): ExecArgCW20Transfer {
    return new ExecArgCW20Transfer(params)
  }

  toData(): ExecArgCW20Transfer.Data {
    const { params } = this

    return {
      recipient: params.recipient,
      amount: params.amount,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCW20Transfer.Data> {
    return dataToExecData('transfer', this.toData())
  }
}
