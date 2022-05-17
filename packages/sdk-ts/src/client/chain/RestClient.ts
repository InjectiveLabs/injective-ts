import { AuthRestApi } from './rest/AuthRestApi'

export class RestClient {
  auth: AuthRestApi

  constructor(endpoint: string) {
    this.auth = new AuthRestApi(endpoint)
  }
}
