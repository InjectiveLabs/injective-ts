import TransportWebUsb from '@ledgerhq/hw-transport-webusb'
// @ts-ignore
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import Transport from '@ledgerhq/hw-transport'
import { Web3Exception } from '@injectivelabs/exceptions'
import { isServerSide } from '@injectivelabs/utils'
import EthLedger from '@ledgerhq/hw-app-eth'
import { WindowWithLedgerSupport } from '../../types'

const $window = ((isServerSide()
  ? {}
  : window) as unknown) as WindowWithLedgerSupport

export const supportsWebSockets =
  'WebSocket' in $window || 'MozWebSocket' in $window
export const isLedgerSupportedInWindow = Boolean($window && supportsWebSockets)

export default class LedgerTransport {
  private app: typeof EthLedger

  private transport: Transport<string> | null

  private ledger: EthLedger<TransportWebUsb> | null

  constructor(app: typeof EthLedger) {
    this.app = app
    this.transport = null
    this.ledger = null
  }

  isSupported = async () =>
    (await TransportWebUsb.isSupported()) && isLedgerSupportedInWindow

  async createTransport() {
    if (!this.transport) {
      this.transport = await TransportWebUsb.create()

      this.transport.on('disconnect', () => {
        this.ledger = null
        this.transport = null
      })
    }
  }

  async createTransportExperimental() {
    if (!this.transport) {
      this.transport = await TransportWebHID.create()

      // @ts-ignore
      this.transport.on('disconnect', () => {
        this.ledger = null
        this.transport = null
      })
    }
  }

  async getInstance(): Promise<EthLedger<TransportWebUsb | TransportWebHID>> {
    if (!(await this.isSupported())) {
      throw new Web3Exception('Please update your Chrome Browser')
    }

    try {
      await this.createTransport()
    } catch (e) {
      try {
        await this.createTransportExperimental()
      } catch (e) {
        throw new Web3Exception(e.message)
      }
    }

    if (!this.ledger && this.transport) {
      /* eslint-disable new-cap */
      this.ledger = new this.app(this.transport)
    }

    return this.ledger as EthLedger<TransportWebUsb>
  }
}
