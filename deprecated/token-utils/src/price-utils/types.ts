export enum TokenPriceType {
  CoinGecko = 'coin-gecko',
}

export interface TokenPriceUtilOptions {
  baseUrl: string
  apiKey?: string
}
