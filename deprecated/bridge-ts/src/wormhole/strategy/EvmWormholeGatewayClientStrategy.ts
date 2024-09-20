import { Network } from '@injectivelabs/networks'
import { EvmWormholeGatewayClient } from '../gateway-clients/EvmWormholeGatewayClient'
import { Provider, WormholeClient, WormholeSource } from '..'
import { ethers } from 'ethers'
import { EvmWormholeClientStrategy } from './EvmWormholeClientStrategy'

export class EvmWormholeGatewayClientStrategy
  extends EvmWormholeClientStrategy
  implements
    WormholeClient<
      ethers.ContractReceipt & { txHash: string },
      ethers.providers.TransactionReceipt
    >
{
  public wormholeSource: WormholeSource = WormholeSource.Ethereum

  public strategies: { [key in WormholeSource]?: EvmWormholeGatewayClient }

  constructor(args: {
    network: Network
    wormholeRpcUrl?: string
    wormholeRestUrl?: string
    provider: Provider
    wormholeSource?: WormholeSource
  }) {
    super(args)

    this.wormholeSource = args.wormholeSource || WormholeSource.Ethereum
    this.strategies = {
      [WormholeSource.Ethereum]: new EvmWormholeGatewayClient({
        ...args,
        wormholeSource: WormholeSource.Ethereum,
      }),
      [WormholeSource.Polygon]: new EvmWormholeGatewayClient({
        ...args,
        wormholeSource: WormholeSource.Polygon,
      }),
      [WormholeSource.Arbitrum]: new EvmWormholeGatewayClient({
        ...args,
        wormholeSource: WormholeSource.Arbitrum,
      }),
    }
  }
}
