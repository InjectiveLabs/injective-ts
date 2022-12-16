import { TokenMeta } from '../../types'
import tokens from '../tokens'
import nativeTokens from '../native-tokens'
import cw20Tokens from '../cw20-tokens'

export default { ...tokens, ...nativeTokens, ...cw20Tokens } as Record<
  string,
  TokenMeta
>
