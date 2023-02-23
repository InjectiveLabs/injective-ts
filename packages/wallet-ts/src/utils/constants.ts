import { BigNumber, BigNumberInBase } from '@injectivelabs/utils'

export const GWEI_IN_WEI: BigNumber = new BigNumber(1000000000)
export const TIP_IN_GWEI: BigNumberInBase = new BigNumberInBase(2).times(
  GWEI_IN_WEI,
)
