import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase'

export declare namespace ExecPrivilegedArgVaultRedeem {
  export interface Params {
    origin: string
    deadline?: string
    maxSlippage?: string
    redemptionRatio?: string
    vaultSubaccountId: string
    redeemerSubaccountId: string
    redemptionType: Record<string, any>
  }

  export interface Data {
    deadline?: string
    max_slippage?: string
    redemption_ratio?: string
    vault_subaccount_id: string
    redeemer_subaccount_id: string
    redemption_type: Record<string, any>
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecPrivilegedArgVaultRedeem extends ExecPrivilegedArgBase<
  ExecPrivilegedArgVaultRedeem.Params,
  ExecPrivilegedArgVaultRedeem.Data
> {
  static fromJSON(
    params: ExecPrivilegedArgVaultRedeem.Params,
  ): ExecPrivilegedArgVaultRedeem {
    return new ExecPrivilegedArgVaultRedeem(params)
  }

  toData(): ExecPrivilegedArgVaultRedeem.Data {
    const { params } = this

    return {
      deadline: params.deadline,
      max_slippage: params.maxSlippage,
      redemption_type: params.redemptionType,
      redemption_ratio: params.redemptionRatio,
      vault_subaccount_id: params.vaultSubaccountId,
      redeemer_subaccount_id: params.redeemerSubaccountId,
    }
  }

  toExecData(): ExecDataRepresentation<ExecPrivilegedArgVaultRedeem.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'VaultRedeem',
      action: 'Redeem',
    })
  }
}
