import { Network } from '@injectivelabs/networks'

export class BaseWormholeClient {
  public network: Network

  public wormholeRpcUrl?: string

  constructor({
    network,
    wormholeRpcUrl,
  }: {
    network: Network
    solanaHostUrl?: string
    wormholeRpcUrl?: string
  }) {
    this.network = network
    this.wormholeRpcUrl = wormholeRpcUrl
  }
}
