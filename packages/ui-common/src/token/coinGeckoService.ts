import { CoinGeckoApi } from '@injectivelabs/token-utils'
import { BigNumberInBase } from '@injectivelabs/utils'
import { TokenServiceOptions } from '../types'

export class TokenCoinGeckoService {
  // @ts-expect-error
  private options: TokenServiceOptions

  private coinGeckoApi: CoinGeckoApi

  constructor({
    options,
    coinGeckoOptions,
  }: {
    options: TokenServiceOptions
    coinGeckoOptions: { baseUrl: string; apiKey: string }
  }) {
    this.options = options
    this.coinGeckoApi = new CoinGeckoApi(coinGeckoOptions)
  }

  async getUsdTokenPriceFromCoinGecko(coinId: string) {
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
}
