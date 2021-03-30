// eslint-disable-next-line import/no-cycle
import { WalletUtils } from './WalletUtils'
import { DEFAULT_ADDRESS_SEARCH_LIMIT } from '../constants'
import { DerivedHDKeyInfo } from '../types'

export class DerivedHDKeyInfoIterator
  implements IterableIterator<DerivedHDKeyInfo> {
  private readonly parentDerivedKeyInfo: DerivedHDKeyInfo

  private readonly searchLimit: number

  private index: number

  constructor(
    initialDerivedKey: DerivedHDKeyInfo,
    searchLimit: number = DEFAULT_ADDRESS_SEARCH_LIMIT,
  ) {
    this.searchLimit = searchLimit
    this.parentDerivedKeyInfo = initialDerivedKey
    this.index = 0
  }

  public next(): IteratorResult<DerivedHDKeyInfo> {
    const { baseDerivationPath } = this.parentDerivedKeyInfo
    const derivationIndex = this.index
    const fullDerivationPath = `m/${baseDerivationPath}/${derivationIndex}`
    const path = `m/${derivationIndex}`
    console.log(path)
    const hdKey = this.parentDerivedKeyInfo.hdKey.derive(path)
    const address = WalletUtils.addressOfHDKey(hdKey)
    const derivedKey: DerivedHDKeyInfo = {
      address,
      hdKey,
      baseDerivationPath,
      derivationPath: fullDerivationPath,
    }

    const isDone = this.index === this.searchLimit
    this.index += 1

    return {
      done: isDone,
      value: derivedKey,
    }
  }

  public [Symbol.iterator](): IterableIterator<DerivedHDKeyInfo> {
    return this
  }
}
