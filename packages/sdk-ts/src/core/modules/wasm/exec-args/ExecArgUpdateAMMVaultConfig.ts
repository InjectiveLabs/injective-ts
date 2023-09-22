import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUpdateAMMVaultConfig {
  export interface Params {
    marketId: string
    orderDensity: number
    maxInvariantSensitivity: string
    priceTickSize: string
    notionalValueCap: string
  }

  export interface Data {
    market_id: string
    order_density: number
    max_invariant_sensitivity: string
    price_tick_size: string
    notional_value_cap: string
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
      market_id: params.marketId,
      order_density: params.orderDensity,
      max_invariant_sensitivity: params.maxInvariantSensitivity,
      price_tick_size: params.priceTickSize,
      notional_value_cap: params.notionalValueCap,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUpdateAMMVaultConfig.Data> {
    return dataToExecData('update_vault_config', this.toData())
  }
}
