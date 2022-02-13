import { TokenMeta } from '@injectivelabs/token-metadata'
import { UiBridgeTransaction } from '../bridge/types'
import { UiCoin } from '../types/common'

export type TokenAddress = string
export type TokenAssetData = string
export type TokenSymbol = string

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

export interface GrpcTokenMeta {
  name: string
  address: string
  symbol: string
  logo: string
  decimals: number
  updatedAt: number
}

export interface BankBalanceWithTokenMetaData {
  balance: string
  denom: string
  token: Token
}

export interface BankBalanceWithTokenMetaDataAndBalance {
  balance: string
  denom: string
  token: TokenWithBalance
}

export interface BankBalanceWithTokenMetaDataAndBalanceInBase {
  balance: string
  denom: string
  token: TokenWithBalance
}

export interface BankBalanceWithTokenMetaDataAndBalanceWithUsdBalance
  extends BankBalanceWithTokenMetaDataAndBalance {
  balanceInUsd: string
}

export interface IbcBankBalanceWithTokenMetaData
  extends BankBalanceWithTokenMetaData {
  baseDenom: string
  channelId: string
}

export interface IbcBankBalanceWithTokenMetaDataAndBalance
  extends BankBalanceWithTokenMetaDataAndBalance {
  baseDenom: string
  channelId: string
  token: TokenWithBalance
}

export interface SubaccountBalanceWithTokenMetaData {
  availableBalance: string
  totalBalance: string
  denom: string
  token: Token
}

export interface SubaccountBalanceWithTokenMetaDataAndBalance {
  availableBalance: string
  totalBalance: string
  denom: string
  token: TokenWithBalance
}

export interface SubaccountBalanceWithTokenMetaDataWithUsdBalance
  extends SubaccountBalanceWithTokenMetaData {
  balanceInUsd: string
}

export interface UiSupplyCoinForSelect extends UiCoin {
  code: string
  label: string
}

export interface UiBridgeTransactionWithTokenMeta extends UiBridgeTransaction {
  token: Token
}
