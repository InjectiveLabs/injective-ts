import { CoinGeckoApi } from '@injectivelabs/token-utils'
import { BigNumberInBase, HttpRestClient } from '@injectivelabs/utils'
import { HttpRequestException } from '@injectivelabs/exceptions'
import { ASSET_PRICE_SERVICE_URL } from '../constants'
import { CoinPriceFromInjectiveService } from '../types/token'

const commonlyUsedCoinGeckoIds = [
  'bitcoin',
  'ethereum',
  'injective-protocol',
  'tether',
  'terrausd',
]

export class TokenPrice {
  private coinGeckoApi: CoinGeckoApi

  private restClient: HttpRestClient

  private cache: Record<string, number> = {} // coinGeckoId -> priceInUsd

  constructor(coinGeckoOptions: { baseUrl: string; apiKey: string }) {
    this.restClient = new HttpRestClient(ASSET_PRICE_SERVICE_URL)
    this.coinGeckoApi = new CoinGeckoApi(coinGeckoOptions)
  }

  async fetchUsdTokensPrice(coinIds: string[]) {
    if (coinIds.length === 0) {
      return []
    }

    let prices: Record<string, number> = {}

    const pricesFromCache = coinIds.reduce((prices, coinId) => {
      try {
        const priceFromCache = this.cache[coinId]

        if (priceFromCache) {
          return { ...prices, [coinId]: priceFromCache }
        }

        return prices
      } catch (e) {
        return prices
      }
    }, {} as Record<string, number>)

    prices = { ...prices, ...pricesFromCache }

    const coinIdsNotInCache = Object.keys(prices).filter(
      (coinId) => !coinIds.includes(coinId),
    )

    if (coinIdsNotInCache.length === 0) {
      return prices
    }

    const pricesFromInjectiveService =
      await this.fetchUsdTokenPriceFromInjectiveServiceInChunks(
        coinIdsNotInCache,
      )

    prices = { ...prices, ...pricesFromInjectiveService }

    const coinIdsNotInCacheAndInjectiveService = Object.keys(prices).filter(
      (coinId) => !coinIds.includes(coinId),
    )

    if (coinIdsNotInCacheAndInjectiveService.length === 0) {
      return prices
    }

    const coinIdsWithoutPrice = Object.keys(
      coinIdsNotInCacheAndInjectiveService,
    ).reduce(
      (prices, key) => ({ ...prices, [key]: 0 }),
      {} as Record<string, number>,
    )

    return { ...prices, ...coinIdsWithoutPrice }
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
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchUsdTokenPriceFromInjectiveService(coinId: string) {
    if (!coinId) {
      return 0
    }

    try {
      const pricesResponse = (await this.restClient.get('coin/price', {
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
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
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
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
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
    } catch (e: unknown) {
      return 0
    }
  }

  private async getUsdTokenPriceFromCache(coinId: string) {
    try {
      const cacheIsEmpty = Object.keys(this.cache).length === 0

      if (cacheIsEmpty) {
        await this.initCache()
      }
    } catch (e: unknown) {
      throw new HttpRequestException(new Error((e as any).message))
    }

    if (this.cache[coinId]) {
      return this.cache[coinId]
    }

    return undefined
  }

  private fetchUsdTokenPriceFromInjectiveServiceInChunks = async (
    coinIds: string[],
  ) => {
    const CHUNK_SIZE = 15
    let prices: Record<string, number> = {}

    for (let i = 0; i < coinIds.length; i += CHUNK_SIZE) {
      const chunkCoinIds = coinIds.slice(i, i + CHUNK_SIZE)

      try {
        const pricesResponse = (await this.restClient.get('coin/price', {
          coinIds: chunkCoinIds,
          currency: 'usd',
        })) as {
          data: {
            data: CoinPriceFromInjectiveService[]
          }
        }

        if (pricesResponse.data.data.length === 0) {
          continue
        }

        const chunkResponse = pricesResponse.data.data.reduce(
          (cache, coin) => ({
            ...cache,
            [coin.id]: new BigNumberInBase(coin.current_price).toNumber(),
          }),
          {} as Record<string, number>,
        )

        prices = { ...prices, ...chunkResponse }
      } catch (e) {
        //
      }
    }

    this.cache = { ...this.cache, ...prices }

    return prices
  }

  private async initCache(): Promise<void> {
    try {
      const pricesResponse = (await this.restClient.get('coin/price', {
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
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }
}
