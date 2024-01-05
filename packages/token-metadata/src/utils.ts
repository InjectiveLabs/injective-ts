import { INJ_DENOM } from '@injectivelabs/utils'
import {
  Token,
  TokenMeta,
  TokenType,
  TokenSource,
  IbcTokenMeta,
  Cw20TokenMeta,
  Cw20TokenSingle,
  TokenVerification,
  Cw20TokenMetaWithSource,
} from './types'
import { ibcBaseDenoms } from './tokens/tokens'
import { getChannelIdFromPath } from './ibc'
import {
  Network,
  getCw20AdapterContractForNetwork,
} from '@injectivelabs/networks'
import { TokenMetaUtilsFactory } from './TokenMetaUtilsFactory'

const getCw20Meta = (
  token: Token,
): Cw20TokenMetaWithSource | Cw20TokenMeta | undefined => {
  const denomToLowerCase = token.denom
  const cw20MetaFromCw20s = token.cw20s?.find((meta) =>
    denomToLowerCase.includes(meta.address),
  )

  return cw20MetaFromCw20s || token.cw20 || undefined
}

export const getIbcTokenMetaFromDenomTrace = ({
  hash,
  path,
  decimals,
  baseDenom,
}: {
  decimals: number
  hash: string
  path: string
  baseDenom: string
}): IbcTokenMeta => ({
  hash,
  path,
  baseDenom,
  decimals,
  channelId: getChannelIdFromPath(path),
  isNative: !baseDenom.startsWith('ibc'),
})

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

export const getTokenSymbol = (token: Token) => {
  if (token.denom.startsWith('factory/')) {
    const meta = getCw20Meta(token) as Cw20TokenMetaWithSource

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

export const getTokenDecimals = (token: Token) => {
  if (token.denom === INJ_DENOM) {
    return token.decimals
  }

  if (isCw20ContractAddress(token.denom)) {
    return token.cw20?.decimals || token.decimals
  }

  if (token.denom.startsWith('factory/')) {
    const meta = getCw20Meta(token)

    return meta?.decimals || token.decimals
  }

  if (token.denom.startsWith('ibc')) {
    return token.ibc?.decimals || token.decimals
  }

  if (token.denom.startsWith('peggy')) {
    return token.erc20?.decimals || token.decimals
  }

  if (token.denom.startsWith('share')) {
    return token.decimals
  }

  return token.decimals
}

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

/**
 * This function can be used to get a token with
 * cw20 information when we have multiple
 * cw20 variations of the same token based on the address/denom
 */
export const getCw20TokenSingle = (
  token: Token | TokenMeta,
  source?: TokenSource,
): Cw20TokenSingle | undefined => {
  const { cw20, cw20s } = token
  const denom = (token as Token).denom || ''

  if (!cw20 && !cw20s) {
    return
  }

  if (cw20) {
    return {
      ...token,
      cw20,
      denom: cw20.address,
      tokenType: getTokenTypeFromDenom(cw20.address),
    }
  }

  if (cw20s) {
    if (source) {
      const cw20 = cw20s.find((cw20) => cw20.source === source)

      return cw20
        ? {
            ...token,
            cw20,
            denom: cw20.address,
            symbol: cw20.symbol,
            tokenType: getTokenTypeFromDenom(cw20.address),
          }
        : undefined
    }

    if (denom) {
      const [cw20Address] = denom.startsWith('inj')
        ? [denom]
        : denom.split('/').reverse()

      const cw20 = cw20s.find((cw20) => cw20.address === cw20Address)

      return cw20
        ? {
            ...token,
            cw20,
            denom: cw20.address,
            symbol: cw20.symbol,
            tokenType: getTokenTypeFromDenom(cw20.address),
          }
        : undefined
    }
  }

  return undefined
}

export const getTokenFromMeta = (meta: TokenMeta, denom?: string): Token => {
  const isBaseIbcDenom =
    ibcBaseDenoms.includes(denom || '') || meta.ibc?.baseDenom === denom

  const tokenType = isBaseIbcDenom
    ? TokenType.Ibc
    : getTokenTypeFromDenom(denom || '')

  const token = {
    ...meta,
    tokenType,
    denom: denom || '',
  }

  const tokenWithDecimalsAndSymbol = {
    ...token,
    tokenType,
    decimals: getTokenDecimals(token),
    symbol: getTokenSymbol(token),
  }

  if (![TokenType.TokenFactory, TokenType.Cw20].includes(tokenType)) {
    return tokenWithDecimalsAndSymbol
  }

  /**
   * If there are multiple cw20 variations
   * of the token we find the one that corresponds
   * to the contract address and set it on the cw20 field
   *
   * If there is only one cw20 version then we use that one
   * as the default version
   */
  if (tokenWithDecimalsAndSymbol.cw20) {
    return {
      ...tokenWithDecimalsAndSymbol,
      cw20s: [],
    }
  }

  if (tokenWithDecimalsAndSymbol.cw20s) {
    return {
      ...tokenWithDecimalsAndSymbol,
      ...getCw20TokenSingle({
        ...tokenWithDecimalsAndSymbol,
        denom,
        tokenType: TokenType.Cw20,
      }),
      tokenType,
      denom: tokenWithDecimalsAndSymbol.denom,
    }
  }

  return tokenWithDecimalsAndSymbol
}

export const getUnknownToken = (denom: string): Token => {
  return {
    denom,
    name: denom,
    symbol: denom,
    decimals: 18,
    logo: 'unknown.png',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
    tokenVerification: TokenVerification.Unverified,
  } as Token
}

export const getUnknownTokenWithSymbol = (denom: string): Token => {
  return {
    denom,
    name: denom,
    symbol: 'UNKNOWN',
    decimals: 0,
    logo: 'unknown.png',
    coinGeckoId: '',
    tokenType: TokenType.Unknown,
    tokenVerification: TokenVerification.Unverified,
  } as Token
}

export const isCw20ContractAddress = (address: string) =>
  address.length === 42 && address.startsWith('inj')

/**
 * Token factory denoms created by the adapter contract
 */
export const getTokenFactoryDenomByAdapter = (
  cw20address: string,
  network: Network = Network.Mainnet,
) => {
  return `factory/${getCw20AdapterContractForNetwork(network)}/${cw20address}`
}

export const getPeggyDenomFromSymbolOrName = (
  symbolOrName: string,
  network: Network = Network.Mainnet,
) => {
  const tokenMetaUtils = TokenMetaUtilsFactory.make(network)
  const metaFromSymbol = tokenMetaUtils.getMetaBySymbol(symbolOrName)
  const metaFromName = tokenMetaUtils.getMetaByName(symbolOrName)

  if (!metaFromSymbol && !metaFromName) {
    return
  }

  if (!metaFromSymbol?.erc20 && !metaFromName?.erc20) {
    return
  }

  return `peggy${(metaFromSymbol || metaFromName)?.erc20?.address}`
}

export const getIbcDenomFromSymbolOrName = (
  symbolOrName: string,
  network: Network = Network.Mainnet,
) => {
  const tokenMetaUtils = TokenMetaUtilsFactory.make(network)
  const metaFromName = tokenMetaUtils.getMetaBySymbol(symbolOrName)
  const metaFromSymbol = tokenMetaUtils.getMetaByName(symbolOrName)

  if (!metaFromSymbol && !metaFromName) {
    return
  }

  if (!metaFromSymbol?.ibc && !metaFromName?.ibc) {
    return
  }

  return `ibc/${(metaFromSymbol || metaFromName)?.ibc?.hash}`
}

export const getCw20FromSymbolOrName = (
  symbolOrName: string,
  network: Network = Network.Mainnet,
  source?: TokenSource,
) => {
  const tokenMetaUtils = TokenMetaUtilsFactory.make(network)
  const metaFromName = tokenMetaUtils.getMetaBySymbol(symbolOrName)
  const metaFromSymbol = tokenMetaUtils.getMetaByName(symbolOrName)

  if (!metaFromSymbol && !metaFromName) {
    return
  }

  if (
    !metaFromSymbol?.cw20 &&
    !metaFromName?.cw20 &&
    !metaFromSymbol?.cw20s &&
    !metaFromName?.cw20s
  ) {
    return
  }

  const meta = (metaFromName || metaFromSymbol)!

  if (meta.cw20) {
    return getTokenFactoryDenomByAdapter(meta.cw20.address, network)
  }

  if (source) {
    const cw20 = meta?.cw20s?.find((cw20) => cw20.source === source)

    return cw20
      ? getTokenFactoryDenomByAdapter(cw20.address, network)
      : undefined
  }

  const [cw20] = meta.cw20s || []

  return getTokenFactoryDenomByAdapter(cw20.address, network)
}
