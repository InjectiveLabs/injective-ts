import type BigNumberInWei from './BigNumberInWei'
import BigNumber from './BigNumber'
import { bigNumberBaseToWei } from './utils'

export default class BigNumberInBase extends BigNumber {
  static make(number: BigNumber.Value): BigNumberInBase {
    return new BigNumberInBase(number)
  }

  minus(n: BigNumber.Value, base?: number): BigNumberInBase {
    return new BigNumberInBase(super.minus(n, base))
  }

  plus(n: BigNumber.Value, base?: number): BigNumberInBase {
    return new BigNumberInBase(super.plus(n, base))
  }

  dividedBy(n: BigNumber.Value, base?: number): BigNumberInBase {
    return new BigNumberInBase(super.dividedBy(n, base))
  }

  div(n: BigNumber.Value, base?: number): BigNumberInBase {
    return new BigNumberInBase(super.div(n, base))
  }

  multipliedBy(n: BigNumber.Value, base?: number): BigNumberInBase {
    return new BigNumberInBase(super.multipliedBy(n, base))
  }

  times(n: BigNumber.Value, base?: number): BigNumberInBase {
    return new BigNumberInBase(super.times(n, base))
  }

  pow(n: BigNumber.Value, base?: number): BigNumberInBase {
    return new BigNumberInBase(super.pow(n, base))
  }

  toWei(decimals = 18): BigNumberInWei {
    return bigNumberBaseToWei(this, decimals)
  }
}
