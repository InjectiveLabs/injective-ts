import { TrezorConnect } from '@bangjelkoski/trezor-connect-web'
import { WalletException } from '@injectivelabs/exceptions'
import BaseTrezorTransport from './base.js'

const TREZOR_CONNECT_MANIFEST = {
  email: 'contact@injectivelabs.org',
  appUrl: 'https://injectivelabs.org',
}

export default class TrezorTransportInit extends BaseTrezorTransport {
  constructor() {
    super()

    try {
      TrezorConnect.init({
        lazyLoad: true,
        manifest: TREZOR_CONNECT_MANIFEST,
      })
    } catch (e) {
      throw new WalletException(e as Error)
    }
  }
}
