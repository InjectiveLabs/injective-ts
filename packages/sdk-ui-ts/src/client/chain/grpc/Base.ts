import { ChainGrpcClient } from '@injectivelabs/sdk-ts/client'
import { BaseApi } from '../../../BaseApi'
import { ApiOptions } from '../../../types/index'

export class Base extends BaseApi {
  protected chainClient: ChainGrpcClient

  constructor(options: ApiOptions) {
    super(options)
    this.chainClient = new ChainGrpcClient(options.endpoints.sentryGrpcApi)
  }
}
