import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

export declare namespace ExecArgCreateRound {
  export interface Params {
    name: string
    endDate: number
    startDate: number
  }

  export interface Data {
    name: string
    end_date: number
    start_date: number
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgCreateRound extends ExecArgBase<
  ExecArgCreateRound.Params,
  ExecArgCreateRound.Data
> {
  static fromJSON(params: ExecArgCreateRound.Params): ExecArgCreateRound {
    return new ExecArgCreateRound(params)
  }

  toData(): ExecArgCreateRound.Data {
    const { params } = this

    return {
      name: params.name,
      start_date: params.startDate,
      end_date: params.endDate,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCreateRound.Data> {
    return dataToExecData('create_round', this.toData())
  }
}
