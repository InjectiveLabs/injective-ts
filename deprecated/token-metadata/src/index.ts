import { TokenFactory } from './TokenFactory'
import { TokenMetaUtils } from './TokenMetaUtils'
import { TokenFactoryStatic } from './TokenFactoryStatic'
import { TokenMetaUtilsFactory } from './TokenMetaUtilsFactory'

export * from './ibc'
export * from './types'
export * from './utils'

export const tokenFactory = TokenFactory.make()
export const tokenMetaUtils = TokenMetaUtilsFactory.make()

export {
  TokenFactory,
  TokenMetaUtils,
  TokenFactoryStatic,
  TokenMetaUtilsFactory,
}
