import TrezorConnect from '@trezor/connect-web'
import HDNode from 'hdkey'
import { DEFAULT_BASE_DERIVATION_PATH } from '@injectivelabs/wallet-base'
import AccountManager from './AccountManager.js'
import { WalletException } from '@injectivelabs/exceptions'

// @ts-ignore
const trezorConnect = TrezorConnect.default || TrezorConnect

const TREZOR_CONNECT_MANIFEST = {
  email: 'contact@injectivelabs.org',
  appUrl: 'https://injectivelabs.org',
}

export default class TrezorTransport {
  private accountManager: AccountManager | null = null

  private hdKey: HDNode = new HDNode()

  constructor() {
    try {
      trezorConnect.init({ lazyLoad: true, manifest: TREZOR_CONNECT_MANIFEST })
    } catch (e) {
      throw new WalletException(e as Error)
    }
  }

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

    return new Promise((resolve, reject) => {
      TrezorConnect.getPublicKey({
        path: `${DEFAULT_BASE_DERIVATION_PATH}/0'/0`,
        coin: 'ETH',
      })
        .then((response: any) => {
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
        .catch((e: any) => {
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
