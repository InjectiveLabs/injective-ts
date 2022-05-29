import { Network } from '@injectivelabs/networks'
import { ChainId } from '@injectivelabs/ts-types'
import { DenomFactory } from './DenomFactory'
import { Erc20Service } from './Erc20Service'
import { TokenPrice } from './TokenPrice'

export class TokenService {
  public network: Network

  public chainId: ChainId

  public denom: DenomFactory

  public price: TokenPrice

  public erc20: Erc20Service

  constructor({
    chainId,
    network,
    coinGeckoOptions,
    alchemyRpcEndpoint,
  }: {
    chainId: ChainId
    network: Network
    coinGeckoOptions: { baseUrl: string; apiKey: string }
    alchemyRpcEndpoint: string
  }) {
    this.network = network
    this.chainId = chainId
    this.denom = new DenomFactory(network)
    this.price = new TokenPrice(coinGeckoOptions)
    this.erc20 = new Erc20Service({ network, alchemyRpcEndpoint, chainId })
  }
}
