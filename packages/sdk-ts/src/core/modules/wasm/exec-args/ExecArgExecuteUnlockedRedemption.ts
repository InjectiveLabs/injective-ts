import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgExecuteUnlockedRedemption {
  export interface Params {
    vaultSubaccountId: string
    redeemerSubaccountId: string
  }

  export interface Data {
    vault_subaccount_id: string
    redeemer_subaccount_id: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgExecuteUnlockedRedemption extends ExecArgBase<
  ExecArgExecuteUnlockedRedemption.Params,
  ExecArgExecuteUnlockedRedemption.Data
> {
  static fromJSON(
    params: ExecArgExecuteUnlockedRedemption.Params,
  ): ExecArgExecuteUnlockedRedemption {
    return new ExecArgExecuteUnlockedRedemption(params)
  }

  toData(): ExecArgExecuteUnlockedRedemption.Data {
    const { params } = this

    return {
      vault_subaccount_id: params.vaultSubaccountId,
      redeemer_subaccount_id: params.redeemerSubaccountId,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgExecuteUnlockedRedemption.Data> {
    return dataToExecData('execute_unlocked_redemption', this.toData())
  }
}
