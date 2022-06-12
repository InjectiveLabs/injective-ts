import { ApiOptionsEndpoints } from './client/types'

export abstract class BaseApi {
  protected endpoints: ApiOptionsEndpoints

  constructor(endpoints: ApiOptionsEndpoints) {
    this.endpoints = endpoints
  }
}
