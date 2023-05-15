import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUpdateAllocatorContractConfig {
  export interface Params {
    owner?: string
    stakingContractAddress?: string
    maxRewardDenomsPerGauge?: string
    minGaugeDurationInSeconds?: string
    maxActiveGaugesPerLpToken?: string
    gaugeAllocationFee?: {
      denom: string
      amount: string
    }
  }

  export interface Data {
    owner?: string
    staking_contract_address?: string
    max_reward_denoms_per_gauge?: string
    min_gauge_duration_in_seconds?: string
    max_active_gauges_per_lp_token?: string
    gauge_allocation_fee?: {
      denom: string
      amount: string
    }
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgUpdateAllocatorContractConfig extends ExecArgBase<
  ExecArgUpdateAllocatorContractConfig.Params,
  ExecArgUpdateAllocatorContractConfig.Data
> {
  static fromJSON(
    params: ExecArgUpdateAllocatorContractConfig.Params,
  ): ExecArgUpdateAllocatorContractConfig {
    return new ExecArgUpdateAllocatorContractConfig(params)
  }

  toData(): ExecArgUpdateAllocatorContractConfig.Data {
    const { params } = this

    return {
      owner: params.owner,
      staking_contract_address: params.stakingContractAddress,
      max_reward_denoms_per_gauge: params.maxRewardDenomsPerGauge,
      min_gauge_duration_in_seconds: params.minGaugeDurationInSeconds,
      max_active_gauges_per_lp_token: params.maxActiveGaugesPerLpToken,
      gauge_allocation_fee: params.gaugeAllocationFee,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUpdateAllocatorContractConfig.Data> {
    return dataToExecData('update_config', this.toData())
  }
}
