import { ExchangeGrpcClient } from '@injectivelabs/sdk-ts/client'
import { BaseApi } from '../../../BaseApi'
import { ApiOptions } from '../../../types/index'

export class Base extends BaseApi {
  protected exchangeClient: ExchangeGrpcClient

  constructor(options: ApiOptions) {
    super(options)
    this.exchangeClient = new ExchangeGrpcClient(options.endpoints.exchangeApi)
  }
}
