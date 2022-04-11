import { getUrlEndpointForNetwork } from '@injectivelabs/networks'
import { MetricsProvider } from '../providers/MetricsProvider'
import { ServiceOptions, ServiceOptionsEndpoints } from '../types'

export abstract class BaseService {
  protected options: ServiceOptions

  protected endpoints: ServiceOptionsEndpoints

  protected metricsProvider: MetricsProvider | undefined

  constructor(options: ServiceOptions) {
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
