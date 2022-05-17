import { ApiOptions } from '../../types'
import { UiBankApi } from './grpc/UiBankApi'
import { UiDistributionApi } from './grpc/UiDistributionApi'
import { UiStakingApi } from './grpc/UiStakingApi'

export class UiGrpcClient {
  bank: UiBankApi

  distribution: UiDistributionApi

  staking: UiStakingApi

  constructor(options: ApiOptions) {
    this.bank = new UiBankApi(options)
    this.distribution = new UiDistributionApi(options)
    this.staking = new UiStakingApi(options)
  }
}
