import { MetricsProvider } from './providers/MetricsProvider'
import { ServiceOptions } from './types'

export abstract class BaseService {
  protected options: ServiceOptions

  protected metricsProvider: MetricsProvider | undefined

  constructor(options: ServiceOptions) {
    this.options = options

    if (options.metrics) {
      this.metricsProvider = new MetricsProvider(options.metrics)
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
