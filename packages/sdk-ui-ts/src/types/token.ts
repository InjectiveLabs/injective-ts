/* eslint-disable camelcase */
import { Token } from '@injectivelabs/token-metadata'
import { UiBridgeTransaction } from './bridge'

export interface CoinPriceFromInjectiveService {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_change_percentage: number
  ath_date: Date
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: Date
}

export type BalanceWithToken = {
  token: Token
  denom: string
  balance: string
}

export type BalanceWithTokenAndPrice = BalanceWithToken & {
  usdPrice: number
}

export interface BalanceWithTokenWithErc20Balance extends BalanceWithToken {
  erc20Balance: {
    allowance: string
    balance: string
  }
}

export interface BalanceWithTokenWithSplBalance extends BalanceWithToken {
  splBalance: {
    allowance: string
    balance: string
  }
}

export interface BalanceWithTokenWithIbcBalance extends BalanceWithToken {
  ibcBalance: {
    balance: string
  }
}

export interface BalanceWithTokenWithCw20Balance extends BalanceWithToken {
  cw20Balance: {
    balance: string
  }
}

export interface BalanceWithTokenWithErc20BalanceWithPrice
  extends BalanceWithTokenWithErc20Balance {
  usdPrice: number
}

export interface BalanceWithTokenWithSplBalanceWithPrice
  extends BalanceWithTokenWithSplBalance {
  usdPrice: number
}

export interface BalanceWithTokenWithIbcBalanceWithPrice
  extends BalanceWithTokenWithIbcBalance {
  usdPrice: number
}

export interface BalanceWithTokenWithCw20BalanceWithPrice
  extends BalanceWithTokenWithCw20Balance {
  usdPrice: number
}

export interface BalanceWithTokenAndPriceWithUsdBalance
  extends BalanceWithTokenAndPrice {
  balanceInUsd: string
}

export interface SubaccountBalanceWithToken {
  availableBalance: string
  totalBalance: string
  denom: string
  token: Token
}

export interface SubaccountBalanceWithTokenAndPrice
  extends SubaccountBalanceWithToken {
  usdPrice: number
}

export interface SubaccountBalanceWithTokenWithUsdBalance
  extends SubaccountBalanceWithTokenAndPrice {
  balanceInUsd: string
}

export interface DenomTrace {
  baseDenom: string
  path: string
}

export interface UiBridgeTransactionWithToken extends UiBridgeTransaction {
  token: Token
}
