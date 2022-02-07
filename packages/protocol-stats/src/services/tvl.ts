import { Coin } from '@injectivelabs/ts-types'
import { CoinGeckoApi } from '@injectivelabs/token-utils'
import { erc20TokenMeta, TokenMeta } from '@injectivelabs/token-metadata'
import {
  DenomTraceResponse,
  DenomTracesResponse,
  Token,
  TokenWithUsdPrice,
} from '../types'
import { getHttpClientFromEndpoint, sleep } from '../helpers'
import { fetchSupply } from './bank'

export const fetchDenomTraces = async (endpoint: string) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get(
      `/ibc/apps/transfer/v1/denom_traces`,
    )) as {
      data: DenomTracesResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const fetchDenomTrace = async ({
  endpoint,
  hash,
}: {
  hash: string
  endpoint: string
}) => {
  const httpClient = getHttpClientFromEndpoint(endpoint)

  try {
    const response = (await httpClient.get(
      `/ibc/apps/transfer/v1/denom_traces/${hash.replace('ibc/', '')}`,
    )) as {
      data: DenomTraceResponse
    }

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const getTokenMetaDataBySymbol = (
  symbol: string,
): TokenMeta | undefined => erc20TokenMeta.getMetaBySymbol(symbol)

export const getTokenMetaData = (denom: string): TokenMeta | undefined => {
  const address = denom.startsWith('peggy') ? denom.replace('peggy', '') : denom
  const erc20Address =
    address.toLowerCase() === 'inj'
      ? getTokenMetaDataBySymbol('INJ')!.address
      : address

  const meta = erc20TokenMeta.getMetaByAddress(erc20Address)

  if (!meta) {
    return
  }

  return meta
}

export const getIbcTokenMetaData = async ({
  denom,
  endpoint,
}: {
  denom: string
  endpoint: string
}): Promise<TokenMeta | undefined> => {
  const denomTraceResponse = await fetchDenomTrace({ hash: denom, endpoint })
  const { base_denom: baseDenom } = denomTraceResponse.denom_trace
  const meta = erc20TokenMeta.getMetaBySymbol(baseDenom)

  if (!meta) {
    return
  }

  return meta
}

export const getTokenMetaDataWithIbc = async ({
  denom,
  endpoint,
}: {
  denom: string
  endpoint: string
}): Promise<TokenMeta | undefined> =>
  denom.startsWith('ibc/')
    ? getIbcTokenMetaData({
        denom,
        endpoint,
      })
    : getTokenMetaData(denom)

export const fetchTokenPriceFromCoinGecko = async (coinId: string) => {
  if (!coinId) {
    return 0
  }

  const coinGeckoApi = new CoinGeckoApi({
    apiKey: '',
    baseUrl: 'https://api.coingecko.com/api/v3',
  })

  try {
    const response = await coinGeckoApi.fetchUsdPrice(coinId)
    return response || 0
  } catch (e) {
    return 0
  }
}

export const tokenMetaToToken = (
  tokenMeta: TokenMeta | undefined,
  denom: string,
  amount: string,
): Token | undefined => {
  if (!tokenMeta) {
    return
  }

  return {
    denom,
    amount,
    icon: tokenMeta.symbol,
    symbol: tokenMeta.symbol,
    name: tokenMeta.name,
    decimals: tokenMeta.decimals,
    address: tokenMeta.address,
    coinGeckoId: tokenMeta.coinGeckoId,
  }
}

export const fetchSupplyWithTokenMeta = async (
  endpoint: string,
): Promise<TokenWithUsdPrice[]> => {
  const supplyResponse = await fetchSupply(endpoint)
  const supplyWithTokenMeta = (
    (await Promise.all(
      supplyResponse.supply.map(async ({ denom, amount }: Coin) => {
        const tokenMeta = await getTokenMetaDataWithIbc({ denom, endpoint })

        return tokenMetaToToken(tokenMeta, denom, amount)
      }),
    )) as Token[]
  ).filter((token) => token)

  return Promise.all(
    supplyWithTokenMeta.map(async (token) => {
      const priceInUsd = token.coinGeckoId
        ? await fetchTokenPriceFromCoinGecko(token.coinGeckoId)
        : 0

      await sleep(250)

      return {
        ...token,
        priceInUsd,
      }
    }),
  )
}
