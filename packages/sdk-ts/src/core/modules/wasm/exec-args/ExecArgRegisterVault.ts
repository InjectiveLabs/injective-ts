import {
  dataToExecData,
  ExecArgsBase,
  ExecDataRepresentation,
} from '../../ExecArgsBase'

export declare namespace ExecArgRegisterVault {
  export interface Params {
    vaultAddress: string
    origin: string
  }

  export interface Data {
    vault_address: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgRegisterVault extends ExecArgsBase<
  ExecArgRegisterVault.Params,
  ExecArgRegisterVault.Data
> {
  static fromJSON(params: ExecArgRegisterVault.Params): ExecArgRegisterVault {
    return new ExecArgRegisterVault(params)
  }

  toData(): ExecArgRegisterVault.Data {
    const { params } = this

    return {
      vault_address: params.vaultAddress,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgRegisterVault.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'RegisterVault',
      action: 'register_vault',
    })
  }
}
