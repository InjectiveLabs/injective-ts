import { getUrlEndpointForNetwork } from '@injectivelabs/networks'
import { MetricsProvider } from './classes/MetricsProvider'
import { ApiOptions, ApiOptionsEndpoints } from './client/types'

export abstract class BaseApi {
  protected options: ApiOptions

  protected endpoints: ApiOptionsEndpoints

  protected metricsProvider: MetricsProvider | undefined

  constructor(options: ApiOptions) {
    this.options = options
    this.endpoints =
      options.endpoints || getUrlEndpointForNetwork(options.network)

    if (options.metricsProvider) {
      this.metricsProvider = options.metricsProvider
    }
  }

  protected async fetchOrFetchAndMeasure<T>(
    promise: Promise<T>,
    bucket?: string,
  ): Promise<T> {
    if (!this.metricsProvider || !bucket) {
      return (await promise) as T
    }

    return this.metricsProvider.sendAndRecord(promise, bucket)
  }
}
