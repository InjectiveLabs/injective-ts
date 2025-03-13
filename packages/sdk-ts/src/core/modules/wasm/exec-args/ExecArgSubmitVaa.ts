import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'
import { binaryToBase64 } from './../../../../utils/utf8.js'

export declare namespace ExecArgSubmitVaa {
  export interface Params {
    signed: string
  }

  export interface Data {
    data: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgSubmitVaa extends ExecArgBase<
  ExecArgSubmitVaa.Params,
  ExecArgSubmitVaa.Data
> {
  static fromJSON(params: ExecArgSubmitVaa.Params): ExecArgSubmitVaa {
    return new ExecArgSubmitVaa(params)
  }

  toData(): ExecArgSubmitVaa.Data {
    const { params } = this

    return {
      data: binaryToBase64(params.signed),
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgSubmitVaa.Data> {
    return dataToExecData('submit_vaa', this.toData())
  }
}
