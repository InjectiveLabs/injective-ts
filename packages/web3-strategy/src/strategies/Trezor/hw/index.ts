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

  private hdKey: HDNode = new HDNode()

  async connect() {
    await this.init()
  }

  async getAccountManager(): Promise<AccountManager> {
    if (!this.accountManager) {
      this.accountManager = new AccountManager(this.hdKey)
    }

    return this.accountManager
  }

  private isUnlocked() {
    return Boolean(this.hdKey && this.hdKey.publicKey)
  }

  private async init() {
    if (this.isUnlocked()) {
      return Promise.resolve()
    }

    TrezorConnect.on('DEVICE_EVENT', (event) => {
      if (event && event.payload && event.payload.features) {
        //
      }
    })

    TrezorConnect.init({ manifest: TREZOR_CONNECT_MANIFEST })

    return new Promise((resolve, reject) => {
      TrezorConnect.getPublicKey({
        path: `${DEFAULT_BASE_DERIVATION_PATH}/0'/0`,
        coin: 'ETH',
      })
        .then((response) => {
          if (!response.success) {
            return reject(
              new Error(
                (response.payload && response.payload.error) ||
                  'Please make sure your Trezor is connected and unlocked',
              ),
            )
          }

          this.hdKey.publicKey = Buffer.from(response.payload.publicKey, 'hex')
          this.hdKey.chainCode = Buffer.from(response.payload.chainCode, 'hex')

          return resolve(TrezorConnect)
        })
        .catch((e) => {
          reject(
            new Error(
              (e && e.toString()) ||
                'Please make sure your Trezor is connected and unlocked',
            ),
          )
        })
    })
  }
}
