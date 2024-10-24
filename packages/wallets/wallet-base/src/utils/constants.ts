import { BigNumber, BigNumberInBase } from '@injectivelabs/utils'

export const GWEI_IN_WEI: BigNumber = new BigNumber(1000000000)
export const TIP_IN_GWEI: BigNumberInBase = new BigNumberInBase(2).times(
  GWEI_IN_WEI,
)

export const DEFAULT_BASE_DERIVATION_PATH = "m/44'/60'"
export const DEFAULT_NUM_ADDRESSES_TO_FETCH = 5
export const DEFAULT_ADDRESS_SEARCH_LIMIT = 100
