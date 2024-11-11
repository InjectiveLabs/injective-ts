import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase.js'

// ult_subaccount_id`:

export declare namespace ExecPrivilegedArgVaultSubscribe {
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
      subscribe: Record<string, any>
    }
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecPrivilegedArgVaultSubscribe extends ExecPrivilegedArgBase<
  ExecPrivilegedArgVaultSubscribe.Params,
  ExecPrivilegedArgVaultSubscribe.Data
> {
  static fromJSON(
    params: ExecPrivilegedArgVaultSubscribe.Params,
  ): ExecPrivilegedArgVaultSubscribe {
    return new ExecPrivilegedArgVaultSubscribe(params)
  }

  toData(): ExecPrivilegedArgVaultSubscribe.Data {
    const { params } = this

    return {
      vault_subaccount_id: params.vaultSubaccountId,
      trader_subaccount_id: params.traderSubaccountId,
      msg: {
        subscribe: params.args,
      },
    }
  }

  toExecData(): ExecDataRepresentation<ExecPrivilegedArgVaultSubscribe.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'VaultSubscribe',
    })
  }
}
