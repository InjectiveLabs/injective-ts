import { HttpClient } from '@injectivelabs/utils'

export default class BaseRestConsumer {
  protected client: HttpClient

  constructor(endpoint: string) {
    this.client = new HttpClient(endpoint)
  }
}
