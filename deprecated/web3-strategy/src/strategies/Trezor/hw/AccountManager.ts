/* eslint-disable class-methods-use-this */
import { AccountAddress } from '@injectivelabs/ts-types'
import HDNode from 'hdkey'
import { addHexPrefix, publicToAddress } from 'ethereumjs-util'
import { TrezorWalletInfo } from '../../../types'
import {
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
  DEFAULT_BASE_DERIVATION_PATH,
} from '../../../constants'

const addressOfHDKey = (hdKey: HDNode): string => {
  const shouldSanitizePublicKey = true
  const derivedPublicKey = hdKey.publicKey
  const ethereumAddressWithoutPrefix = publicToAddress(
    derivedPublicKey,
    shouldSanitizePublicKey,
  ).toString('hex')
  const address = addHexPrefix(ethereumAddressWithoutPrefix)

  return address
}

export default class AccountManager {
  private wallets: TrezorWalletInfo[] = []

  private hdKey: HDNode

  constructor(hdKey: HDNode) {
    this.wallets = []
    this.hdKey = hdKey
  }

  async getWallets(): Promise<TrezorWalletInfo[]> {
    const { start, end } = this.getOffset()

    /**
     * 1. Wallets are not yet fetched at all,
     * 2. Wallets are not yet fetched for that offset
     */
    if (!this.hasWallets() || !this.hasWalletsInOffset(start)) {
      await this.getWalletsBasedOnIndex({
        start,
        end,
      })
    }

    return this.wallets.slice(start, end)
  }

  private async getWalletsBasedOnIndex({
    start,
    end,
  }: {
    start: number
    end: number
  }) {
    for (let index = start; index < end; index += 1) {
      const path = `m/${index}`
      const hdKey = this.hdKey.derive(path)
      const address = addressOfHDKey(hdKey)

      this.wallets.push({
        address,
        hdKey,
        derivationPath: `${DEFAULT_BASE_DERIVATION_PATH}/0'/0/${index}`,
      })
    }
  }

  private hasWallets(): boolean {
    return this.wallets.length > 0
  }

  private hasWalletsInOffset(offset: number): boolean {
    return this.wallets.length > offset
  }

  private getOffset(): { start: number; end: number } {
    const totalWallets = this.wallets.length
    const nextBatchStart = totalWallets
    const nextBatchEnd = totalWallets + DEFAULT_NUM_ADDRESSES_TO_FETCH

    return {
      start: nextBatchStart,
      end: nextBatchEnd,
    }
  }

  hasWalletForAddress(address: AccountAddress): boolean {
    return (
      this.wallets.find((wallet) => wallet.address === address) !== undefined
    )
  }

  async getWalletForAddress(
    address: AccountAddress,
  ): Promise<TrezorWalletInfo | undefined> {
    return this.wallets.find((wallet) => wallet.address === address)
  }
}
