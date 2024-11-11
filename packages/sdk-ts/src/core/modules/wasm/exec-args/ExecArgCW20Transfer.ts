import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

/**
 * When we execute the `transfer` action on
 * a CW20 contract the  flow is the following:
 * Contract A moves ownership of the tokens from Bob to Alice
 *
 * Transfer{recipient, amount} - Moves amount tokens from the env.sender account to the recipient account.
 * This is designed to send to an address controlled by a private key and
 * does not trigger any actions on the recipient if it is a contract.
 */
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
