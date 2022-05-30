import { ChainRestAuthApi } from './rest/ChainRestAuthApi'

export class ChainRestClient {
  auth: ChainRestAuthApi

  constructor(endpoint: string) {
    this.auth = new ChainRestAuthApi(endpoint)
  }
}
