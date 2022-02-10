import { BigNumberInBase } from '@injectivelabs/utils'
import { UiCoin } from '../types/common'

export type TokenAddress = string
export type TokenAssetData = string
export type TokenSymbol = string

interface Base {
  symbol: string
  name: string
  icon?: string
  decimals: number
}

export interface Token extends Base {
  address: string
  denom: string
  coinGeckoId: string
}

export interface IbcToken extends Token {
  baseDenom: string
  channelId: string
}

export interface TokenWithBalance extends Base {
  address: string
  denom: string
  balance: string // BigNumberInWei
  allowance: string // BigNumberInWei
  coinGeckoId: string
}

export interface TokenWithUsdPrice extends Token {
  usdPrice: number
}

export interface TokenWithBalanceAndPrice extends Base {
  address: string
  denom: string
  isIbc?: boolean
  balance: string // BigNumberInWei
  allowance: string // BigNumberInWei
  usdPrice: number
  coinGeckoId: string
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
  balance: BigNumberInBase
  denom: string
  token: TokenWithBalance
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
  token: TokenWithBalance
}

export interface SubaccountBalanceWithTokenMetaDataWithUsdBalance
  extends SubaccountBalanceWithTokenMetaData {
  balanceInUsd: BigNumberInBase
}

export interface UiSupplyCoinForSelect extends UiCoin {
  code: string
  label: string
}
