import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgCW20Send {
  export interface Params {
    contractAddress: string
    amount: string
  }

  export interface Data {
    contract_address: string
    amount: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgCW20Send extends ExecArgBase<
  ExecArgCW20Send.Params,
  ExecArgCW20Send.Data
> {
  static fromJSON(params: ExecArgCW20Send.Params): ExecArgCW20Send {
    return new ExecArgCW20Send(params)
  }

  toData(): ExecArgCW20Send.Data {
    const { params } = this

    return {
      contract_address: params.contractAddress,
      amount: params.amount,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCW20Send.Data> {
    return dataToExecData('send', this.toData())
  }
}
