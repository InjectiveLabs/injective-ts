/* eslint-disable camelcase */
import { Token, IbcToken, TokenMeta } from '@injectivelabs/token-metadata'
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

export interface TokenWithBalance extends Token {
  balance: string
  allowance: string
  baseDenom?: string
  channelId?: string
  isCanonical?: boolean
}

export interface TokenWithUsdPrice extends Token {
  usdPrice: number
}

export interface TokenWithBalanceAndPrice extends TokenWithBalance {
  usdPrice: number
}

export interface BankBalanceWithToken {
  balance: string
  denom: string
  token: Token | IbcToken
}

export interface BankBalanceWithTokenAndBalance {
  balance: string
  denom: string
  token: TokenWithBalance
}

export interface BankBalanceWithTokenAndBalanceInBase {
  balance: string
  denom: string
  token: TokenWithBalance
}

export interface BankBalanceWithTokenAndBalanceWithUsdBalance
  extends BankBalanceWithTokenAndBalance {
  balanceInUsd: string
}

export interface IbcBankBalanceWithToken extends BankBalanceWithToken {
  baseDenom: string
  channelId: string
}

export interface IbcBankBalanceWithTokenAndBalance
  extends BankBalanceWithTokenAndBalance {
  baseDenom: string
  channelId: string
  token: TokenWithBalance
}

export interface SubaccountBalanceWithToken {
  availableBalance: string
  totalBalance: string
  denom: string
  token: Token
}

export interface SubaccountBalanceWithTokenAndUsdPrice {
  availableBalance: string
  totalBalance: string
  denom: string
  token: TokenWithUsdPrice
}

export interface SubaccountBalanceWithTokenWithUsdBalance
  extends SubaccountBalanceWithToken {
  balanceInUsd: string
}

export interface SubaccountBalanceWithTokenAndUsdPriceAndUsdBalance
  extends SubaccountBalanceWithTokenAndUsdPrice {
  balanceInUsd: string
}

export interface DenomTrace {
  baseDenom: string
  path: string
}

export interface UiBridgeTransactionWithToken extends UiBridgeTransaction {
  token: Token
}

export interface TokenMetaWithUsdPrice extends TokenMeta {
  usdPrice?: number
}
