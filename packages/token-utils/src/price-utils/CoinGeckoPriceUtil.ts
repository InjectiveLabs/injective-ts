import { HttpClient } from '@injectivelabs/utils'
import { HttpException } from '@injectivelabs/exceptions'
import { CoinGeckoReturnObject, CoinGeckoCoinResponse } from '../types'
import { TokenPriceUtilBase } from './TokenPriceUtilBase'
import { TokenPriceUtilOptions } from './types'

export default class CoinGeckoPriceUtil extends TokenPriceUtilBase {
  private httpClient: HttpClient

  private apiKey: string

  constructor({ apiKey, baseUrl }: TokenPriceUtilOptions) {
    super()
    this.httpClient = new HttpClient(baseUrl)
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
    } catch (e: any) {
      throw new HttpException(e.message)
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
    } catch (e: any) {
      throw new HttpException(e.message)
    }
  }
}
