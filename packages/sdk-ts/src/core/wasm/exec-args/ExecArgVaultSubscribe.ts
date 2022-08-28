import {
  dataToExecData,
  ExecArgsBase,
  ExecDataRepresentation,
} from '../../ExecArgsBase'

export declare namespace ExecArgVaultSubscribe {
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
export default class ExecArgVaultSubscribe extends ExecArgsBase<
  ExecArgVaultSubscribe.Params,
  ExecArgVaultSubscribe.Data
> {
  static fromJSON(params: ExecArgVaultSubscribe.Params): ExecArgVaultSubscribe {
    return new ExecArgVaultSubscribe(params)
  }

  toData(): ExecArgVaultSubscribe.Data {
    const { params } = this

    return {
      vault_subaccount_id: params.vaultSubaccountId,
      subscriber_subaccount_id: params.subscriberSubaccountId,
      margin_ratio: params.marginRatio,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgVaultSubscribe.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'VaultSubscribe',
      action: 'Subscribe',
    })
  }
}
