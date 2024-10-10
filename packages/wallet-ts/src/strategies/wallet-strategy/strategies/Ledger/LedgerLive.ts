/* eslint-disable class-methods-use-this */
import { EthereumWalletStrategyArgs } from '../../../types'
import { LedgerDerivationPathType } from '../../types'
import LedgerBase from './Base'

export default class LedgerLive extends LedgerBase {
  constructor(args: EthereumWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: LedgerDerivationPathType.LedgerLive,
    })
  }
}
