import { TokenMetaUtils } from './TokenMetaUtils'
import { TokenMeta } from './types'
import {
  getMappedTokensByErc20Address,
  getMappedTokensByCw20Address,
} from './tokens/mappings/mapByAddress'
import { getMappedTokensByName } from './tokens/mappings/mapByName'
import { getMappedTokensByHash } from './tokens/mappings/mapByHash'

export class ExtendedTokenMetaUtils extends TokenMetaUtils {
  constructor(tokens: Record<string, TokenMeta>) {
    super(tokens)

    this.tokens = this.correctedMappedTokensBySymbol(tokens, this.tokens)
    this.tokensByErc20Address = getMappedTokensByErc20Address(this.tokens)
    this.tokensByCw20Address = getMappedTokensByCw20Address(this.tokens)
    this.tokensByHash = getMappedTokensByHash(this.tokens)
    this.tokensByName = getMappedTokensByName(this.tokens)
  }

  correctedMappedTokensBySymbol(
    originalTokens: Record<string, TokenMeta>,
    tokens: Record<string, TokenMeta>,
  ): Record<string, TokenMeta> {
    return { ...tokens, ...originalTokens }
  }
}
