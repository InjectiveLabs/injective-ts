import { GeneralException } from '@injectivelabs/exceptions'
import {
  Network,
  NetworkEndpoints,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import {
  toBase64,
  fromBase64,
  ChainGrpcWasmApi,
  binaryToBase64,
} from '@injectivelabs/sdk-ts'
import { getBonfidaContractAddress } from './utils'

export class InjBonfidaNameService {
  protected client: ChainGrpcWasmApi

  private contractAddress: string

  constructor(
    network: Network = Network.Testnet,
    endpoints?: NetworkEndpoints,
  ) {
    const networkEndpoints = endpoints || getNetworkEndpoints(network)

    this.client = new ChainGrpcWasmApi(networkEndpoints.grpc)
    this.contractAddress = getBonfidaContractAddress(network)
  }

  async fetchInjAddress(name: string) {
    const query = {
      resolve: {
        domain_name: name,
      },
    }
    const response = await this.client.fetchSmartContractState(
      this.contractAddress,
      toBase64(query),
    )

    return fromBase64(binaryToBase64(response.data))
  }

  async fetchInjName(_address: string) {
    throw new GeneralException(new Error(`Not suported for this name service`))
  }
}
