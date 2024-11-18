import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase.js'

export declare namespace ExecPrivilegedArgOffChainVaultRedeem {
  export interface Params {
    origin: string
    args: Record<string, any>
  }

  export interface Data {
    Redeem: { args: Record<string, any> }
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecPrivilegedArgOffChainVaultRedeem extends ExecPrivilegedArgBase<
  ExecPrivilegedArgOffChainVaultRedeem.Params,
  ExecPrivilegedArgOffChainVaultRedeem.Data
> {
  static fromJSON(
    params: ExecPrivilegedArgOffChainVaultRedeem.Params,
  ): ExecPrivilegedArgOffChainVaultRedeem {
    return new ExecPrivilegedArgOffChainVaultRedeem(params)
  }

  toData(): ExecPrivilegedArgOffChainVaultRedeem.Data {
    const { params } = this

    return {
      Redeem: { args: params.args },
    }
  }

  toExecData(): ExecDataRepresentation<ExecPrivilegedArgOffChainVaultRedeem.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'VaultRedeem',
    })
  }
}
