import {
  Network,
  NetworkEndpoints,
  getNetworkEndpoints,
  CW20_CODE_IDS_BY_NETWORK,
} from '@injectivelabs/networks'
import {
  sha256,
  Metadata,
  Contract,
  fromUtf8,
  DenomClient,
  InsuranceFund,
  ChainGrpcIbcApi,
  ChainGrpcBankApi,
  ChainGrpcWasmApi,
  isCw20ContractAddress,
  ChainGrpcInsuranceFundApi,
  IndexerRestExplorerApi,
} from '@injectivelabs/sdk-ts'
import { Web3Client } from '../services/web3/Web3Client'
import type { Token } from '@injectivelabs/token-metadata'
import {
  TokenType,
  TokenMetaBase,
  getUnknownTokenWithSymbol,
  getIbcTokenFromDenomTrace,
} from '@injectivelabs/token-metadata'
import { getTokenFromAlchemyTokenMetaResponse } from '../utils/alchemy'
import {
  getTokenFromCw20ContractInfo,
  getTokenFromContractStateResponse,
} from '../utils/cw20'
import { getTokenFromDenomsMetadata } from '../utils/factory'
import { getTokenFromInsuranceFund } from '../utils'
import { IbcApplicationsTransferV1Transfer } from '@injectivelabs/core-proto-ts'
import { ErrorType, GeneralException } from '@injectivelabs/exceptions'
import { awaitForAll } from '@injectivelabs/utils'
// @ts-ignore
import ibcTokenMetadata from '../services/ibc/ibcTokenMetadata.json'

const IGNORED_DENOMS = [
  'peggy0xB855dBC314C39BFa2583567E02a40CBB246CF82B',
  'peggy0x7C7aB80590708cD1B7cf15fE602301FE52BB1d18',
]

export class DenomClientAsync {
  private denomClient: DenomClient

  private network: Network

  private web3Client: Web3Client | undefined

  private endpoints: NetworkEndpoints

  private chainWasmApi: ChainGrpcWasmApi

  private chainBankApi: ChainGrpcBankApi

  private indexerExplorerApi: IndexerRestExplorerApi

  private chainInsuranceApi: ChainGrpcInsuranceFundApi

  private metadatas: Metadata[] = []

  private insuranceFunds: InsuranceFund[] = []

  private chainIbcApi: ChainGrpcIbcApi

  private cachedDenomTraces: Record<
    string,
    IbcApplicationsTransferV1Transfer.DenomTrace
  > = {}

  private cachedSmartContractInfos: Record<string, Contract> = {}

  private cachedIbcTokens: Token[] = []

  constructor(
    network: Network = Network.Mainnet,
    options: { endpoints?: NetworkEndpoints; alchemyRpcUrl?: string },
  ) {
    this.network = network
    this.endpoints = options.endpoints || getNetworkEndpoints(network)
    this.denomClient = new DenomClient(network)
    this.chainIbcApi = new ChainGrpcIbcApi(this.endpoints.grpc)
    this.chainWasmApi = new ChainGrpcWasmApi(this.endpoints.grpc)
    this.chainBankApi = new ChainGrpcBankApi(this.endpoints.grpc)
    this.chainInsuranceApi = new ChainGrpcInsuranceFundApi(this.endpoints.grpc)
    this.indexerExplorerApi = new IndexerRestExplorerApi(
      this.endpoints.explorer || this.endpoints.indexer,
    )
    this.web3Client = options.alchemyRpcUrl
      ? new Web3Client({ network, rpc: options.alchemyRpcUrl })
      : undefined
  }

  /**
   * Used to get tracked tokens only
   * (those in the token-metadata package)
   */
  getDenomTokenStatic(denom: string): Token | undefined {
    return this.denomClient.getDenomToken(denom)
  }

  /**
   * Used to get tracked tokens only
   * (those in the token-metadata package)
   */
  getDenomTokenStaticOrUnknown(denom: string): Token {
    const token = this.denomClient.getDenomToken(denom)

    return token || getUnknownTokenWithSymbol(denom)
  }

  /**
   * Used to get all tokens even if they are not
   * tracked on the token-metadata package
   * ERC20, CW20, IBC, etc
   */
  async getDenomToken(denom: string): Promise<Token | undefined> {
    const token = await this.denomClient.getDenomToken(denom)

    if (token) {
      return token
    }

    if (IGNORED_DENOMS.includes(denom)) {
      return getUnknownTokenWithSymbol(denom)
    }

    const isErc20 = denom.startsWith('peggy') || denom.startsWith('0x')

    if (isErc20 && this.web3Client) {
      const contractAddress = denom.startsWith('peggy')
        ? denom.replace('peggy', '')
        : denom

      const response = await this.web3Client.fetchTokenMetaData(contractAddress)

      return getTokenFromAlchemyTokenMetaResponse(denom, response)
    }

    if (isCw20ContractAddress(denom)) {
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
      if (isCw20ContractAddress(tokenFactoryAddress)) {
        return await this.getCw20DenomToken(denom, tokenFactoryAddress)
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

    const isIbcDenom = denom.startsWith('ibc')

    if (isIbcDenom) {
      return await this.getIbcDenomToken(denom)
    }

    return undefined
  }

  async getDenomTokenThrow(denom: string): Promise<Token> {
    const token = await this.getDenomToken(denom)

    if (!token) {
      throw new GeneralException(new Error(`Token not found for ${denom}`), {
        type: ErrorType.NotFoundError,
      })
    }

    return token
  }

  async getDenomsToken(denoms: string[]): Promise<Array<Token | undefined>> {
    return awaitForAll(denoms, (denom) => this.getDenomToken(denom))
  }

  getTokenMetaDataBySymbol(symbol: string): TokenMetaBase | undefined {
    return this.denomClient.getTokenMetaDataBySymbol(symbol)
  }

  getTokenMetaDataByAddress(address: string): TokenMetaBase | undefined {
    return this.denomClient.getTokenMetaDataByAddress(address)
  }

  getCoinGeckoId(denom: string): string {
    return this.denomClient.getCoinGeckoId(denom)
  }

  /**
   * TODO: refactor
   */
  getTokenBySymbol(symbol: string): Token {
    const tokenMeta = this.denomClient.getTokenMetaDataBySymbol(symbol)

    return {
      denom: symbol,
      tokenType: TokenType.Unknown,
      decimals: tokenMeta?.decimals || 0,
      logo: tokenMeta?.logo || 'unknown.png',
      coinGeckoId: tokenMeta?.coinGeckoId || '',
      name: tokenMeta?.name || symbol.toUpperCase(),
      symbol: tokenMeta?.symbol || symbol.toUpperCase(),
    }
  }

  private async getFactoryDenomMetadata(
    denom: string,
  ): Promise<Metadata | undefined> {
    if (this.metadatas.length > 0) {
      return this.metadatas.find((metadata) => metadata.base === denom)
    }

    const { metadatas } = await this.chainBankApi.fetchDenomsMetadata({
      limit: 10000,
    })

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

  /**
   * Find token based on the hash and the base denom
   * from the denom trace of the particular hash
   */
  private async getIbcDenomToken(denom: string): Promise<Token | undefined> {
    const hash = denom.replace('ibc/', '')

    if (Object.keys(this.cachedDenomTraces).length === 0) {
      await this.fetchAndCacheDenomTraces()
    }

    if (this.cachedIbcTokens.length === 0) {
      await this.fetchAndCacheIbcTokens()
    }

    const cachedDenomTrace = this.cachedDenomTraces[hash]
    const cachedIbcToken = this.cachedIbcTokens.find(
      (token) => token?.denom === denom,
    )

    if (cachedDenomTrace) {
      const token =
        this.denomClient.getDenomToken(cachedDenomTrace.baseDenom) ||
        cachedIbcToken

      if (!token) {
        return undefined
      }

      return {
        ...getIbcTokenFromDenomTrace({
          token,
          denomTrace: cachedDenomTrace,
        }),
        denom,
      }
    }

    try {
      const denomTrace = await this.chainIbcApi.fetchDenomTrace(hash)

      const token =
        this.denomClient.getDenomToken(denomTrace.baseDenom) || cachedIbcToken

      if (!token) {
        return undefined
      }

      return {
        ...getIbcTokenFromDenomTrace({ token, denomTrace }),
        denom,
      }
    } catch (e) {
      throw new GeneralException(
        new Error(`Denom trace not found for ${denom}`),
        {
          type: ErrorType.NotFoundError,
        },
      )
    }
  }

  /**
   * Find token based on the hash and the base denom
   * from the denom trace of the particular hash
   */
  private async getCw20DenomToken(
    denom: string,
    cw20Contract: string,
  ): Promise<Token | undefined> {
    if (Object.keys(this.cachedSmartContractInfos).length === 0) {
      await this.fetchAndCacheCw20Contracts()
    }

    const cachedContractInfo = this.cachedSmartContractInfos[cw20Contract]

    if (cachedContractInfo && cachedContractInfo.cw20_metadata) {
      return getTokenFromCw20ContractInfo(
        denom,
        cachedContractInfo as Contract & { cw20_metadata: { token_info: any } },
      )
    }

    const response = await this.chainWasmApi.fetchContractState({
      contractAddress: cw20Contract,
      pagination: {
        reverse: true,
      },
    })

    return getTokenFromContractStateResponse(denom, response)
  }

  private async fetchAndCacheDenomTraces() {
    const denomTraces = await this.chainIbcApi.fetchDenomsTrace({ limit: 500 })
    const denomHashes = denomTraces.map((trace) => {
      return {
        trace: trace,
        hash: Buffer.from(
          sha256(fromUtf8(`${trace.path}/${trace.baseDenom}`)),
        ).toString('hex'),
      }
    })

    this.cachedDenomTraces = denomHashes.reduce(
      (denomTraces, denomTrace) => ({
        ...denomTraces,
        [denomTrace.hash.toUpperCase()]:
          denomTrace.trace as IbcApplicationsTransferV1Transfer.DenomTrace,
      }),
      {},
    )
  }

  private async fetchAndCacheCw20Contracts() {
    const codeIds = CW20_CODE_IDS_BY_NETWORK(this.network)
    const allContracts: Contract[] = []

    for (const codeId of codeIds) {
      let { paging, contracts: contractsFromResponse } =
        await this.indexerExplorerApi.fetchContracts({
          codeId: codeId,
          limit: 100,
        })

      while (paging.total > contractsFromResponse.length) {
        const { paging: nextPaging, contracts: nextContractsFromResponse } =
          await this.indexerExplorerApi.fetchContracts({
            codeId: codeId,
            limit: 100,
            skip: contractsFromResponse.length,
          })

        paging = nextPaging
        contractsFromResponse.push(...nextContractsFromResponse)
      }

      allContracts.push(...contractsFromResponse)
    }

    const contracts = allContracts.reduce((contracts, contract) => {
      return {
        ...contracts,
        [contract.address]: contract,
      }
    }, {})

    this.cachedSmartContractInfos = {
      ...contracts,
    }
  }

  private async fetchAndCacheIbcTokens() {
    if (ibcTokenMetadata?.length === 0) {
      return
    }

    this.cachedIbcTokens = ibcTokenMetadata as Token[]
  }

  public async preloadMetadata() {
    await this.getFactoryDenomMetadata('')
    await this.getInsuranceFund('')
    await this.fetchAndCacheDenomTraces()
    await this.fetchAndCacheDenomTraces()
    await this.fetchAndCacheIbcTokens()
    await this.fetchAndCacheCw20Contracts()
  }
}
