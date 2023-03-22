import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase'

export declare namespace ExecPrivilegedArgVaultSubscribe {
  export interface Params {
    origin: string
    deadline: string
    slippage?: Record<string, any>
    vaultSubaccountId: string
    subscriberSubaccountId: string
  }

  export interface Data {
    deadline: string
    slippage?: Record<string, any>
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
      slippage: params.slippage,
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
