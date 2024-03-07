import { HttpRestClient } from '@injectivelabs/utils'
import path from 'path'
import fs from 'fs'
import {
  Token,
  TokenType,
  TokenVerification,
} from '@injectivelabs/token-metadata'

type IbcTokenMetadata = {
  name: string
  symbol: string
  contractAddr: string
  decimals: number
  numberOfPools: number
  imageUrl: string
  isTrading: boolean
}

const ibcTokenMetadataApi = new HttpRestClient('https://api.tfm.com/api/v1/', {
  timeout: 2000,
})

const TOKEN_METADATA_PATH = 'ibc/chain/injective-1/tokens'

function ibcTokenMetadataToToken(
  ibcTokenMetadata: IbcTokenMetadata[],
): Token[] {
  return ibcTokenMetadata.map((metadata) => {
    return {
      name: metadata.name || 'Unknown',
      denom: metadata.contractAddr || '',
      logo: metadata.imageUrl || 'unknown.png',
      symbol: metadata.symbol || 'Unknown',
      decimals: metadata.decimals || 18,
      coinGeckoId: '',
      tokenType: TokenType.Ibc,
      tokenVerification: TokenVerification.External,

      ibc: {
        hash: (metadata.contractAddr || '').replace('ibc/', ''),
        path: '',
        channelId: '',
        decimals: metadata.decimals || 18,
        symbol: metadata.symbol || 'Unknown',
        baseDenom: metadata.symbol || 'Unknown',
        isNative: false,
        tokenType: TokenType.Ibc,
      },
    }
  })
}

;(async () => {
  try {
    const response = (await ibcTokenMetadataApi.get(TOKEN_METADATA_PATH)) as {
      data: IbcTokenMetadata[]
    }

    if (!response.data || !Array.isArray(response.data)) {
      return
    }

    const ibcTokens = ibcTokenMetadataToToken(response.data)
    const outputPath = path.resolve(
      `${process.cwd()}/src/services/ibc/ibcTokenMetadata.json`,
    )

    fs.writeFileSync(outputPath, JSON.stringify(ibcTokens, null, 2))
  } catch (e) {
    console.log(e)

    return
  }
})()
