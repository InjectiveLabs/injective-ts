import {
  Network,
  getCw20AdapterContractForNetwork,
} from '@injectivelabs/networks'
import { TokenMetaUtilsFactory } from '../TokenMetaUtilsFactory'
import {
  Token,
  TokenType,
  TokenBase,
  TokenSource,
  IbcTokenMeta,
  Cw20TokenMeta,
  TokenVerification,
  IbcTokenMetaWithSource,
  Cw20TokenMetaWithSource,
  NativeTokenFactoryMeta,
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

  if (!metaFromSymbol) {
    return
  }

  if (!metaFromSymbol?.erc20) {
    return
  }

  return `peggy${metaFromSymbol?.erc20?.address}`
}

export const getIbcDenomFromSymbolOrName = ({
  symbolOrName,
  network = Network.Mainnet,
  source,
}: {
  symbolOrName: string
  network?: Network
  source?: TokenSource
}) => {
  const tokenMetaUtils = TokenMetaUtilsFactory.make(network)
  const metaFromSymbol = tokenMetaUtils.getMetaBySymbol(symbolOrName)

  if (!metaFromSymbol) {
    return
  }

  if (!metaFromSymbol?.ibcs) {
    return
  }

  const meta = metaFromSymbol

  if (source) {
    const ibcHash = meta?.ibcs?.find((ibc) => ibc.source === source)?.hash

    return `ibc/${ibcHash}`
  }

  const defaultIbcHash = meta.ibcs?.find(
    (ibc) => ibc.source === TokenSource.Cosmos,
  )?.hash
  const [ibc] = meta.ibcs || []
  const ibcHash = defaultIbcHash || ibc?.hash

  return `ibc/${ibcHash}`
}

export const getCw20FromSymbolOrName = (
  symbolOrName: string,
  network: Network = Network.Mainnet,
  source?: TokenSource,
) => {
  const tokenMetaUtils = TokenMetaUtilsFactory.make(network)
  const metaFromSymbol = tokenMetaUtils.getMetaBySymbol(symbolOrName)

  if (!metaFromSymbol) {
    return
  }

  if (!metaFromSymbol?.cw20s) {
    return
  }

  const meta = metaFromSymbol

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

  return cw20MetaFromCw20s || token.cw20s?.[0] || undefined
}

export const getIbcMeta = (
  token: TokenBase,
): IbcTokenMetaWithSource | IbcTokenMeta | undefined => {
  const denomToLowerCase = token.denom.toLowerCase()
  const ibcMetaFromIbcs = token.ibcs?.find((meta) =>
    denomToLowerCase.includes(meta.hash.toLowerCase()),
  )
  const defaultIbcMeta = token.ibcs?.find(
    (meta) => meta.source === TokenSource.Cosmos,
  )

  return ibcMetaFromIbcs || defaultIbcMeta || token.ibcs?.[0] || undefined
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

/** @deprecated - use getIbcTokenFromDenomTrace */
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
