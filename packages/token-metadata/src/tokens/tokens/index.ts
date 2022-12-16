import { TokenMeta } from '../../types'
import cw20Tokens from './cw20-tokens'
import nativeTokens from './native-tokens'
import tokens from './tokens'

export default { ...tokens, ...cw20Tokens, ...nativeTokens } as Record<
  string,
  TokenMeta
>
