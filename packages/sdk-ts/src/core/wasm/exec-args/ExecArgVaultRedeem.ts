import { ExecArgsBase } from '../../ExecArgsBase'

export declare namespace ExecArgVaultRedeem {
  export interface Params {
    vaultSubaccountId: string
    subscriberSubaccountId: string
    marginRatio: string
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
}
