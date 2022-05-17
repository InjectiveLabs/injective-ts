import { GrpcClient } from '@injectivelabs/sdk-ts/dist/client/chain'
import { BaseApi } from '../../../BaseApi'
import { ApiOptions } from '../../../types/index'

export class Base extends BaseApi {
  protected chainClient: GrpcClient

  constructor(options: ApiOptions) {
    super(options)
    this.chainClient = new GrpcClient(options.endpoints.sentryGrpcApi)
  }
}
