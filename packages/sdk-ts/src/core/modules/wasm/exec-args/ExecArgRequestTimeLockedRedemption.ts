import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgRequestTimeLockedRedemption {
  export interface Params {
    deadline?: string
    redemptionRatio?: string
    vaultSubaccountId: string
    redeemerSubaccountId: string
    slippage?: Record<string, any>
    redemptionType: Record<string, any>
  }

  export interface Data {
    deadline?: string
    redemption_ratio?: string
    vault_subaccount_id: string
    slippage?: Record<string, any>
    redeemer_subaccount_id: string
    redemption_type: Record<string, any>
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
      deadline: params.deadline,
      slippage: params.slippage,
      redemption_type: params.redemptionType,
      redemption_ratio: params.redemptionRatio,
      vault_subaccount_id: params.vaultSubaccountId,
      redeemer_subaccount_id: params.redeemerSubaccountId,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgRequestTimeLockedRedemption.Data> {
    return dataToExecData('request_time_locked_redemption', this.toData())
  }
}
