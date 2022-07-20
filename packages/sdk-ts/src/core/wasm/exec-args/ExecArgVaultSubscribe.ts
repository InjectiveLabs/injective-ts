import {
  dataToExecData,
  ExecArgsBase,
  ExecDataRepresentation,
} from '../../ExecArgsBase'
import snakeCaseKeys from 'snakecase-keys'

export declare namespace ExecArgVaultSubscribe {
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
      subscriberSubaccountId: params.subscriberSubaccountId,
      marginRatio: params.marginRatio,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgVaultSubscribe.Data> {
    const { params } = this

    return snakeCaseKeys(
      dataToExecData(this.toData(), {
        origin: params.origin,
        name: 'VaultSubscribe',
        action: 'Subscribe',
      }),
    )
  }
}
