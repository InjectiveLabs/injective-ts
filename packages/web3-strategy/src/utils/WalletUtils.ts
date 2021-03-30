import { publicToAddress, addHexPrefix } from 'ethereumjs-util'
import HDNode from 'hdkey'
// eslint-disable-next-line import/no-cycle
import { DerivedHDKeyInfoIterator } from './DerivedHDKeyInfoIterator'
import { DerivedHDKeyInfo } from '../types'

export class WalletUtils {
  static calculateDerivedHDKeyInfos(
    parentDerivedKeyInfo: DerivedHDKeyInfo,
    numberOfKeys: number,
  ): DerivedHDKeyInfo[] {
    const derivedKeys: DerivedHDKeyInfo[] = []
    const derivedKeyIterator = new DerivedHDKeyInfoIterator(
      parentDerivedKeyInfo,
      numberOfKeys,
    )

    for (const key of derivedKeyIterator) {
      derivedKeys.push(key)
    }

    return derivedKeys
  }

  static findDerivedKeyInfoForAddressIfExists(
    address: string,
    parentDerivedKeyInfo: DerivedHDKeyInfo,
    searchLimit: number,
  ): DerivedHDKeyInfo | undefined {
    let matchedKey: DerivedHDKeyInfo | undefined
    const lowercaseAddress = address.toLowerCase()

    const derivedKeyIterator = new DerivedHDKeyInfoIterator(
      parentDerivedKeyInfo,
      searchLimit,
    )

    for (const key of derivedKeyIterator) {
      if (key.address === lowercaseAddress) {
        matchedKey = key
        break
      }
    }

    return matchedKey
  }

  static addressOfHDKey(hdKey: HDNode): string {
    const shouldSanitizePublicKey = true
    const derivedPublicKey = hdKey.publicKey
    const ethereumAddressUnprefixed = publicToAddress(
      derivedPublicKey,
      shouldSanitizePublicKey,
    ).toString('hex')
    const address = addHexPrefix(ethereumAddressUnprefixed).toLowerCase()

    return address
  }
}
