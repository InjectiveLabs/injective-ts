import { ApiOptions } from '../../types'
import { UiAccountApi } from './grpc/UiAccountApi'
import { UiDerivativesApi } from './grpc/UiDerivativesApi'
import { UiSpotApi } from './grpc/UiSpotApi'

export class UiGrpcClient {
  derivatives: UiDerivativesApi

  spot: UiSpotApi

  account: UiAccountApi

  constructor(options: ApiOptions) {
    this.derivatives = new UiDerivativesApi(options)
    this.spot = new UiSpotApi(options)
    this.account = new UiAccountApi(options)
  }
}
