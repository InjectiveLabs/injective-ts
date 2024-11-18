import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

export declare namespace ExecArgSwapExactOutput {
  export interface Params {
    targetOutputQuantity: string
    targetDenom: string
  }

  export interface Data {
    target_output_quantity: string
    target_denom: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgSwapExactOutput extends ExecArgBase<
  ExecArgSwapExactOutput.Params,
  ExecArgSwapExactOutput.Data
> {
  static fromJSON(
    params: ExecArgSwapExactOutput.Params,
  ): ExecArgSwapExactOutput {
    return new ExecArgSwapExactOutput(params)
  }

  toData(): ExecArgSwapExactOutput.Data {
    const { params } = this

    return {
      target_output_quantity: params.targetOutputQuantity,
      target_denom: params.targetDenom,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgSwapExactOutput.Data> {
    return dataToExecData('swap_exact_output', this.toData())
  }
}
