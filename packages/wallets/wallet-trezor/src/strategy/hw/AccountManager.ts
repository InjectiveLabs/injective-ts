/* eslint-disable class-methods-use-this */
import { AccountAddress } from '@injectivelabs/ts-types'
import HDNode from 'hdkey'
import { TrezorWalletInfo, TrezorDerivationPathType } from '../../types.js'
import { addHexPrefix, publicKeyToAddress } from '@injectivelabs/sdk-ts'
import {
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '@injectivelabs/wallet-base'

const addressOfHDKey = (hdKey: HDNode): string => {
  const shouldSanitizePublicKey = true
  const derivedPublicKey = hdKey.publicKey
  const ethereumAddressWithoutPrefix = Buffer.from(
    publicKeyToAddress(derivedPublicKey, shouldSanitizePublicKey),
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

  async getWallets(
    baseDerivationPath: string,
    derivationPathType: TrezorDerivationPathType,
  ): Promise<TrezorWalletInfo[]> {
    const { start, end } = this.getOffset()

    /**
     * 1. Wallets are not yet fetched at all,
     * 2. Wallets are not yet fetched for that offset
     */
    if (!this.hasWallets() || !this.hasWalletsInOffset(start)) {
      await this.getWalletsBasedOnIndex({
        start,
        end,
        baseDerivationPath,
        derivationPathType,
      })
    }

    return this.wallets.slice(start, end)
  }

  getTrezorDerivationPathBasedOnType = ({
    fullBaseDerivationPath,
    derivationPathType,
    index,
  }: {
    fullBaseDerivationPath: string
    derivationPathType: TrezorDerivationPathType
    index: number
  }): string => {
    if (derivationPathType === TrezorDerivationPathType.Bip44) {
      return `${fullBaseDerivationPath}/${index}'/0/0`
    }

    return `${fullBaseDerivationPath}/0'/0/${index}`
  }

  private async getWalletsBasedOnIndex({
    start,
    end,
    baseDerivationPath,
    derivationPathType,
  }: {
    start: number
    end: number
    baseDerivationPath: string
    derivationPathType: TrezorDerivationPathType
  }) {
    for (let index = start; index < end; index += 1) {
      const path = this.getTrezorDerivationPathBasedOnType({
        fullBaseDerivationPath: baseDerivationPath,
        derivationPathType,
        index,
      })
      const hdKey = this.hdKey.derive(path)
      const address = addressOfHDKey(hdKey)

      this.wallets.push({
        hdKey,
        derivationPath: path,
        address: address.toLowerCase(),
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
      this.wallets.find(
        (wallet) => wallet.address.toLowerCase() === address.toLowerCase(),
      ) !== undefined
    )
  }

  async getWalletForAddress(
    address: AccountAddress,
  ): Promise<TrezorWalletInfo | undefined> {
    return this.wallets.find(
      (wallet) => wallet.address.toLowerCase() === address.toLowerCase(),
    )
  }

  reset() {
    this.wallets = []
  }
}
