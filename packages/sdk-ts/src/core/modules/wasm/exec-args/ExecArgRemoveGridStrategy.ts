import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

export declare namespace ExecArgRemoveGridStrategy {
  export interface Params {
    subaccountId?: string
  }

  export interface Data {
    subaccount_id?: string
  }
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
    const { params } = this

    return {
      subaccount_id: params.subaccountId,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgRemoveGridStrategy.Data> {
    return dataToExecData('remove_strategy', this.toData())
  }
}
