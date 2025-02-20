import { TransportWebUSB } from '@bangjelkoski/ledgerhq-hw-transport-webusb'
import { TransportWebHID } from '@bangjelkoski/ledgerhq-hw-transport-webhid'
import { Cosmos as CosmosApp } from '@bangjelkoski/ledgerhq-hw-app-cosmos'
import { Transport } from '@bangjelkoski/ledgerhq-hw-transport'
import { LedgerCosmosException } from '@injectivelabs/exceptions'
import AccountManager from './AccountManager.js'

export default class LedgerTransport {
  private ledger: CosmosApp | null = null

  private accountManager: AccountManager | null = null

  protected static async getTransport(): Promise<Transport> {
    try {
      if (await TransportWebHID.isSupported()) {
        return await TransportWebHID.create()
      }

      if (await TransportWebUSB.isSupported()) {
        return await TransportWebHID.create()
      }
    } catch (e: unknown) {
      throw new LedgerCosmosException(new Error((e as any).message))
    }

    return await TransportWebHID.create()
  }

  async getInstance(): Promise<CosmosApp> {
    if (!this.ledger) {
      this.ledger = new CosmosApp((await LedgerTransport.getTransport()) as any)
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
