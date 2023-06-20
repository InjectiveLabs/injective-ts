import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgSwap {
  export interface Params {
    minQuantity: string
    targetDenom: string
  }

  export interface Data {
    min_quantity: string
    target_denom: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgSwap extends ExecArgBase<
  ExecArgSwap.Params,
  ExecArgSwap.Data
> {
  static fromJSON(params: ExecArgSwap.Params): ExecArgSwap {
    return new ExecArgSwap(params)
  }

  toData(): ExecArgSwap.Data {
    const { params } = this

    return {
      min_quantity: params.minQuantity,
      target_denom: params.targetDenom,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgSwap.Data> {
    return dataToExecData('swap', this.toData())
  }
}
