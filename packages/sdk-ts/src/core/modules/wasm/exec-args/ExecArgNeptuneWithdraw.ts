import {
  ExecArgBase,
  dataToExecData,
  ExecDataRepresentation,
} from '../ExecArgBase.js'
import { toBase64 } from '../../../../utils'

export declare namespace ExecArgNeptuneWithdraw {
  export interface Params {
    amount: string
    contract: string
  }

  export interface Data {
    amount: string
    contract: string
    msg: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgNeptuneWithdraw extends ExecArgBase<
  ExecArgNeptuneWithdraw.Params,
  ExecArgNeptuneWithdraw.Data
> {
  static fromJSON(
    params: ExecArgNeptuneWithdraw.Params,
  ): ExecArgNeptuneWithdraw {
    return new ExecArgNeptuneWithdraw(params)
  }

  toData(): ExecArgNeptuneWithdraw.Data {
    const { params } = this
    const innerMsg = { redeem: {} }
    const encodedMsg = toBase64(innerMsg)

    return {
      amount: params.amount,
      contract: params.contract,
      msg: encodedMsg,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgNeptuneWithdraw.Data> {
    return dataToExecData('send', this.toData())
  }
}
