import { ChainRestAuthApi } from './rest/ChainRestAuthApi.js'

/**
 * @category Chain Rest API
 * @hidden
 */
export class ChainRestClient {
  auth: ChainRestAuthApi

  constructor(endpoint: string) {
    this.auth = new ChainRestAuthApi(endpoint)
  }
}
