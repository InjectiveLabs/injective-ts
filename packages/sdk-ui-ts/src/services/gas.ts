import { HttpClient, BigNumber, BigNumberInWei } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import { GWEI_IN_WEI, DEFAULT_GAS_PRICE } from '../constants'

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
  estimatedBaseFee: string
}

export interface OwlracleResult {
  timestamp: Date
  lastBlock: number
  avgTime: number
  avgTx: number
  avgGas: number
  speeds: [
    {
      acceptance: number
      gasPrice: number
      estimatedFee: number
    },
    {
      acceptance: number
      gasPrice: number
      estimatedFee: number
    },
    {
      acceptance: number
      gasPrice: number
      estimatedFee: number
    },
    {
      acceptance: number
      gasPrice: number
      estimatedFee: number
    },
  ]
  baseFee: number
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

const isTestnet = (network: Network) => {
  return [
    Network.Local,
    Network.Devnet,
    Network.Devnet1,
    Network.Testnet,
    Network.TestnetK8s,
  ].includes(network)
}

const fetchGasPriceFromOwlracle = async (): Promise<string> => {
  try {
    const response = (await new HttpClient('https://owlracle.info/eth').get(
      'gas',
    )) as {
      data: OwlracleResult
    }

    if (!response || (response && !response.data)) {
      throw new Error('No response from Owrlacle')
    }
    const { speeds } = response.data
    const [, , faster] = speeds

    return new BigNumberInWei(
      new BigNumber(faster.gasPrice).multipliedBy(GWEI_IN_WEI),
    ).toFixed(0)
  } catch (e: any) {
    throw new Error(e.message)
  }
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
      new BigNumber(
        response.data.currentBaseFee * response.data.fast,
      ).multipliedBy(GWEI_IN_WEI),
    ).toFixed(0)
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
      new BigNumber(response.data.fastest / 10)
        .times(2.125)
        .multipliedBy(GWEI_IN_WEI),
    ).toFixed(0)
  } catch (e: any) {
    throw new Error(e.message)
  }
}

// @ts-ignore
const fetchGasPriceFromMetaswapGasServer = async (): Promise<string> => {
  try {
    const response = (await new HttpClient(
      'https://gas-api.metaswap.codefi.network/networks/1/suggestedGasFees',
    ).get('')) as {
      data: MetamaskGasServerResult
    }

    if (!response || (response && !response.data)) {
      throw new Error('No response from Metamask')
    }

    return new BigNumberInWei(
      new BigNumber(response.data.estimatedBaseFee)
        .div(1000)
        .times(2.125)
        .multipliedBy(GWEI_IN_WEI),
    ).toFixed(0)
  } catch (e: any) {
    throw new Error(e.message)
  }
}

export const fetchGasPrice = async (network: Network): Promise<string> => {
  if (isTestnet(network)) {
    return new BigNumberInWei(DEFAULT_GAS_PRICE).toFixed(0)
  }

  try {
    return await fetchGasPriceFromEtherchain()
  } catch (e) {
    //
  }

  try {
    return await fetchGasPriceFromMetaswapGasServer()
  } catch (e) {
    //
  }

  try {
    return await fetchGasPriceFromEthGasStation()
  } catch (e) {
    //
  }

  try {
    return await fetchGasPriceFromOwlracle()
  } catch (e) {
    //
  }

  return new BigNumberInWei(DEFAULT_GAS_PRICE).toString()
}
