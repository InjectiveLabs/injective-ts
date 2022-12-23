import { toUtf8 } from '../../../../utils/utf8'
import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

/**
 * When we execute the `send` action on
 * a CW20 contract we actually send an execution
 * message to be executed no the CW20 contract itself
 * and NOT SEND CW20 TOKENS from one address to another.
 *  *
 * Keep in mind that using this argument is EXPERIMENTAL at this point
 * and it might break your app. Use ExecArgsCW20Transfer if you want
 * to send CW20 assets from one address to another.
 *
 * @experimental
 */
export declare namespace ExecArgCW20Send {
  export interface Params {
    contractAddress: string
    amount: string
    /**
     * This object represents the underyling method
     * that we want to execute on the CW20 smart contract
     */
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
