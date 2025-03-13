import {
  dataToExecData,
  ExecPrivilegedArgBase,
  ExecDataRepresentation,
} from '../ExecPrivilegedArgBase.js'

export declare namespace ExecPrivilegedArgOffChainVaultSubscribe {
  export interface Params {
    origin: string
    args: Record<string, any>
  }

  export interface Data {
    Subscribe: { args: Record<string, any> }
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecPrivilegedArgOffChainVaultSubscribe extends ExecPrivilegedArgBase<
  ExecPrivilegedArgOffChainVaultSubscribe.Params,
  ExecPrivilegedArgOffChainVaultSubscribe.Data
> {
  static fromJSON(
    params: ExecPrivilegedArgOffChainVaultSubscribe.Params,
  ): ExecPrivilegedArgOffChainVaultSubscribe {
    return new ExecPrivilegedArgOffChainVaultSubscribe(params)
  }

  toData(): ExecPrivilegedArgOffChainVaultSubscribe.Data {
    const { params } = this

    return {
      Subscribe: { args: params.args },
    }
  }

  toExecData(): ExecDataRepresentation<ExecPrivilegedArgOffChainVaultSubscribe.Data> {
    const { params } = this

    return dataToExecData(this.toData(), {
      origin: params.origin,
      name: 'VaultSubscribe',
    })
  }
}
