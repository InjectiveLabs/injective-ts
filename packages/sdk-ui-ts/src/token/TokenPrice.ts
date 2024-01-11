import { CoinGeckoApi } from '@injectivelabs/token-utils'
import { Network, isDevnet, isTestnet } from '@injectivelabs/networks'
import {
  sleep,
  splitArrayToChunks,
  BigNumberInBase,
  HttpRestClient,
} from '@injectivelabs/utils'
import { HttpRequestException } from '@injectivelabs/exceptions'
import {
  ASSET_PRICE_SERVICE_URL,
  DEVNET_ASSET_PRICE_SERVICE_URL,
  TESTNET_ASSET_PRICE_SERVICE_URL,
} from '../constants'
import { CoinPriceFromInjectiveService } from '../types/token'

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
  private coinGeckoApi: CoinGeckoApi | undefined

  private restClient: HttpRestClient

  private cache: Record<string, number> = {} // coinGeckoId -> priceInUsd

  constructor(
    network?: Network,
    coinGeckoOptions?: {
      baseUrl: string
      apiKey: string
    },
  ) {
    this.restClient = new HttpRestClient(getAssetMicroserviceEndpoint(network))
    this.coinGeckoApi = coinGeckoOptions
      ? new CoinGeckoApi(coinGeckoOptions)
      : undefined
  }

  async fetchUsdTokensPrice(coinIds: string[]) {
    if (coinIds.length === 0) {
      return {}
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

    const coinIdsNotInCache = coinIds.filter(
      (coinId) => !Object.keys(prices).includes(coinId),
    )

    if (coinIdsNotInCache.length === 0) {
      return prices
    }

    const pricesFromInjectiveService =
      await this.fetchUsdPricesFromInjectiveService()

    prices = { ...prices, ...pricesFromInjectiveService }

    const coinIdsNotInCacheAndInjectiveService = coinIds
      .filter((coinId) => !Object.keys(prices).includes(coinId))
      .filter(
        (coinId) =>
          !coinId.startsWith('factory/') &&
          !coinId.startsWith('ibc') &&
          !coinId.startsWith('share') &&
          !coinId.startsWith('peggy'),
      )

    if (coinIdsNotInCacheAndInjectiveService.length === 0) {
      return prices
    }

    const pricesFromCoinGecko =
      await this.fetchUsdTokenPriceFromCoinGeckoInChunks(
        coinIdsNotInCacheAndInjectiveService,
      )

    prices = { ...prices, ...pricesFromCoinGecko }

    const coinIdsNotInCacheAndInjectiveServiceAndCoinGecko = coinIds.filter(
      (coinId) => !Object.keys(prices).includes(coinId),
    )

    if (coinIdsNotInCacheAndInjectiveServiceAndCoinGecko.length === 0) {
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

  async fetchUsdDenomsPrice(denoms: string[]) {
    if (denoms.length === 0) {
      return {}
    }

    let prices: Record<string, number> = {}

    const pricesFromCache = denoms.reduce((prices, coinId) => {
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

    const denomsNotInCache = denoms.filter(
      (denom) => !Object.keys(prices).includes(denom),
    )

    if (denomsNotInCache.length === 0) {
      return prices
    }

    const pricesFromInjectiveService =
      await this.fetchUsdPricesFromInjectiveService()

    prices = { ...prices, ...pricesFromInjectiveService }

    const denomsNotInCacheAndInjectiveService = denoms.filter(
      (denom) => !Object.keys(prices).includes(denom),
    )

    const denomsWithoutPrice = Object.keys(
      denomsNotInCacheAndInjectiveService,
    ).reduce(
      (prices, key) => ({ ...prices, [key]: 0 }),
      {} as Record<string, number>,
    )

    return { ...prices, ...denomsWithoutPrice }
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

    if (!this.coinGeckoApi) {
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

    if (!this.coinGeckoApi) {
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

  private fetchUsdPricesFromInjectiveService = async () => {
    try {
      const pricesResponse = (await this.restClient.get('coin/prices')) as {
        data: {
          data: CoinPriceFromInjectiveService[]
        }
      }

      if (pricesResponse.data.data.length === 0) {
        return {}
      }

      const prices = pricesResponse.data.data.reduce(
        (cache, coin) => ({
          ...cache,
          [coin.id]: new BigNumberInBase(coin.current_price).toNumber(),
        }),
        {} as Record<string, number>,
      )

      this.cache = { ...this.cache, ...prices }

      return prices
    } catch (e) {
      return {}
    }
  }

  private fetchUsdTokenPriceFromCoinGeckoInChunks = async (
    coinIds: string[],
  ) => {
    const CHUNK_SIZE = 5
    const chunks = splitArrayToChunks({
      array: coinIds,
      chunkSize: CHUNK_SIZE,
      filter: (c) => !!c,
    })

    /**
     * We make chunks to ensure that we don't hit the
     * rate limits on CoinGecko by querying multiple
     * prices at the same time as we do multiple
     * calls at the same time
     */
    const response = await Promise.all(
      chunks.map(async (chunk, index) => {
        let prices = {} as Record<string, number>

        for (let i = 0; i < chunk.length; i += 1) {
          const price = await this.fetchUsdTokenPriceFromCoinGeckoNoThrow(
            chunk[i],
          )

          prices[chunk[i]] = price
        }

        if (index < chunks.length - 1) {
          await sleep(500)
        }

        return prices
      }),
    )

    const prices = response.reduce((prices, chunkResponse) => {
      return { ...prices, ...chunkResponse }
    }, {})

    this.cache = { ...this.cache, ...prices }

    return prices
  }

  private async initCache(): Promise<void> {
    try {
      const pricesResponse = (await this.restClient.get('coin/prices')) as {
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
