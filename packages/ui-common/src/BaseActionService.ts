import { Web3Strategy } from '@injectivelabs/web3-strategy'
import { MetricsProvider } from './providers/MetricsProvider'
import { TxProvider } from './providers/TxProvider'
import { ServiceOptions } from './types'

export abstract class BaseActionService {
  protected options: ServiceOptions

  protected metricsProvider: MetricsProvider | undefined

  protected txProvider: TxProvider

  protected web3Strategy: Web3Strategy

  constructor(options: ServiceOptions, web3Strategy: Web3Strategy) {
    this.options = options

    if (options.metrics) {
      this.metricsProvider = new MetricsProvider(options.metrics)
    }

    this.web3Strategy = web3Strategy
    this.txProvider = new TxProvider({
      ...options,
      web3Strategy: this.web3Strategy,
      metricsProvider: this.metricsProvider,
    })
  }
}
