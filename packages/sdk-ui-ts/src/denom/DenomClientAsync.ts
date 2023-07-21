import {
  Network,
  NetworkEndpoints,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import { ChainGrpcWasmApi, DenomClient } from '@injectivelabs/sdk-ts'
import { Web3Client } from '../services/web3/Web3Client'
import type { Token } from '@injectivelabs/token-metadata'
import { getTokenFromAlchemyTokenMetaResponse } from '../utils/alchemy'
import { getTokenFromContractStateResponse } from '../utils/cw20'

export class DenomClientAsync {
  private web3Client: Web3Client

  private endpoints: NetworkEndpoints

  private denomClient: DenomClient

  private chainWasmApi: ChainGrpcWasmApi

  constructor(
    network: Network = Network.Mainnet,
    options: { endpoints?: NetworkEndpoints; alchemyRpcUrl: string },
  ) {
    this.endpoints = options.endpoints || getNetworkEndpoints(network)
    this.chainWasmApi = new ChainGrpcWasmApi(this.endpoints.grpc)
    this.denomClient = new DenomClient(network, options)
    this.web3Client = new Web3Client({ network, rpc: options.alchemyRpcUrl })
  }

  async getDenomToken(denom: string): Promise<Token | undefined> {
    const token = await this.denomClient.getDenomToken(denom)

    if (token) {
      return token
    }

    const isErc20 = denom.startsWith('peggy') || denom.startsWith('0x')

    if (isErc20) {
      const contractAddress = denom.startsWith('peggy')
        ? denom.replace('peggy', '')
        : denom

      const response = await this.web3Client.fetchTokenMetaData(contractAddress)

      return getTokenFromAlchemyTokenMetaResponse(denom, response)
    }

    const isCW20 = denom.startsWith('inj') || denom.startsWith('factory')

    if (isCW20) {
      const contractAddress = denom.startsWith('factory')
        ? denom.split('/')[2]
        : denom

      const response = await this.chainWasmApi.fetchContractState({
        contractAddress,
        pagination: {
          reverse: true,
        },
      })

      return getTokenFromContractStateResponse(denom, response)
    }

    return undefined
  }
}
