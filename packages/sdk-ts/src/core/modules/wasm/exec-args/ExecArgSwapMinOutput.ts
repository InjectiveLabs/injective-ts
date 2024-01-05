import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgSwapMinOutput {
  export interface Params {
    minOutputQuantity: string
    targetDenom: string
  }

  export interface Data {
    min_output_quantity: string
    target_denom: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgSwapMinOutput extends ExecArgBase<
  ExecArgSwapMinOutput.Params,
  ExecArgSwapMinOutput.Data
> {
  static fromJSON(params: ExecArgSwapMinOutput.Params): ExecArgSwapMinOutput {
    return new ExecArgSwapMinOutput(params)
  }

  toData(): ExecArgSwapMinOutput.Data {
    const { params } = this

    return {
      min_output_quantity: params.minOutputQuantity,
      target_denom: params.targetDenom,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgSwapMinOutput.Data> {
    return dataToExecData('swap_min_output', this.toData())
  }
}
