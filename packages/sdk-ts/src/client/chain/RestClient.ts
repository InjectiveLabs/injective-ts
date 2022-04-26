import { AuthRestApi } from './rest/AuthRestApi'

export class RestClient {
  authRestApi: AuthRestApi

  constructor(endpoint: string) {
    this.authRestApi = new AuthRestApi(endpoint)
  }
}
