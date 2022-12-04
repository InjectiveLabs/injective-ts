import { toUtf8 } from '../../../../utils/utf8'
import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgCW20Send {
  export interface Params {
    contractAddress: string
    amount: string
    msg?: object
  }

  export interface Data {
    contract: string
    amount: string
    msg: string
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
      contract: params.contractAddress,
      amount: params.amount,
      msg: Buffer.from(toUtf8(JSON.stringify(params.msg || {}))).toString(
        'base64',
      ),
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCW20Send.Data> {
    return dataToExecData('send', this.toData())
  }
}
