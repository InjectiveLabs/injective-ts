import { Erc20TokenMeta } from './Erc20TokenMeta'
import { Erc20TokenMetaFactory } from './Erc20TokenMetaFactory'

export * from './ibc'
export * from './types'
export const erc20TokenMeta = Erc20TokenMetaFactory.make()
export { Erc20TokenMeta, Erc20TokenMetaFactory }
