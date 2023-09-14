import {ChainId} from "@injectivelabs/ts-types";
import {ChainGrpcWasmApi} from './ChainGrpcWasmApi'
import {
  binaryToBase64, nameToNode, toBase64, fromBase64,
  INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_CHAINID,
  INJ_NAME_REGISTRY_CONTRACT_BY_CHAINID, normalizeName
} from "../../../utils";

export class ChainGrpcInjNameApi {
  protected client: ChainGrpcWasmApi
  protected chainId: ChainId
  private registryAddr: string
  private reverseResolverAddr: string

  constructor(endpoint: string, chainId: ChainId.Mainnet | ChainId.Testnet) {
    this.client = new ChainGrpcWasmApi(endpoint)
    this.chainId = chainId
    this.registryAddr = INJ_NAME_REGISTRY_CONTRACT_BY_CHAINID[chainId]
    this.reverseResolverAddr = INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_CHAINID[chainId]
  }

  private async fetchResolverAddress(node: number[]) {
    const msg = toBase64({
      resolver: {
        node
      }
    })
    const res = await this.client.fetchSmartContractState(this.registryAddr, msg)
    const data = fromBase64(binaryToBase64(res.data))
    return data.resolver as string | null
  }

  async fetchInjAddress(name: string) {
    let normalized
    try {
      normalized = normalizeName(name)
    } catch (e) {
      console.error(e)
      return null
    }
    const node = nameToNode(normalized)
    const resolverAddr = await this.fetchResolverAddress(node)
    if (!resolverAddr) return null
    const msg = toBase64({
      address: {
        node
      }
    })
    const res = await this.client.fetchSmartContractState(resolverAddr, msg)
    const data = fromBase64(binaryToBase64(res.data))
    return data.address as string | null
  }

  async fetchInjName(address: string) {
    if (!address) return null
    const msg = toBase64({
      name: {
        address: address.toLowerCase()
      }
    })
    const res = await this.client.fetchSmartContractState(this.reverseResolverAddr, msg)
    const data = fromBase64(binaryToBase64(res.data))
    if (data.name) {
      const addr = await this.fetchInjAddress(data.name)
      if (addr?.toLowerCase() !== address.toLowerCase()) {
        return null
      }
      return data.name as string | null
    }
    return null
  }
}
