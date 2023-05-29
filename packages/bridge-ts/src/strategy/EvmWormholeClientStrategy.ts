import { Network } from '@injectivelabs/networks'
import {
  EvmWormholeClient,
  Provider,
} from '../wormhole/clients/EvmWormholeClient'
import { WormholeSource } from '../wormhole'
import { GeneralException } from '@injectivelabs/exceptions'

export class EvmWormholeClientStrategy {
  public wormholeSource: WormholeSource = WormholeSource.Ethereum

  public strategies: { [key in WormholeSource]?: EvmWormholeClient }

  constructor(args: {
    network: Network
    wormholeRpcUrl?: string
    provider: Provider
    wormholeSource?: WormholeSource
  }) {
    this.wormholeSource = args.wormholeSource || WormholeSource.Ethereum
    this.strategies = {
      [WormholeSource.Ethereum]: new EvmWormholeClient({
        ...args,
        wormholeSource: WormholeSource.Ethereum,
      }),
      [WormholeSource.Polygon]: new EvmWormholeClient({
        ...args,
        wormholeSource: WormholeSource.Polygon,
      }),
      [WormholeSource.Arbitrum]: new EvmWormholeClient({
        ...args,
        wormholeSource: WormholeSource.Arbitrum,
      }),
    }
  }

  setWormholeSource(wormholeSource: WormholeSource) {
    this.wormholeSource = wormholeSource
  }

  get strategy(): EvmWormholeClient {
    const { wormholeSource, strategies } = this

    if (!wormholeSource || !strategies[wormholeSource]) {
      throw new GeneralException(
        new Error(`The strategy for ${wormholeSource} not found.`),
      )
    }

    return strategies[wormholeSource] as EvmWormholeClient
  }
}
