import {
  QueryIpfs,
  QueryNftToken,
  NftTokenMetadata,
  ChainGrpcWasmApi,
  QueryNftCollection,
  NftQueryTransformer,
  NftTokenWithAddress,
  NftCollectionWithAddress,
} from '@injectivelabs/sdk-ts'
import {
  Network,
  NetworkEndpoints,
  getNetworkEndpoints,
} from '@injectivelabs/networks'

export class NftService {
  protected chainGrpcWasmApiClient: ChainGrpcWasmApi
  private ipfsQueryClient: QueryIpfs

  constructor(
    network: Network = Network.Testnet,
    ipfsEndpoint: string,
    endpoints?: NetworkEndpoints,
  ) {
    const networkEndpoints = endpoints || getNetworkEndpoints(network)
    this.chainGrpcWasmApiClient = new ChainGrpcWasmApi(networkEndpoints.grpc)
    this.ipfsQueryClient = new QueryIpfs(ipfsEndpoint)
  }

  private async accumulateTokens({
    contractAddress,
    injectiveAddress,
    lastTokenId,
    allTokens = [],
  }: {
    contractAddress: string
    injectiveAddress: string
    lastTokenId?: string
    allTokens?: NftTokenMetadata[]
  }): Promise<NftTokenMetadata[]> {
    const MAX_ITEMS = 30

    const queryNftTokenPayload = new QueryNftToken({
      owner: injectiveAddress,
      limit: MAX_ITEMS,
      verbose: true,
      ...(lastTokenId ? { start_after: lastTokenId } : undefined),
    }).toPayload()

    const response = await this.chainGrpcWasmApiClient.fetchSmartContractState(
      contractAddress,
      queryNftTokenPayload,
    )

    const tokens = NftQueryTransformer.tokensResponseToTokens(response)

    if (!tokens) {
      return allTokens
    }

    return await this.accumulateTokens({
      contractAddress,
      injectiveAddress,
      lastTokenId: tokens[tokens.length - 1].tokenId,
      allTokens: [...allTokens, ...tokens],
    })
  }

  private async fetchAllTokensForContract(
    contractAddress: string,
    injectiveAddress: string,
  ) {
    return await this.accumulateTokens({ contractAddress, injectiveAddress })
  }

  public async fetchTokens(
    {
      codeId,
      limit = 100_000,
      injectiveAddress,
    }: {
      codeId: number
      limit?: number
      injectiveAddress: string
    },
    errorCallback?: (error: Error) => void,
  ): Promise<NftTokenWithAddress[]> {
    const collections =
      await this.chainGrpcWasmApiClient.fetchContractCodeContracts(codeId, {
        limit,
      })

    const allTokensList = await Promise.all(
      collections.contractsList.map(async (contract) => ({
        contract,
        tokens: await this.fetchAllTokensForContract(
          contract,
          injectiveAddress,
        ),
      })),
    )

    const tokensWithContract = allTokensList.flatMap(({ contract, tokens }) =>
      tokens.map((token) => ({ ...token, contract })),
    )

    const ipfsTokenMetadataPromises = await this.fetchIpfsTokenMetadata(
      tokensWithContract,
      errorCallback,
    )

    return (await Promise.allSettled(ipfsTokenMetadataPromises))
      .filter((result) => result.status === 'fulfilled')
      .map(
        (result) =>
          (result as PromiseFulfilledResult<NftTokenWithAddress | undefined>)
            .value,
      )
      .filter((metadata) => metadata) as NftTokenWithAddress[]
  }

  private async fetchIpfsTokenMetadata(
    allTokensList: Array<NftTokenMetadata & { contract: string }>,
    errorCallback?: (error: Error) => void,
  ) {
    return allTokensList.map(async ({ metadataUri, contract }) => {
      try {
        const path = metadataUri.replace('ipfs://', '')
        const tokenMetadata = await this.ipfsQueryClient.fetchJson(path)
        const transformedTokenMetadata =
          NftQueryTransformer.ipfsTokenResponseToToken(tokenMetadata)

        return {
          ...transformedTokenMetadata,
          collectionAddress: contract,
        }
      } catch (e: any) {
        /**
         * Since we still want to pass the successful results, we handle ipfs timeouts on the client
         **/
        if (errorCallback) {
          errorCallback(e)
        }

        return
      }
    })
  }

  public async fetchCollectionInfo(
    contractAddress: string,
  ): Promise<NftCollectionWithAddress> {
    const queryNftCollectionPayload = new QueryNftCollection({}).toPayload()

    const response = await this.chainGrpcWasmApiClient.fetchSmartContractState(
      contractAddress,
      queryNftCollectionPayload,
    )

    const collection =
      NftQueryTransformer.collectionResponseToCollection(response)

    return { ...collection, collectionAddress: contractAddress }
  }
}
