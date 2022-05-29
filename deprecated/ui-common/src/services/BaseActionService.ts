import { getUrlEndpointForNetwork } from '@injectivelabs/networks'
import { MetricsProvider } from '../providers/MetricsProvider'
import { TxProvider } from '../providers/TxProvider'
import {
  ServiceOptions,
  ServiceActionOptions,
  ServiceOptionsEndpoints,
} from '../types'

export abstract class BaseActionService {
  protected options: ServiceOptions

  protected endpoints: ServiceOptionsEndpoints

  protected metricsProvider: MetricsProvider | undefined

  protected txProvider: TxProvider

  constructor(options: ServiceActionOptions) {
    this.options = options.options
    this.endpoints =
      options.options.endpoints ||
      getUrlEndpointForNetwork(options.options.network)
    this.txProvider = options.txProvider

    if (options.options.metricsProvider) {
      this.metricsProvider = options.options.metricsProvider
    }
  }
}
