import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgRequestTimeLockedRedemption {
  export interface Params {
    vaultSubaccountId: string
  }

  export interface Data {
    vault_subaccount_id: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgRequestTimeLockedRedemption extends ExecArgBase<
  ExecArgRequestTimeLockedRedemption.Params,
  ExecArgRequestTimeLockedRedemption.Data
> {
  static fromJSON(
    params: ExecArgRequestTimeLockedRedemption.Params,
  ): ExecArgRequestTimeLockedRedemption {
    return new ExecArgRequestTimeLockedRedemption(params)
  }

  toData(): ExecArgRequestTimeLockedRedemption.Data {
    const { params } = this

    return {
      vault_subaccount_id: params.vaultSubaccountId,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgRequestTimeLockedRedemption.Data> {
    return dataToExecData('request_time_locked_redemption', this.toData())
  }
}
