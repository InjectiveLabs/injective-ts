import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'
import { Coin } from '@injectivelabs/ts-types'

export declare namespace ExecArgCreateCampaign {
  export interface Params {
    name: string
    rewards: Coin[]
    inRound: number
    marketId: string
    description: string
    subaccountIdSuffix: string
  }

  export interface Data {
    name: string
    rewards: Coin[]
    in_round: number
    market_id: string
    description: string
    subaccount_id_suffix: string
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgCreateCampaign extends ExecArgBase<
  ExecArgCreateCampaign.Params,
  ExecArgCreateCampaign.Data
> {
  static fromJSON(params: ExecArgCreateCampaign.Params): ExecArgCreateCampaign {
    return new ExecArgCreateCampaign(params)
  }

  toData(): ExecArgCreateCampaign.Data {
    const { params } = this

    return {
      name: params.name,
      rewards: params.rewards,
      in_round: params.inRound,
      market_id: params.marketId,
      description: params.description,
      subaccount_id_suffix: params.subaccountIdSuffix,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgCreateCampaign.Data> {
    return dataToExecData('create_campaign', this.toData())
  }
}
