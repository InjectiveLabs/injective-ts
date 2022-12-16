import { TokenMeta } from '../../types'
import tokens from '../tokens'
import nativeTokens from '../native-tokens'

export default { ...tokens, ...nativeTokens } as Record<string, TokenMeta>
