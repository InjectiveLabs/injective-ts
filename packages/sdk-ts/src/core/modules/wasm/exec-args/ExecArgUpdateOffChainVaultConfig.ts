import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUpdateOffChainVaultConfig {
  export interface Params {
    oracleStaleTime: number
    notionalValueCap: string
    vaultType: Record<string, any>
  }

  export interface Data {
    oracle_stale_time: number
    notional_value_cap: string
    vault_type: Record<string, any>
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgUpdateOffChainVaultConfig extends ExecArgBase<
  ExecArgUpdateOffChainVaultConfig.Params,
  ExecArgUpdateOffChainVaultConfig.Data
> {
  static fromJSON(
    params: ExecArgUpdateOffChainVaultConfig.Params,
  ): ExecArgUpdateOffChainVaultConfig {
    return new ExecArgUpdateOffChainVaultConfig(params)
  }

  toData(): ExecArgUpdateOffChainVaultConfig.Data {
    const { params } = this

    return {
      oracle_stale_time: params.oracleStaleTime,
      notional_value_cap: params.notionalValueCap,
      vault_type: params.vaultType,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUpdateOffChainVaultConfig.Data> {
    return dataToExecData('update_vault_config', this.toData())
  }
}
