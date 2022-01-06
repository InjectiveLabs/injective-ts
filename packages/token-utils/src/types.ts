/* eslint-disable camelcase */
export interface CoinGeckoCoinResponse {
  id: string
  symbol: string
  name: string
  market_data: {
    current_price: {
      chf: number
      eur: number
      gbp: number
      usd: number
    }
    total_volume: {
      chf: number
      eur: number
      gbp: number
      usd: number
    }
    high_24h: {
      chf: number
      eur: number
      gbp: number
      usd: number
    }
    market_cap: {
      chf: number
      eur: number
      gbp: number
      usd: number
    }
    price_change_24h: number
    market_cap_change_percentage_24h: number
  }
}

export interface CoinGeckoReturnObject<T> {
  success: boolean
  message: string
  code: string
  data: T
}

export interface CoinGeckoMarketChartResponse {
  prices: number[][]
  total_volumes: number[][]
}

export interface CoinGeckoCoin {
  id: string
  symbol: string
  name: string
}
