export interface QueryNftTokenResponse {
  owner: string
  token_id: string
  metadata_uri: string
}

export interface NftTokenMetadata {
  owner: string
  tokenId: string
  metadataUri: string
}

export interface IpfsTokenResponse {
  title: string
  description: string
  rarity: string
  rank: string
  release: string
  style: string
  license: string
  media: string
  tags: string
}

export interface NftToken {
  title: string
  description: string
  rarity: string
  rank: string
  release: string
  style: string
  license: string
  media: string
  tags: string
}

export interface NftTokenWithAddress extends NftToken {
  collectionAddress: string
}

export interface NftCollectionMetadata {
  name: string
  symbol: string
}

export interface NftCollectionWithAddress extends NftCollectionMetadata {
  collectionAddress: string
}
