import { ChainId } from '@injectivelabs/ts-types'
import { HttpClient, BigNumber, BigNumberInWei } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'
import { GWEI_IN_WEI, DEFAULT_GAS_PRICE } from '../../constants'
import { EtherchainResult, EthGasStationResult } from './types'
import { BaseService } from '../BaseService'

export class GasService extends BaseService {
  async fetchGasPrice(): Promise<string> {
    if (this.isTestnet()) {
      return new BigNumberInWei(DEFAULT_GAS_PRICE).toString()
    }

    try {
      return await GasService.fetchGasPriceFromEthGasStation()
    } catch (e) {
      //
    }

    try {
      return await GasService.fetchGasPriceFromEtherchain()
    } catch (e) {
      //
    }

    return new BigNumberInWei(DEFAULT_GAS_PRICE).toString()
  }

  private isTestnet(): boolean {
    const { options } = this

    return (
      [
        Network.Local,
        Network.Devnet,
        Network.Testnet,
        Network.TestnetK8s,
      ].includes(options.network) || options.chainId === ChainId.Kovan
    )
  }

  private static async fetchGasPriceFromEtherchain(): Promise<string> {
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
        new BigNumber(response.data.fast * 10).multipliedBy(GWEI_IN_WEI),
      ).toString()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  private static async fetchGasPriceFromEthGasStation(): Promise<string> {
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
        new BigNumber(response.data.fast / 10).multipliedBy(GWEI_IN_WEI),
      ).toString()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
