import { HttpClient } from '@injectivelabs/utils'
import { HttpException } from '@injectivelabs/exceptions'
import {
  rpcUrlsMainnet,
  rpcUrlsLocal,
  wsRpcUrlsMainnet,
  wsRpcUrlsLocal,
  urlEndpointsMainnet,
  urlEndpointsLocal,
  graphUrlsMainnet,
  graphUrlsLocal,
  urlEndpointsDevnet,
  rpcUrlsDevnet,
  wsRpcUrlsDevnet,
  graphUrlsDevnet,
  urlEndpointsStaking,
  rpcUrlsStaking,
  wsRpcUrlsStaking,
  graphUrlsStaking,
} from './data/rpc'
import {
  Network,
  Region,
  UrlEndpointUrls,
  UrlEndpoint,
  RpcUrls,
  Rpc,
  RegionResponse,
  GraphUrl,
} from './types'

export const urlEndpointUrls: { [key: string]: UrlEndpointUrls } = {
  mainnet: urlEndpointsMainnet,
  devnet: urlEndpointsDevnet,
  staking: urlEndpointsStaking,
  local: urlEndpointsLocal,
}

export const getUrlEndpointForNetwork = (network: Network): UrlEndpointUrls =>
  urlEndpointUrls[network]

export const getUrlEndpointFromRegion = (
  region: Region,
  network: Network,
): UrlEndpoint => {
  const urlApiEndpointUrls = getUrlEndpointForNetwork(network)

  if ([Region.Africa, Region.Europe, Region.Oceania].includes(region)) {
    return urlApiEndpointUrls.europe
  }

  if ([Region.Asia].includes(region)) {
    return urlApiEndpointUrls.asia
  }

  return urlApiEndpointUrls.america
}

export const rpcUrls: { [key: string]: RpcUrls } = {
  mainnet: rpcUrlsMainnet,
  staking: rpcUrlsStaking,
  devnet: rpcUrlsDevnet,
  local: rpcUrlsLocal,
}

export const wsRpcUrls: { [key: string]: RpcUrls } = {
  mainnet: wsRpcUrlsMainnet,
  staking: wsRpcUrlsStaking,
  devnet: wsRpcUrlsDevnet,
  local: wsRpcUrlsLocal,
}

export const graphUrls: { [key: string]: GraphUrl } = {
  mainnet: graphUrlsMainnet,
  staking: graphUrlsStaking,
  devnet: graphUrlsDevnet,
  local: graphUrlsLocal,
}

export const getRpcUrlsForNetwork = (network: Network): RpcUrls =>
  rpcUrls[network]

export const getWsRpcUrlsForNetwork = (network: Network): RpcUrls =>
  wsRpcUrls[network]

export const getGraphUrlForNetwork = (network: Network): GraphUrl =>
  graphUrls[network]

export const getRpcFromRegion = (region: Region, network: Network): Rpc => {
  const rpcUrls = getRpcUrlsForNetwork(network)

  if ([Region.Africa, Region.Europe, Region.Oceania].includes(region)) {
    return rpcUrls.europe
  }

  if ([Region.Asia].includes(region)) {
    return rpcUrls.asia
  }

  return rpcUrls.america
}

export const getWsRpcFromRegion = (region: Region, network: Network): Rpc => {
  const rpcUrls = getWsRpcUrlsForNetwork(network)

  if ([Region.Africa, Region.Europe, Region.Oceania].includes(region)) {
    return rpcUrls.europe
  }

  if ([Region.Asia].includes(region)) {
    return rpcUrls.asia
  }

  return rpcUrls.america
}

export const fetchRegion = async (): Promise<Region | undefined> =>
  Promise.resolve(Region.Europe)

export const fetchRegionFromGeoIp = async (): Promise<Region | undefined> => {
  const httpClient = new HttpClient('https://geoip.injective.dev/')

  try {
    const {
      data: { continent },
    } = (await httpClient.get('info')) as RegionResponse

    const continentAsRegion = continent.toLowerCase() as Region

    return Object.keys(Region).includes(continentAsRegion)
      ? continentAsRegion
      : Region.Europe
  } catch (error) {
    throw new HttpException(error.message)
  }
}
