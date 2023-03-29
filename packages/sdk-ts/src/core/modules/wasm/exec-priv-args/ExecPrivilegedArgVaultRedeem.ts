import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase'

export declare namespace ExecPrivilegedArgVaultRedeem {
  export interface Params {
    origin: string
    redemptionRatio?: string
    vaultSubaccountId: string
    redeemerSubaccountId: string
    slippage?: Record<string, any>
    redemptionType: Record<string, any>
  }

  export interface Data {
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
      slippage: params.slippage,
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
