import { TokenMeta } from '../../types'
import cw20Tokens from './cw20-tokens'
import tokens from './tokens'

export default { ...tokens, ...cw20Tokens } as Record<string, TokenMeta>
