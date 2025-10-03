import { LedgerException } from '@injectivelabs/exceptions'
import AccountManager from './AccountManager.js'
import {
  loadEthType,
  loadTransportWebUSB,
  loadTransportWebHIDType,
} from '../../lib.js'
import type { Transport } from '@bangjelkoski/ledgerhq-hw-transport'
import type { Eth as EthereumApp } from '@bangjelkoski/ledgerhq-hw-app-eth'

export default class LedgerTransport {
  private ledger: EthereumApp | null = null

  private accountManager: AccountManager | null = null

  protected static async getTransport(): Promise<Transport> {
    const TransportWebUSB = await loadTransportWebUSB()
    const TransportWebHID = await loadTransportWebHIDType()

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
      throw new LedgerException(new Error((e as any).message))
    }

    return TransportWebUSB.request()
  }

  async getInstance(): Promise<EthereumApp> {
    const EthereumApp = await loadEthType()

    if (!this.ledger) {
      const transport = await LedgerTransport.getTransport()

      this.ledger = new EthereumApp(transport)

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
