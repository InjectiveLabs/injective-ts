import {
  Network,
  NetworkEndpoints,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import {
  Metadata,
  DenomClient,
  InsuranceFund,
  ChainGrpcBankApi,
  ChainGrpcWasmApi,
  ChainGrpcInsuranceFundApi,
} from '@injectivelabs/sdk-ts'
import { Web3Client } from '../services/web3/Web3Client'
import type { Token } from '@injectivelabs/token-metadata'
import { getTokenFromAlchemyTokenMetaResponse } from '../utils/alchemy'
import { getTokenFromContractStateResponse } from '../utils/cw20'
import { getTokenFromDenomsMetadata } from '../utils/factory'
import { getTokenFromInsuranceFund } from '../utils'

export class DenomClientAsync {
  private web3Client: Web3Client

  private endpoints: NetworkEndpoints

  private denomClient: DenomClient

  private chainWasmApi: ChainGrpcWasmApi

  private chainBankApi: ChainGrpcBankApi

  private chainInsuranceApi: ChainGrpcInsuranceFundApi

  private metadatas: Metadata[] = []

  private insuranceFunds: InsuranceFund[] = []

  constructor(
    network: Network = Network.Mainnet,
    options: { endpoints?: NetworkEndpoints; alchemyRpcUrl: string },
  ) {
    this.endpoints = options.endpoints || getNetworkEndpoints(network)
    this.chainWasmApi = new ChainGrpcWasmApi(this.endpoints.grpc)
    this.chainBankApi = new ChainGrpcBankApi(this.endpoints.grpc)
    this.chainInsuranceApi = new ChainGrpcInsuranceFundApi(this.endpoints.grpc)
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

    const isCW20 = denom.startsWith('inj')

    if (isCW20) {
      const contractAddress = denom

      const response = await this.chainWasmApi.fetchContractState({
        contractAddress,
        pagination: {
          reverse: true,
        },
      })

      return getTokenFromContractStateResponse(denom, response)
    }

    const isTokenFactory = denom.startsWith('factory')

    if (isTokenFactory) {
      const tokenFactoryAddress = denom.split('/')[2]

      // CW20 contract (ex: from Wormhole)
      if (tokenFactoryAddress.startsWith('inj')) {
        const response = await this.chainWasmApi.fetchContractState({
          contractAddress: tokenFactoryAddress,
          pagination: {
            reverse: true,
          },
        })

        return getTokenFromContractStateResponse(denom, response)
      }

      // Custom Token Factory Denom
      const metadata = await this.getFactoryDenomMetadata(denom)

      if (metadata) {
        return getTokenFromDenomsMetadata(denom, metadata)
      }
    }

    const isInsuranceFund = denom.startsWith('share')

    if (isInsuranceFund) {
      const insuranceFund = await this.getInsuranceFund(denom)

      if (insuranceFund) {
        return getTokenFromInsuranceFund(denom, insuranceFund)
      }
    }

    return undefined
  }

  private async getFactoryDenomMetadata(
    denom: string,
  ): Promise<Metadata | undefined> {
    if (this.metadatas.length > 0) {
      return this.metadatas.find((metadata) => metadata.base === denom)
    }

    const { metadatas } = await this.chainBankApi.fetchDenomsMetadata()

    this.metadatas = metadatas

    return metadatas.find((metadata) => metadata.base === denom)
  }

  private async getInsuranceFund(
    denom: string,
  ): Promise<InsuranceFund | undefined> {
    if (this.insuranceFunds.length > 0) {
      return this.insuranceFunds.find(
        (fund) => fund.insurancePoolTokenDenom === denom,
      )
    }

    const insuranceFunds = await this.chainInsuranceApi.fetchInsuranceFunds()

    this.insuranceFunds = insuranceFunds

    return insuranceFunds.find((fund) => fund.insurancePoolTokenDenom === denom)
  }
}
