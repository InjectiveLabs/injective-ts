import TrezorConnect from 'trezor-connect'
import HDNode from 'hdkey'
import { DEFAULT_BASE_DERIVATION_PATH } from '../../../constants'
import AccountManager from './AccountManager'

const TREZOR_CONNECT_MANIFEST = {
  email: 'contact@injective.com',
  appUrl: 'https://injective.com',
}

export default class TrezorTransport {
  private accountManager: AccountManager | null = null

  private connected: boolean = false

  async connect() {
    if (!this.connected) {
      await this.init()
    }

    this.connected = true
  }

  async getAccountManager(): Promise<AccountManager> {
    if (!this.accountManager) {
      await this.connect()
    }

    return this.accountManager as AccountManager
  }

  private async init() {
    TrezorConnect.on('DEVICE_EVENT', (event) => {
      if (event && event.payload && event.payload.features) {
        // console.log(event.payload.features.model)
      }
    })

    await TrezorConnect.init({
      lazyLoad: true,
      popup: true,
      manifest: TREZOR_CONNECT_MANIFEST,
    })

    try {
      const fullBaseDerivationPath = `m/${DEFAULT_BASE_DERIVATION_PATH}`
      const path = `${fullBaseDerivationPath}/0'/0`
      const result = await TrezorConnect.getPublicKey({
        path,
        coin: 'ETH',
      })

      if (!result.success) {
        throw new Error(
          (result.payload && result.payload.error) || 'Unknown error',
        )
      }

      const hdKey = HDNode.fromExtendedKey(result.payload.xpub)

      this.accountManager = new AccountManager(hdKey)
    } catch (e) {
      throw new Error(
        (e as any).message ||
          'Please make sure your Trezor is connected and unlocked',
      )
    }
  }
}
