/* eslint-disable class-methods-use-this */
import { EthereumWalletStrategyArgs } from '../../../types/index.js'
import { LedgerDerivationPathType } from '../../types.js'
import LedgerBase from './Base.js'

export default class LedgerLive extends LedgerBase {
  constructor(args: EthereumWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: LedgerDerivationPathType.LedgerLive,
    })
  }
}
