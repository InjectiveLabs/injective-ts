import {
  BigNumber,
  BigNumberInBase,
  BigNumberInWei,
} from '@injectivelabs/utils'

export const INJ_DENOM = 'inj'
export const INJECTIVE_DENOM = 'inj'
export const INJ_COIN_GECKO_ID = 'injective-protocol'

export const GAS_LIMIT_MULTIPLIER = 1.2
export const ZERO: BigNumber = new BigNumber(0)
export const ZERO_TO_STRING = '0'
export const ZERO_IN_WEI: BigNumberInWei = new BigNumberInWei(0)
export const ZERO_IN_BASE: BigNumberInBase = new BigNumberInBase(0)
export const UNLIMITED_ALLOWANCE: BigNumber = new BigNumber(2).pow(256).minus(1)

export const ZERO_ADDRESS: string = '0x0000000000000000000000000000000000000000'
export const ZERO_BYTES_32: string =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
export const ZERO_MARKET_ID: string =
  '0x000000000000000000000000000000000000000000000000000000000000000000000000'
export const NULL_BYTES: string = '0x'

export const SECONDS_IN_A_DAY: BigNumber = new BigNumber(60 * 60 * 24)
export const GWEI_IN_WEI: BigNumber = new BigNumber(1000000000)
export const TX_DEFAULTS_GAS = 80_000_000
export const DEFAULT_GAS_PRICE = new BigNumber(6).times(GWEI_IN_WEI)

export const BIG_NUMBER_ROUND_DOWN_MODE = BigNumberInBase.ROUND_DOWN
export const BIG_NUMBER_ROUND_UP_MODE = BigNumberInBase.ROUND_UP
