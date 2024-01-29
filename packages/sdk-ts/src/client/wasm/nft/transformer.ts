import { WasmContractQueryResponse } from '../types'
import {
  NftToken,
  NftTokenMetadata,
  IpfsTokenResponse,
  NftCollectionMetadata,
  QueryNftTokenResponse,
} from './types'
import { toUtf8 } from '../../../utils'

export class NftQueryTransformer {
  static tokensResponseToTokens(
    response: WasmContractQueryResponse,
  ): NftTokenMetadata[] | undefined {
    const { tokens } = JSON.parse(toUtf8(response.data))

    if (tokens.length === 0) {
      return
    }

    return tokens.map(this.tokenResponseToToken)
  }

  static tokenResponseToToken(token: QueryNftTokenResponse): NftTokenMetadata {
    return {
      owner: token.owner,
      tokenId: token.token_id,
      metadataUri: token.metadata_uri,
    }
  }

  static ipfsTokenResponseToToken(token: IpfsTokenResponse): NftToken {
    return {
      title: token.title,
      description: token.description,
      rarity: token.rarity,
      rank: token.rank,
      release: token.release,
      style: token.style,
      license: token.license,
      media: token.media,
      tags: token.tags,
    }
  }

  static collectionResponseToCollection(
    response: WasmContractQueryResponse,
  ): NftCollectionMetadata {
    const collection = JSON.parse(toUtf8(response.data))

    return {
      name: collection.name,
      symbol: collection.symbol,
    }
  }
}
