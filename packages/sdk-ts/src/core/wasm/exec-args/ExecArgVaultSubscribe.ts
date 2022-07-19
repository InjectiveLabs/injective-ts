import {
  dataToExecData,
  ExecArgsBase,
  ExecDataRepresentation,
} from '../../ExecArgsBase'

export declare namespace ExecArgVaultSubscribe {
  export interface Params {
    vaultSubaccountId: string
    redeemerSubaccountId: string
    lpTokenBurnAmount: string
    origin: string
  }

  export interface Data {
    vaultSubaccountId: string
    redeemerSubaccountId: string
    lpTokenBurnAmount: string
  }
}

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
      vaultSubaccountId: params.vaultSubaccountId,
      redeemerSubaccountId: params.redeemerSubaccountId,
      lpTokenBurnAmount: params.lpTokenBurnAmount,
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
