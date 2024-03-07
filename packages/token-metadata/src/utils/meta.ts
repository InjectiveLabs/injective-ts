import { INJ_DENOM } from '@injectivelabs/utils'
import {
  Token,
  IbcToken,
  TokenBase,
  TokenType,
  Cw20TokenMetaWithSource,
  IbcTokenMetaWithSource,
} from '../types'
import {
  getIbcMeta,
  getCw20Meta,
  isCw20ContractAddress,
  getNativeTokenFactoryMeta,
} from './helpers'
import { getChannelIdFromPath } from '../ibc'

/** @deprecated - use getTokenInfo */
export const getTokenTypeFromDenom = (denom: string) => {
  if (denom === INJ_DENOM) {
    return TokenType.Native
  }

  if (isCw20ContractAddress(denom)) {
    return TokenType.Cw20
  }

  if (denom.startsWith('ibc')) {
    return TokenType.Ibc
  }

  if (denom.startsWith('factory/')) {
    return TokenType.TokenFactory
  }

  if (denom.startsWith('peggy')) {
    return TokenType.Erc20
  }

  if (denom.startsWith('share')) {
    return TokenType.InsuranceFund
  }

  return TokenType.Cw20
}

/** @deprecated - use getTokenInfo */
export const getTokenSymbol = (token: Token) => {
  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return meta?.symbol || token.symbol
    }

    const meta = getNativeTokenFactoryMeta(token)

    return meta?.symbol || token.symbol
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.symbol || token.symbol
  }

  if (token.denom.startsWith('ibc')) {
    return token.ibc?.symbol || token.symbol
  }

  return token.symbol
}

/** @deprecated - use getTokenInfo */
export const getTokenLogo = (token: Token) => {
  if (isCw20ContractAddress(token.denom)) {
    return token.cw20?.name || token.name
  }

  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return meta?.logo || token.logo
    }

    const meta = getNativeTokenFactoryMeta(token)

    return meta?.logo || token.logo
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.name || token.name
  }

  if (token.denom.startsWith('ibc')) {
    return token.ibc?.name || token.name
  }

  return token.name
}

/** @deprecated - use getTokenInfo */
export const getTokenName = (token: Token) => {
  if (isCw20ContractAddress(token.denom)) {
    return token.cw20?.name || token.name
  }

  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return meta?.name || token.name
    }

    const meta = getNativeTokenFactoryMeta(token)

    return meta?.name || token.name
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.name || token.name
  }

  if (token.denom.startsWith('ibc')) {
    return token.ibc?.name || token.name
  }

  return token.name
}

/** @deprecated - use getTokenInfo */
export const getTokenDecimals = (token: Token) => {
  if (token.denom === INJ_DENOM) {
    return token.decimals
  }

  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return meta?.decimals || token.decimals
    }

    const meta = getNativeTokenFactoryMeta(token)

    return meta?.decimals || token.decimals
  }

  if (token.denom.startsWith('ibc')) {
    const meta = getIbcMeta(token)

    return meta?.decimals || token.decimals
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.decimals || token.decimals
  }

  if (token.denom.startsWith('share')) {
    return token.decimals
  }

  return token.decimals
}

/** @deprecated - use getTokenInfo */
export const getTokenAddress = (token: Token) => {
  if (token.denom === INJ_DENOM) {
    return token.erc20?.address
  }

  if (token.denom.startsWith('inj')) {
    return token.cw20?.address
  }

  if (token.denom.startsWith('factory/')) {
    const [, , address] = token.denom

    return address
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.address
  }

  if (token.denom.startsWith('share')) {
    return ''
  }

  return ''
}

export const getTokenInfo = (token: TokenBase) => {
  const tokenType = getTokenTypeFromDenom(token.denom)

  if (isCw20ContractAddress(token.denom)) {
    const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

    return {
      symbol: meta?.symbol || token.symbol,
      name: meta?.name || token.name,
      logo: meta?.logo || token.logo,
      decimals: meta?.decimals || token.decimals,
      coinGeckoId: meta?.coinGeckoId || token.coinGeckoId,
      cw20: meta,
      tokenType,
    }
  }

  if (token.denom.startsWith('factory/')) {
    const [address] = token.denom.split('/').reverse()

    if (isCw20ContractAddress(address)) {
      const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

      return {
        symbol: meta?.symbol || token.symbol || '',
        name: meta?.name || token.name || '',
        logo: meta?.logo || token.logo,
        decimals: meta?.decimals || token.decimals || 0,
        coinGeckoId: meta?.coinGeckoId || token.coinGeckoId,
        cw20: meta,
        tokenType,
      }
    }

    const meta = getNativeTokenFactoryMeta(token)

    return {
      symbol: meta?.symbol || token.symbol || '',
      name: meta?.name || token.name || '',
      logo: meta?.logo || token.logo || '',
      decimals: meta?.decimals || token.decimals || 0,
      coinGeckoId: meta?.coinGeckoId || token.coinGeckoId,
      tokenFactory: meta,
      tokenType,
    }
  }

  if (token.denom.startsWith('peggy') || token.denom === INJ_DENOM) {
    return {
      symbol: token.erc20?.symbol || token.symbol || '',
      name: token.erc20?.name || token.name || '',
      logo: token.erc20?.logo || token.logo || '',
      decimals: token.erc20?.decimals || token.decimals || 0,
      coinGeckoId: token.erc20?.coinGeckoId || token.coinGeckoId,
      tokenType,
    }
  }

  if (token.denom.startsWith('0x') && token.denom.length === 42) {
    return {
      symbol: token.erc20?.symbol || token.evm?.symbol || token.symbol || '',
      name: token.erc20?.name || token.evm?.symbol || token.name || '',
      logo: token.erc20?.logo || token.evm?.symbol || token.logo || '',
      decimals:
        token.erc20?.decimals || token.evm?.symbol || token.decimals || 0,
      coinGeckoId:
        token.erc20?.coinGeckoId || token.evm?.coinGeckoId || token.coinGeckoId,
      tokenType,
    }
  }

  // Including tokens that can be searched by baseDenom symbol
  if (token.denom.startsWith('ibc') || token.ibcs) {
    const meta = getIbcMeta(token) as IbcTokenMetaWithSource

    return {
      symbol: meta?.symbol || token.symbol || '',
      name: meta?.name || token.name || '',
      logo: meta?.logo || token.logo || '',
      decimals: meta?.decimals || token.decimals || 6,
      coinGeckoId: meta?.coinGeckoId || token.coinGeckoId,
      tokenType,
    }
  }

  // Including tokens that can be searched by symbol
  if (token.erc20 || token.evm || token.spl) {
    return {
      symbol:
        token.erc20?.symbol ||
        token.evm?.symbol ||
        token.spl?.symbol ||
        token.symbol ||
        '',
      name:
        token.erc20?.name ||
        token.evm?.name ||
        token.spl?.name ||
        token.name ||
        '',
      logo:
        token.erc20?.logo ||
        token.evm?.logo ||
        token.spl?.logo ||
        token.logo ||
        '',
      decimals:
        token.erc20?.decimals ||
        token.evm?.decimals ||
        token.spl?.decimals ||
        token.decimals ||
        6,
      coinGeckoId:
        token.erc20?.coinGeckoId ||
        token.evm?.coinGeckoId ||
        token.spl?.coinGeckoId ||
        token.coinGeckoId ||
        6,
      tokenType,
    }
  }

  return {
    symbol: token.symbol,
    name: token.name,
    logo: token.logo,
    decimals: token.decimals || 0,
    coinGeckoId: token.coinGeckoId || 0,
    tokenType,
  }
}

export const getIbcTokenFromDenomTrace = ({
  denomTrace,
  token,
}: {
  token: Token
  denomTrace: {
    path: string
    baseDenom: string
  }
}): IbcToken => {
  return {
    ...token,
    symbol: token.ibc?.symbol || token.symbol || '',
    name: token.ibc?.name || token.name || '',
    logo: token.ibc?.logo || token.logo || '',
    decimals: token.ibc?.decimals || token.decimals || 0,
    tokenType: TokenType.Ibc,

    ibc: {
      hash: token.denom.replace('ibc/', ''),
      symbol: denomTrace.baseDenom,
      path: denomTrace.path,
      baseDenom: denomTrace.baseDenom,
      decimals: token.decimals,
      channelId: getChannelIdFromPath(denomTrace.path),
      isNative: !denomTrace.baseDenom.startsWith('ibc'),
    },
  } as IbcToken
}
