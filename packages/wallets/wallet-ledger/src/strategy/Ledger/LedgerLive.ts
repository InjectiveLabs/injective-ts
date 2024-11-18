/* eslint-disable class-methods-use-this */
import { ConcreteEthereumWalletStrategyArgs } from '@injectivelabs/wallet-base'
import { LedgerDerivationPathType } from '../../types.js'
import LedgerBase from './Base.js'

export class LedgerLive extends LedgerBase {
  constructor(args: ConcreteEthereumWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: LedgerDerivationPathType.LedgerLive,
    })
  }
}
