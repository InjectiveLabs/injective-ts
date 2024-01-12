import {
  Network,
  getCw20AdapterContractForNetwork,
} from '@injectivelabs/networks'
import { TokenMetaUtilsFactory } from '../TokenMetaUtilsFactory'
import {
  Cw20TokenMeta,
  Cw20TokenMetaWithSource,
  IbcTokenMeta,
  NativeTokenFactoryMeta,
  Token,
  TokenBase,
  TokenSource,
  TokenType,
  TokenVerification,
} from '../types'
import { getChannelIdFromPath } from '../ibc'

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

  if (!metaFromSymbol?.cw20s && !metaFromName?.cw20s) {
    return
  }

  const meta = (metaFromName || metaFromSymbol)!

  if (source) {
    const cw20 = meta?.cw20s?.find((cw20) => cw20.source === source)

    return cw20
      ? getTokenFactoryDenomByAdapter(cw20.address, network)
      : undefined
  }

  const [cw20] = meta.cw20s || []

  return getTokenFactoryDenomByAdapter(cw20.address, network)
}

export const getCw20Meta = (
  token: TokenBase,
): Cw20TokenMetaWithSource | Cw20TokenMeta | undefined => {
  const denomToLowerCase = token.denom.toLowerCase()
  const cw20MetaFromCw20s = token.cw20s?.find((meta) =>
    denomToLowerCase.includes(meta.address.toLowerCase()),
  )

  return cw20MetaFromCw20s || undefined
}

export const getNativeTokenFactoryMeta = (
  token: TokenBase,
): NativeTokenFactoryMeta | undefined => {
  const [, creatorAddress] = token.denom.split('/').reverse()

  return token.tokenFactories?.find(
    (meta) => meta.creator.toLowerCase() === creatorAddress,
  )
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
  symbol: baseDenom,
  hash,
  path,
  baseDenom,
  decimals,
  channelId: getChannelIdFromPath(path),
  isNative: !baseDenom.startsWith('ibc'),
})

export const isCw20ContractAddress = (address: string) =>
  address.length === 42 && address.startsWith('inj')
