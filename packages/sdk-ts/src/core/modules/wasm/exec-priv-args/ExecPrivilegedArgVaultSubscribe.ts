import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase'

export declare namespace ExecPrivilegedArgVaultSubscribe {
  export interface Params {
    vaultSubaccountId: string
    subscriberSubaccountId: string
    marginRatio?: string
    origin: string
  }

  export interface Data {
    vault_subaccount_id: string
    subscriber_subaccount_id: string
    margin_ratio?: string
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
      subscriber_subaccount_id: params.subscriberSubaccountId,
      margin_ratio: params.marginRatio,
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
