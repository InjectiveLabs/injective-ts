import TransportWebUsb from '@ledgerhq/hw-transport-webusb'
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

  async getInstance(): Promise<EthLedger<TransportWebUsb>> {
    try {
      if (!(await this.isSupported())) {
        throw new Web3Exception('Please update your Chrome Browser')
      }

      await this.createTransport()

      if (!this.ledger && this.transport) {
        /* eslint-disable new-cap */
        this.ledger = new this.app(this.transport)
      }

      return this.ledger as EthLedger<TransportWebUsb>
    } catch (e) {
      throw new Web3Exception(e.message)
    }
  }
}
