import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgRemoveGridStrategy {
  export interface Params {}

  export interface Data {}
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgRemoveGridStrategy extends ExecArgBase<
  ExecArgRemoveGridStrategy.Params,
  ExecArgRemoveGridStrategy.Data
> {
  static fromJSON(
    params: ExecArgRemoveGridStrategy.Params,
  ): ExecArgRemoveGridStrategy {
    return new ExecArgRemoveGridStrategy(params)
  }

  toData(): ExecArgRemoveGridStrategy.Data {
    // const { params } = this

    return {}
  }

  toExecData(): ExecDataRepresentation<ExecArgRemoveGridStrategy.Data> {
    return dataToExecData('remove_strategy', this.toData())
  }
}
