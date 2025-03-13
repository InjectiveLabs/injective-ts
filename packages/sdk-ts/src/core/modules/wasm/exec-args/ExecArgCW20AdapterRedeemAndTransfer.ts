import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

export declare namespace ExecArgCW20AdapterRedeemAndTransfer {
  export interface Params {
    recipient: string
  }

  export interface Data {
    recipient: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgCW20AdapterRedeemAndTransfer extends ExecArgBase<
  ExecArgCW20AdapterRedeemAndTransfer.Params,
  ExecArgCW20AdapterRedeemAndTransfer.Data
> {
  static fromJSON(
    params: ExecArgCW20AdapterRedeemAndTransfer.Params,
  ): ExecArgCW20AdapterRedeemAndTransfer {
    return new ExecArgCW20AdapterRedeemAndTransfer(params)
  }

  toData(): ExecArgCW20AdapterRedeemAndTransfer.Data {
    const { params } = this

    return {
      recipient: params.recipient,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCW20AdapterRedeemAndTransfer.Data> {
    return dataToExecData('redeem_and_transfer', this.toData())
  }
}
