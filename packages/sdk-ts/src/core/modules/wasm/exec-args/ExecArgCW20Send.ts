import { ExecArgBase, dataToExecData } from '../ExecArgBase.js'
import { safeBigIntStringify } from '../../../../utils/helpers.js'
import { fromUtf8, uint8ArrayToBase64 } from '../../../../utils/encoding.js'
import type { ExecDataRepresentation } from '../ExecArgBase.js'

/**
 * When we execute the `send` action on
 * a CW20 contract the  flow is the following:
 * Contract A -> moves tokens to Contract B -> Contract B executed a `receive` method
 * to move the tokens from its ownership to the recipient
 *
 * From the CW20 docs
 * Send{contract, amount, msg} - Moves amount tokens from the env.sender account to the recipient account.
 * contract must be an address of a contract that implements the Receiver interface.
 * The msg will be passed to the recipient contract, along with the amount.
 *
 * @experimental
 */
export declare namespace ExecArgCW20Send {
  export interface Params {
    contractAddress: string
    amount: string
    /**
     * This object represents the underlying method
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
      msg: uint8ArrayToBase64(fromUtf8(safeBigIntStringify(params.msg || {}))),
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCW20Send.Data> {
    return dataToExecData('send', this.toData())
  }
}
