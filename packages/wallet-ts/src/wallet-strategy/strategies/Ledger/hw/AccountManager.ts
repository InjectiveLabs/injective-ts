import { AccountAddress } from '@injectivelabs/ts-types'
import { publicToAddress, addHexPrefix } from 'ethereumjs-util'
import HDNode from 'hdkey'
import EthereumApp from '@ledgerhq/hw-app-eth'
import { LedgerDerivationPathType, LedgerWalletInfo } from '../../../types'
import { DEFAULT_NUM_ADDRESSES_TO_FETCH } from '../../../constants'

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
  private wallets: LedgerWalletInfo[] = []

  private ledger: EthereumApp

  constructor(ledger: EthereumApp) {
    this.ledger = ledger
    this.wallets = []
  }

  async getWallets(
    baseDerivationPath: string,
    derivationPathType: LedgerDerivationPathType,
  ): Promise<LedgerWalletInfo[]> {
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

  getLedgerDerivationPathBasedOnType = ({
    fullBaseDerivationPath,
    derivationPathType,
    index,
  }: {
    fullBaseDerivationPath: string
    derivationPathType: LedgerDerivationPathType
    index: number
  }): string => {
    if (derivationPathType === LedgerDerivationPathType.LedgerLive) {
      return `${fullBaseDerivationPath}/${index}'/0/0`
    }

    return `${fullBaseDerivationPath}/0'/${index}`
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
    derivationPathType: LedgerDerivationPathType
  }) {
    for (let index = start; index < end; index += 1) {
      const path = this.getLedgerDerivationPathBasedOnType({
        fullBaseDerivationPath: baseDerivationPath,
        derivationPathType,
        index,
      })
      const result = await this.ledger.getAddress(path)

      const hdKey = new HDNode()
      hdKey.publicKey = Buffer.from(result.publicKey, 'hex')
      hdKey.chainCode = Buffer.from(result.chainCode || '', 'hex')
      const address = result.address || addressOfHDKey(hdKey)

      this.wallets.push({
        hdKey,
        address,
        baseDerivationPath,
        derivationPath: path,
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
  ): Promise<LedgerWalletInfo | undefined> {
    return this.wallets.find((wallet) => wallet.address === address)
  }
}
