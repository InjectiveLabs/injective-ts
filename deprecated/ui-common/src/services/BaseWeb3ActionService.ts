import { getUrlEndpointForNetwork } from '@injectivelabs/networks'
import type { Web3Strategy } from '@injectivelabs/web3-strategy'
import { MetricsProvider } from '../providers/MetricsProvider'
import {
  ServiceOptions,
  ServiceWeb3ActionOptions,
  ServiceOptionsEndpoints,
} from '../types'

export abstract class BaseWeb3ActionService {
  protected options: ServiceOptions

  protected endpoints: ServiceOptionsEndpoints

  protected metricsProvider: MetricsProvider | undefined

  protected web3Strategy: Web3Strategy

  constructor(options: ServiceWeb3ActionOptions) {
    this.options = options.options
    this.endpoints =
      options.options.endpoints ||
      getUrlEndpointForNetwork(options.options.network)
    this.web3Strategy = options.web3Strategy

    if (options.options.metricsProvider) {
      this.metricsProvider = options.options.metricsProvider
    }
  }
}
