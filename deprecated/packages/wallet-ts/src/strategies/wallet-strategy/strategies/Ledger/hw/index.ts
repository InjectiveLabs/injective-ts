import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import EthereumApp from '@ledgerhq/hw-app-eth'
import Transport from '@ledgerhq/hw-transport'
import { LedgerException } from '@injectivelabs/exceptions'
import AccountManager from './AccountManager.js'

export default class LedgerTransport {
  private ledger: EthereumApp | null = null

  private accountManager: AccountManager | null = null

  protected static async getTransport(): Promise<Transport> {
    try {
      if (await TransportWebHID.isSupported()) {
        const list = await TransportWebHID.list()

        if (list.length > 0 && list[0].opened) {
          return new TransportWebHID(list[0])
        }

        const existing = await TransportWebHID.openConnected().catch(() => null)

        if (existing) {
          return existing
        }

        return await TransportWebHID.request()
      }

      if (await TransportWebUSB.isSupported()) {
        const existing = await TransportWebUSB.openConnected().catch(() => null)

        if (existing) {
          return existing
        }

        return await TransportWebUSB.request()
      }
    } catch (e: unknown) {
      throw new LedgerException(new Error(e as any))
    }

    return TransportWebUSB.request()
  }

  async getInstance(): Promise<EthereumApp> {
    if (!this.ledger) {
      const transport = await LedgerTransport.getTransport()
      const EthereumApp = await import('@ledgerhq/hw-app-eth')

      this.ledger = new EthereumApp.default(transport)

      transport.on('disconnect', () => {
        this.ledger = null
        this.accountManager = null
      })
    }

    return this.ledger
  }

  async getAccountManager(): Promise<AccountManager> {
    if (!this.accountManager) {
      this.accountManager = new AccountManager(await this.getInstance())
    }

    return this.accountManager
  }

  async refresh() {
    if (!this.ledger) {
      return new LedgerTransport()
    }

    this.ledger.transport.close()

    return new LedgerTransport()
  }
}
