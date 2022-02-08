import { BigNumberInBase } from '@injectivelabs/utils'
import { Token, TokenWithBalance } from '../token/types'

export type BankBalances = Record<string, string>
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

export interface UiCoin {
  amount: string
  denom: string
}

export interface UiSupplyCoinWithoutLabel extends UiCoin {
  code: string
}

export interface UiSupplyCoin extends UiSupplyCoinWithoutLabel {
  label: string
}
