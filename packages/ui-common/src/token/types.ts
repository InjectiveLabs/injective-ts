import { TokenMeta } from '@injectivelabs/token-metadata'
import { UiBridgeTransaction } from '../bridge/types'

export type TokenAddress = string
export type TokenAssetData = string
export type TokenSymbol = string

export interface GrpcTokenMeta {
  name: string
  address: string
  symbol: string
  logo: string
  decimals: number
  updatedAt: number
}

/**
 * Token is an interface that includes the denom
 * alongside the TokenMeta (name, decimals, symbol, etc)
 */
export interface Token extends TokenMeta {
  denom: string
  isIbc?: boolean
}

export interface IbcToken extends Token {
  baseDenom: string
  channelId: string
}

export interface TokenWithBalance extends Token {
  balance: string
  allowance: string
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
  token: Token
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

export interface SubaccountBalanceWithTokenAndBalance {
  availableBalance: string
  totalBalance: string
  denom: string
  token: TokenWithBalance
}

export interface SubaccountBalanceWithTokenWithUsdBalance
  extends SubaccountBalanceWithToken {
  balanceInUsd: string
}

export interface UiBridgeTransactionWithToken extends UiBridgeTransaction {
  token: Token
}
