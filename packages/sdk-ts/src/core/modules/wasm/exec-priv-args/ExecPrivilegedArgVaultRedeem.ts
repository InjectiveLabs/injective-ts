import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase.js'

export declare namespace ExecPrivilegedArgVaultRedeem {
  export interface Params {
    origin: string
    vaultSubaccountId: string
    traderSubaccountId: string
    args: Record<string, any>
  }

  export interface Data {
    vault_subaccount_id: string
    trader_subaccount_id: string
    msg: {
      redeem: Record<string, any>
    }
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
      trader_subaccount_id: params.traderSubaccountId,
      msg: {
        redeem: params.args,
      },
    }
  }

  toExecData(): ExecDataRepresentation<ExecPrivilegedArgVaultRedeem.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'VaultRedeem',
    })
  }
}
