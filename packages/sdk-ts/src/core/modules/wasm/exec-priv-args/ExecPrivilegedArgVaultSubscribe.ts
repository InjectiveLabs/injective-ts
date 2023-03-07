import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase'

export declare namespace ExecPrivilegedArgVaultSubscribe {
  export interface Params {
    origin: string
    deadline?: number
    marginRatio?: string
    maxSlippage?: string
    vaultSubaccountId: string
    subscriberSubaccountId: string
    subscriptionType: Record<string, any>
  }

  export interface Data {
    deadline?: number
    max_slippage?: string
    margin_ratio?: string
    vault_subaccount_id: string
    subscriber_subaccount_id: string
    subscription_type: Record<string, any>
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
      margin_ratio: params.marginRatio,
      max_slippage: params.maxSlippage,
      subscription_type: params.subscriptionType,
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
