import { GeneralException } from '@injectivelabs/exceptions'
import {
  Network,
  NetworkEndpoints,
  getNetworkEndpoints,
  getInjNameRegistryContractForNetwork,
  getInjNameReverseResolverContractForNetwork,
} from '@injectivelabs/networks'
import {
  QueryInjName,
  QueryInjectiveAddress,
  QueryResolverAddress,
} from '../client/wasm/nameservice/queries'
import { InjNameServiceQueryTransformer } from '../client/wasm/nameservice/transformer'
import { ChainGrpcWasmApi } from '../client/chain/grpc/index'
import { nameToNode, normalizeName } from '../utils/nameService'

export class InjNameService {
  protected client: ChainGrpcWasmApi

  private registryAddress: string

  private reverseResolverAddress: string

  constructor(
    network: Network = Network.MainnetSentry,
    endpoints?: NetworkEndpoints,
  ) {
    const networkEndpoints = endpoints || getNetworkEndpoints(network)

    this.client = new ChainGrpcWasmApi(networkEndpoints.grpc)
    this.registryAddress = getInjNameRegistryContractForNetwork(network)
    this.reverseResolverAddress =
      getInjNameReverseResolverContractForNetwork(network)
  }

  private async fetchResolverAddress(node: number[]) {
    const query = new QueryResolverAddress({ node }).toPayload()

    const response = await this.client.fetchSmartContractState(
      this.registryAddress,
      query,
    )

    return InjNameServiceQueryTransformer.resolverAddressResponseToResolverAddress(
      response,
    )
  }

  async fetchInjAddress(name: string) {
    const node = nameToNode(normalizeName(name))

    if (!node) {
      throw new GeneralException(new Error(`The ${name} can't be normalized`))
    }

    const resolverAddress = await this.fetchResolverAddress(node)

    if (!resolverAddress) {
      throw new GeneralException(new Error(`Resolver address not found`))
    }

    const query = new QueryInjectiveAddress({ node }).toPayload()

    const response = await this.client.fetchSmartContractState(
      resolverAddress,
      query,
    )

    return InjNameServiceQueryTransformer.injectiveAddressResponseToInjectiveAddress(
      response,
    )
  }

  async fetchInjName(address: string) {
    const query = new QueryInjName({ address }).toPayload()

    const response = await this.client.fetchSmartContractState(
      this.reverseResolverAddress,
      query,
    )

    const name =
      InjNameServiceQueryTransformer.injectiveNameResponseToInjectiveName(
        response,
      )

    if (!name) {
      throw new GeneralException(new Error(`.inj not found for ${address}`))
    }

    const addressFromName = await this.fetchInjAddress(name)

    if (addressFromName.toLowerCase() !== address.toLowerCase()) {
      throw new GeneralException(new Error(`.inj not found for ${address}`))
    }

    return name
  }
}
