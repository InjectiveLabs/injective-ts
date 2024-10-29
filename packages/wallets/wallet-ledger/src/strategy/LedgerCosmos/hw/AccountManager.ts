import { AccountAddress } from '@injectivelabs/ts-types'
import type CosmosApp from '@ledgerhq/hw-app-cosmos'
import { LedgerWalletInfo } from '../../../types'
import { DEFAULT_NUM_ADDRESSES_TO_FETCH } from '@injectivelabs/wallet-base'

export default class AccountManager {
  private wallets: LedgerWalletInfo[] = []

  private ledger: CosmosApp

  constructor(ledger: CosmosApp) {
    this.ledger = ledger
    this.wallets = []
  }

  async getWallets(baseDerivationPath: string): Promise<LedgerWalletInfo[]> {
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
      })
    }

    return this.wallets.slice(start, end)
  }

  getLedgerDerivationPathBasedOnType = ({
    fullBaseDerivationPath,
    index,
  }: {
    fullBaseDerivationPath: string
    index: number
  }): string => {
    return `${fullBaseDerivationPath}/${index}'/0/0`
  }

  private async getWalletsBasedOnIndex({
    start,
    end,
    baseDerivationPath,
  }: {
    start: number
    end: number
    baseDerivationPath: string
  }) {
    for (let index = start; index < end; index += 1) {
      const path = this.getLedgerDerivationPathBasedOnType({
        fullBaseDerivationPath: baseDerivationPath,
        index,
      })
      const { address, publicKey } = await this.ledger.getAddress(path, 'inj')

      this.wallets.push({
        publicKey,
        baseDerivationPath,
        address: address.toLowerCase(),
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
      this.wallets.find(
        (wallet) => wallet.address.toLowerCase() === address.toLowerCase(),
      ) !== undefined
    )
  }

  async getWalletForAddress(
    address: AccountAddress,
  ): Promise<LedgerWalletInfo | undefined> {
    return this.wallets.find(
      (wallet) => wallet.address.toLowerCase() === address.toLowerCase(),
    )
  }

  reset() {
    this.wallets = []
  }
}
