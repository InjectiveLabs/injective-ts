import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase'

export declare namespace ExecArgUpdateStakingContractConfig {
  export interface Params {
    owner: string
    lockupPeriod?: string
    allocatorContractAddress: string
  }

  export interface Data {
    owner: string
    lockup_period?: string
    allocator_contract_address: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgUpdateStakingContractConfig extends ExecArgBase<
  ExecArgUpdateStakingContractConfig.Params,
  ExecArgUpdateStakingContractConfig.Data
> {
  static fromJSON(
    params: ExecArgUpdateStakingContractConfig.Params,
  ): ExecArgUpdateStakingContractConfig {
    return new ExecArgUpdateStakingContractConfig(params)
  }

  toData(): ExecArgUpdateStakingContractConfig.Data {
    const { params } = this

    return {
      owner: params.owner,
      lockup_period: params.lockupPeriod,
      allocator_contract_address: params.allocatorContractAddress,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgUpdateStakingContractConfig.Data> {
    return dataToExecData('update_config', this.toData())
  }
}
