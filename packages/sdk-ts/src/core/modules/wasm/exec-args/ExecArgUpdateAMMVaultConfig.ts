import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUpdateAMMVaultConfig {
  export interface Params {
    owner: string
    marketId: string
    masterAddress: string
    orderDensity: number
    maxInvariantSensitivity: string
    baseDecimals: number
    quoteDecimals: number
    redemptionLockTime: number
    redemptionUnlockTimeExpiration: number
  }

  export interface Data {
    owner: string
    market_id: string
    master_address: string
    order_density: number
    max_invariant_sensitivity: string
    base_decimals: number
    quote_decimals: number
    redemption_lock_time: number
    redemption_unlock_time_expiration: number
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgUpdateAMMVaultConfig extends ExecArgBase<
  ExecArgUpdateAMMVaultConfig.Params,
  ExecArgUpdateAMMVaultConfig.Data
> {
  static fromJSON(
    params: ExecArgUpdateAMMVaultConfig.Params,
  ): ExecArgUpdateAMMVaultConfig {
    return new ExecArgUpdateAMMVaultConfig(params)
  }

  toData(): ExecArgUpdateAMMVaultConfig.Data {
    const { params } = this

    return {
      owner: params.owner,
      market_id: params.marketId,
      master_address: params.masterAddress,
      order_density: params.orderDensity,
      max_invariant_sensitivity: params.maxInvariantSensitivity,
      base_decimals: params.baseDecimals,
      quote_decimals: params.quoteDecimals,
      redemption_lock_time: params.redemptionLockTime,
      redemption_unlock_time_expiration: params.redemptionUnlockTimeExpiration,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUpdateAMMVaultConfig.Data> {
    return dataToExecData('update_vault_config', this.toData())
  }
}
