import { HttpClient } from '@injectivelabs/utils'

/**
 * @hidden
 */
export default class BaseRestConsumer {
  protected client: HttpClient

  constructor(endpoint: string) {
    this.client = new HttpClient(endpoint)
  }
}
