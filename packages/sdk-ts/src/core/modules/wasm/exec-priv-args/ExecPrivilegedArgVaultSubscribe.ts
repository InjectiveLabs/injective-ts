import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase'

export declare namespace ExecPrivilegedArgVaultSubscribe {
  export interface Params {
    origin: string
    deadline?: string
    maxSlippage?: string
    vaultSubaccountId: string
    subscriberSubaccountId: string
  }

  export interface Data {
    deadline?: string
    max_slippage?: string
    vault_subaccount_id: string
    subscriber_subaccount_id: string
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
      deadline: params.deadline,
      max_slippage: params.maxSlippage,
      vault_subaccount_id: params.vaultSubaccountId,
      subscriber_subaccount_id: params.subscriberSubaccountId,
    }
  }

  toExecData(): ExecDataRepresentation<ExecPrivilegedArgVaultSubscribe.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'VaultSubscribe',
      action: 'Subscribe',
    })
  }
}
