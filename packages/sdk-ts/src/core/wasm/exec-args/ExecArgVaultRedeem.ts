import {
  dataToExecData,
  ExecArgsBase,
  ExecDataRepresentation,
} from '../../ExecArgsBase'

export declare namespace ExecArgVaultRedeem {
  export interface Params {
    vaultSubaccountId: string
    subscriberSubaccountId: string
    marginRatio: string
    origin: string
  }

  export interface Data {
    vaultSubaccountId: string
    subscriberSubaccountId: string
    marginRatio: string
  }
}

export default class ExecArgVaultRedeem extends ExecArgsBase<
  ExecArgVaultRedeem.Params,
  ExecArgVaultRedeem.Data
> {
  static fromJSON(params: ExecArgVaultRedeem.Params): ExecArgVaultRedeem {
    return new ExecArgVaultRedeem(params)
  }

  toData(): ExecArgVaultRedeem.Data {
    const { params } = this

    return {
      vaultSubaccountId: params.vaultSubaccountId,
      subscriberSubaccountId: params.subscriberSubaccountId,
      marginRatio: params.marginRatio,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgVaultRedeem.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'VaultRedeem',
      action: 'Redeem',
    })
  }
}
