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
  private restClient: HttpRestClient

  constructor(network: Network) {
    this.restClient = new HttpRestClient(getAssetMicroserviceEndpoint(network))
  }

  async fetchUsdTokensPriceMap() {
    const { data } = (await this.restClient.get('denoms?withPrice=true')) as {
      data: Record<string, TokenStaticWithPrice>
    }

    const tokenPriceMap: Record<string, number> = Object.values(data).reduce(
      (prices, tokenWithPrice) => {
        const id = tokenWithPrice.coingecko_id || tokenWithPrice.denom

        return { ...prices, [id.toLowerCase()]: tokenWithPrice.price.price }
      },
      {},
    )

    return tokenPriceMap
  }
}
