import { GrpcClient } from '@injectivelabs/sdk-ts/dist/client/exchange'
import { BaseApi } from '../../../BaseApi'
import { ApiOptions } from '../../../types/index'

export class Base extends BaseApi {
  protected exchangeClient: GrpcClient

  constructor(options: ApiOptions) {
    super(options)
    this.exchangeClient = new GrpcClient(options.endpoints.exchangeApi)
  }
}
