import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgRegisterVault {
  export interface Params {
    vaultCodeId: number
    vaultLabel: string
    instantiateVaultMsg: Record<string, any>
  }

  export interface Data {
    vault_code_id: number
    vault_label: string
    instantiate_vault_msg: Record<string, any>
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgRegisterVault extends ExecArgBase<
  ExecArgRegisterVault.Params,
  ExecArgRegisterVault.Data
> {
  static fromJSON(params: ExecArgRegisterVault.Params): ExecArgRegisterVault {
    return new ExecArgRegisterVault(params)
  }

  toData(): ExecArgRegisterVault.Data {
    const { params } = this

    return {
      vault_code_id: params.vaultCodeId,
      vault_label: params.vaultLabel,
      instantiate_vault_msg: params.instantiateVaultMsg,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgRegisterVault.Data> {
    return dataToExecData('register_vault', this.toData())
  }
}
