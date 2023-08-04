import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

/**
 * @category Contract Exec Arguments for messages that do not require any additional params
 */
export declare namespace ExecArgGeneric {
  export interface Params {
    name: string
  }

  export interface Data {}
}

export default class ExecArgGeneric extends ExecArgBase<
  ExecArgGeneric.Params,
  ExecArgGeneric.Data
> {
  static fromJSON(params: ExecArgGeneric.Params): ExecArgGeneric {
    return new ExecArgGeneric(params)
  }

  toData(): ExecArgGeneric.Data {
    return {}
  }

  toExecData(): ExecDataRepresentation<ExecArgGeneric.Data> {
    const { params } = this

    return dataToExecData(params.name, this.toData())
  }
}
