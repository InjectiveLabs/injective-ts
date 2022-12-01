import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase'

export declare namespace ExecPrivilegedArgVaultRedeem {
  export interface Params {
    vaultSubaccountId: string
    redeemerSubaccountId: string
    redemptionType: string
    origin: string
  }

  export interface Data {
    vault_subaccount_id: string
    redeemer_subaccount_id: string
    redemption_type: string
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
      vault_subaccount_id: params.vaultSubaccountId,
      redeemer_subaccount_id: params.redeemerSubaccountId,
      redemption_type: params.redemptionType,
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
