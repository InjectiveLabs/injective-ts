import { CoinGeckoApi } from '@injectivelabs/token-utils'
import { BigNumberInBase, HttpClient } from '@injectivelabs/utils'
import { BaseService } from '../BaseService'
import { ServiceOptions, CoinPriceFromInjectiveService } from '../types'

export class TokenCoinGeckoService extends BaseService {
  private coinGeckoApi: CoinGeckoApi

  private httpClient: HttpClient

  constructor(
    options: ServiceOptions,
    coinGeckoOptions: { baseUrl: string; apiKey: string },
  ) {
    super(options)
    this.coinGeckoApi = new CoinGeckoApi(coinGeckoOptions)
    this.httpClient = new HttpClient(
      'https://testnet.asset.injective.dev/asset-price/v1/coin',
    )
  }

  async fetchUsdTokenPrice(coinId: string) {
    if (!coinId) {
      return 0
    }

    try {
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

      const { current_price: priceInUsd } = priceResponse

      if (!priceInUsd) {
        return 0
      }

      return new BigNumberInBase(priceInUsd).toNumber()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchUsdTokenPriceFromCoinGecko(coinId: string) {
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
}
