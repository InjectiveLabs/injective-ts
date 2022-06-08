import { HttpClient, BigNumber, BigNumberInWei } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import { GWEI_IN_WEI, DEFAULT_GAS_PRICE } from '../constants'

const isTestnet = (network: Network) => {
  return [
    Network.Local,
    Network.Devnet,
    Network.Devnet1,
    Network.Testnet,
    Network.TestnetK8s,
  ].includes(network)
}

const fetchGasPriceFromEtherchain = async (): Promise<string> => {
  try {
    const response = (await new HttpClient(
      'https://www.etherchain.org/api/',
    ).get('gasPriceOracle')) as {
      data: EtherchainResult
    }

    if (!response || (response && !response.data)) {
      throw new Error('No response from Etherchain')
    }

    return new BigNumberInWei(
      new BigNumber(response.data.fastest * 10).multipliedBy(GWEI_IN_WEI),
    ).toString()
  } catch (e: any) {
    throw new Error(e.message)
  }
}

const fetchGasPriceFromEthGasStation = async (): Promise<string> => {
  try {
    const response = (await new HttpClient(
      'https://ethgasstation.info/json',
    ).get('ethgasAPI.json')) as {
      data: EthGasStationResult
    }

    if (!response || (response && !response.data)) {
      throw new Error('No response from Ethgasstation')
    }

    return new BigNumberInWei(
      new BigNumber(response.data.fastest / 10).multipliedBy(GWEI_IN_WEI),
    ).toString()
  } catch (e: any) {
    throw new Error(e.message)
  }
}

const fetchGasPriceFromMetamaskGasServer = async (): Promise<string> => {
  try {
    const response = (await new HttpClient(
      'https://mock-gas-server.herokuapp.com',
    ).get('')) as {
      data: MetamaskGasServerResult
    }

    if (!response || (response && !response.data)) {
      throw new Error('No response from Metamask')
    }

    return new BigNumberInWei(
      new BigNumber(response.data.medium.suggestedMaxFeePerGas)
        .div(1000)
        .multipliedBy(GWEI_IN_WEI),
    ).toString()
  } catch (e: any) {
    throw new Error(e.message)
  }
}

export interface MetamaskGasServerResult {
  low: {
    minWaitTimeEstimate: number
    maxWaitTimeEstimate: number
    suggestedMaxPriorityFeePerGas: string
    suggestedMaxFeePerGas: string
  }
  medium: {
    minWaitTimeEstimate: number
    maxWaitTimeEstimate: number
    suggestedMaxPriorityFeePerGas: string
    suggestedMaxFeePerGas: string
  }
  high: {
    minWaitTimeEstimate: number
    maxWaitTimeEstimate: number
    suggestedMaxPriorityFeePerGas: string
    suggestedMaxFeePerGas: string
  }
  estimateBaseFee: string
}

export interface GasInfo {
  gasPrice: string
  estimatedTimeMs: number
}

export interface EthGasStationResult {
  average: number
  fastestWait: number
  fastWait: number
  fast: number
  safeLowWait: number
  blockNum: number
  avgWait: number
  // eslint-disable-next-line camelcase
  block_time: number
  speed: number
  fastest: number
  safeLow: number
}

export interface EtherchainResult {
  standard: number
  fast: number
  fastest: number
  safeLow: number
  currentBaseFee: number
  recommendedBaseFee: number
}

export const fetchGasPrice = async (network: Network): Promise<string> => {
  if (isTestnet(network)) {
    return new BigNumberInWei(DEFAULT_GAS_PRICE).toString()
  }

  try {
    return await fetchGasPriceFromMetamaskGasServer()
  } catch (e) {
    //
  }

  try {
    return await fetchGasPriceFromEthGasStation()
  } catch (e) {
    //
  }

  try {
    return await fetchGasPriceFromEtherchain()
  } catch (e) {
    //
  }

  return new BigNumberInWei(DEFAULT_GAS_PRICE).toString()
}
