import { HttpRestClient } from '@injectivelabs/utils'
import { Network, isDevnet, isTestnet } from '@injectivelabs/networks'

interface TokenStaticWithPrice {
  denom: string
  coingecko_id: string
  price: {
    price: number
    metadata: {
      source: string
      market_id: string
      market_price: number
      height: number
    }
  }
}

const ASSET_PRICE_SERVICE_URL =
  'https://k8s.mainnet.asset.injective.network/asset-price/v1'
const TESTNET_ASSET_PRICE_SERVICE_URL =
  'https://k8s.testnet.asset.injective.network/asset-price/v1'
const DEVNET_ASSET_PRICE_SERVICE_URL =
  'https://devnet.asset.injective.dev/asset-price/v1'

const getAssetMicroserviceEndpoint = (network: Network = Network.Mainnet) => {
  if (isTestnet(network)) {
    return TESTNET_ASSET_PRICE_SERVICE_URL
  }

  if (isDevnet(network)) {
    return DEVNET_ASSET_PRICE_SERVICE_URL
  }

  return ASSET_PRICE_SERVICE_URL
}

export class TokenPrice {
  private client: HttpRestClient

  constructor(network: Network) {
    this.client = new HttpRestClient(getAssetMicroserviceEndpoint(network))
  }

  async fetchUsdTokensPriceMap() {
    const response = await this.client.retry<{
      data: Record<string, TokenStaticWithPrice>
    }>(() => this.client.get(`denoms?withPrice=true`))

    const tokenPriceMap: Record<string, number> = Object.values(
      response.data,
    ).reduce((prices, tokenWithPrice) => {
      const id = tokenWithPrice.coingecko_id || tokenWithPrice.denom

      return { ...prices, [id.toLowerCase()]: tokenWithPrice.price.price }
    }, {})

    return tokenPriceMap
  }
}
