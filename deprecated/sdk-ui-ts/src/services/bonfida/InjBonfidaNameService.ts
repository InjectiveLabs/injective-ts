import { GeneralException } from '@injectivelabs/exceptions'
import {
  Network,
  NetworkEndpoints,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import {
  toBase64,
  binaryToBase64,
  ChainGrpcWasmApi,
} from '@injectivelabs/sdk-ts'
import { getBonfidaContractAddress } from './utils'

export class InjBonfidaNameService {
  protected client: ChainGrpcWasmApi

  private contractAddress: string

  constructor(
    network: Network = Network.MainnetSentry,
    endpoints?: NetworkEndpoints,
  ) {
    const networkEndpoints = endpoints || getNetworkEndpoints(network)

    this.client = new ChainGrpcWasmApi(networkEndpoints.grpc)
    this.contractAddress = getBonfidaContractAddress(network)
  }

  async fetchInjAddress(name: string) {
    const query = {
      resolve: {
        domain_name: name.replace('.sol', ''),
      },
    }
    const response = await this.client.fetchSmartContractState(
      this.contractAddress,
      toBase64(query),
    )

    return Buffer.from(binaryToBase64(response.data), 'base64')
      .toString()
      .replace(/["]/g, '')
  }

  async fetchInjName(_address: string) {
    throw new GeneralException(new Error(`Not suported for this name service`))
  }
}
