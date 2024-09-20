import { HttpRestClient } from '@injectivelabs/utils'
import { HttpRequestException } from '@injectivelabs/exceptions'
import { CoinGeckoReturnObject, CoinGeckoCoinResponse } from '../types'
import { TokenPriceUtilBase } from './TokenPriceUtilBase'
import { TokenPriceUtilOptions } from './types'

export default class CoinGeckoPriceUtil extends TokenPriceUtilBase {
  private httpClient: HttpRestClient

  private apiKey: string

  constructor({ apiKey, baseUrl }: TokenPriceUtilOptions) {
    super()
    this.httpClient = new HttpRestClient(baseUrl)
    this.apiKey = apiKey as string
  }

  async fetchPrice(
    coinId: string,
    options: Record<string, any> | undefined = {},
  ) {
    try {
      const actualParams = {
        localization: false,
        community_data: false,
        tickers: false,
        sparkline: false,
        developer_data: false,
        x_cg_pro_api_key: this.apiKey,
        ...options,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${coinId}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data?.market_data?.current_price
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }

  async fetchUsdPrice(
    coinId: string,
    options: Record<string, any> | undefined = {},
  ) {
    try {
      const actualParams = {
        localization: false,
        community_data: false,
        tickers: false,
        sparkline: false,
        developer_data: false,
        x_cg_pro_api_key: this.apiKey,
        ...options,
      }

      const { data } = (await this.httpClient.get(
        `/coins/${coinId}`,
        actualParams,
      )) as CoinGeckoReturnObject<CoinGeckoCoinResponse>

      return data?.market_data?.current_price?.usd
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message))
    }
  }
}
