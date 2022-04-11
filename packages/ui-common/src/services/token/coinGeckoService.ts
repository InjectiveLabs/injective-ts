import { CoinGeckoApi } from '@injectivelabs/token-utils'
import { BigNumberInBase, HttpClient } from '@injectivelabs/utils'
import { BaseService } from '../BaseService'
import { ASSET_PRICE_SERVICE_URL } from '../../constants'
import { ServiceOptions, CoinPriceFromInjectiveService } from '../../types'

const commonlyUsedCoinGeckoIds = [
  'bitcoin',
  'ethereum',
  'injective-protocol',
  'tether',
  'terrausd',
]

export class TokenCoinGeckoService extends BaseService {
  private coinGeckoApi: CoinGeckoApi

  private httpClient: HttpClient

  private cache: Record<string, number> = {} // coinGeckoId -> priceInUsd

  constructor(
    options: ServiceOptions,
    coinGeckoOptions: { baseUrl: string; apiKey: string },
  ) {
    super(options)
    this.coinGeckoApi = new CoinGeckoApi(coinGeckoOptions)
    this.httpClient = new HttpClient(ASSET_PRICE_SERVICE_URL)
  }

  async fetchUsdTokenPrice(coinId: string) {
    if (!coinId) {
      return 0
    }

    try {
      try {
        const priceFromCache = await this.getUsdTokenPriceFromCache(coinId)

        if (priceFromCache) {
          return priceFromCache
        }
      } catch (e) {
        //
      }

      try {
        const priceInUsdFromInjectiveService =
          await this.fetchUsdTokenPriceFromInjectiveService(coinId)

        if (priceInUsdFromInjectiveService) {
          return priceInUsdFromInjectiveService
        }
      } catch (e) {
        //
      }

      const priceInUsdFromCoinGecko =
        await this.fetchUsdTokenPriceFromCoinGecko(coinId)

      if (priceInUsdFromCoinGecko) {
        return priceInUsdFromCoinGecko
      }

      return 0
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchUsdTokenPriceFromInjectiveService(coinId: string) {
    if (!coinId) {
      return 0
    }

    try {
      const pricesResponse = (await this.httpClient.get('price', {
        coinIds: coinId,
        currency: 'usd',
      })) as {
        data: {
          data: CoinPriceFromInjectiveService[]
        }
      }

      if (pricesResponse.data.data.length === 0) {
        return 0
      }

      const [priceResponse] = pricesResponse.data.data

      if (!priceResponse) {
        return 0
      }

      const { current_price: currentPrice } = priceResponse

      if (!currentPrice) {
        return 0
      }

      const priceInUsd = new BigNumberInBase(currentPrice).toNumber()

      this.cache[coinId] = priceInUsd

      return priceInUsd
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchUsdTokenPriceFromCoinGecko(coinId: string) {
    if (!coinId) {
      return 0
    }

    try {
      const currentPrice = await this.coinGeckoApi.fetchUsdPrice(coinId)

      if (!currentPrice) {
        return 0
      }

      const priceInUsd = new BigNumberInBase(currentPrice).toNumber()

      this.cache[coinId] = priceInUsd

      return priceInUsd
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchUsdTokenPriceFromCoinGeckoNoThrow(coinId: string) {
    if (!coinId) {
      return 0
    }

    try {
      const priceInUsd = await this.coinGeckoApi.fetchUsdPrice(coinId)

      if (!priceInUsd) {
        return 0
      }

      return new BigNumberInBase(priceInUsd).toNumber()
    } catch (e: any) {
      return 0
    }
  }

  private async getUsdTokenPriceFromCache(coinId: string) {
    try {
      const cacheIsEmpty = Object.keys(this.cache).length === 0

      if (cacheIsEmpty) {
        await this.initCache()
      }
    } catch (e: any) {
      throw new Error(e.message)
    }

    if (this.cache[coinId]) {
      return this.cache[coinId]
    }

    return undefined
  }

  private async initCache(): Promise<void> {
    try {
      const pricesResponse = (await this.httpClient.get('price', {
        coinIds: commonlyUsedCoinGeckoIds.join(','),
        currency: 'usd',
      })) as {
        data: {
          data: CoinPriceFromInjectiveService[]
        }
      }

      if (pricesResponse.data.data.length === 0) {
        return
      }

      this.cache = pricesResponse.data.data.reduce(
        (cache, coin) => ({
          ...cache,
          [coin.id]: new BigNumberInBase(coin.current_price).toNumber(),
        }),
        {},
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
