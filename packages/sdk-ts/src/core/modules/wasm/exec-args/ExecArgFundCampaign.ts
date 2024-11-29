import {
  dataToExecData,
  ExecArgBase,
  ExecDataRepresentation,
} from '../ExecArgBase.js'

export declare namespace ExecArgFundCampaign {
  export interface Params {
    campaignId: number
  }

  export interface Data {
    campaign_id: number
  }
}

/**
 * @category Contract Exec Arguments
 */
export default class ExecArgFundCampaign extends ExecArgBase<
  ExecArgFundCampaign.Params,
  ExecArgFundCampaign.Data
> {
  static fromJSON(params: ExecArgFundCampaign.Params): ExecArgFundCampaign {
    return new ExecArgFundCampaign(params)
  }

  toData(): ExecArgFundCampaign.Data {
    const { params } = this

    return {
      campaign_id: params.campaignId,
    }
  }

  toExecData(): ExecDataRepresentation<ExecArgFundCampaign.Data> {
    return dataToExecData('fund_campaign', this.toData())
  }
}
