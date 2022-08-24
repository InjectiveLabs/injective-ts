import { ChainRestAuthApi } from './rest/ChainRestAuthApi'

/**
 * @category Chain Rest API
 */
export class ChainRestClient {
  auth: ChainRestAuthApi

  constructor(endpoint: string) {
    this.auth = new ChainRestAuthApi(endpoint)
  }
}
