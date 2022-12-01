import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase'

export declare namespace ExecPrivilegedArgRegisterVault {
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
export default class ExecPrivilegedArgRegisterVault extends ExecPrivilegedArgBase<
  ExecPrivilegedArgRegisterVault.Params,
  ExecPrivilegedArgRegisterVault.Data
> {
  static fromJSON(
    params: ExecPrivilegedArgRegisterVault.Params,
  ): ExecPrivilegedArgRegisterVault {
    return new ExecPrivilegedArgRegisterVault(params)
  }

  toData(): ExecPrivilegedArgRegisterVault.Data {
    const { params } = this

    return {
      vault_address: params.vaultAddress,
    }
  }

  toExecData(): ExecDataRepresentation<ExecPrivilegedArgRegisterVault.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'RegisterVault',
      action: 'register_vault',
    })
  }
}
