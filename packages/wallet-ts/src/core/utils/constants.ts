import { BigNumberInBase } from '@injectivelabs/utils'

export const GWEI_IN_WEI: BigNumberInBase = new BigNumberInBase(1000000000)
export const GAS_LIMIT_MULTIPLIER = 1.2
export const TX_DEFAULTS_GAS = 80_000_000
export const DEFAULT_GAS_PRICE = new BigNumberInBase(6).times(GWEI_IN_WEI)
export const INJ_DENOM = 'inj'
