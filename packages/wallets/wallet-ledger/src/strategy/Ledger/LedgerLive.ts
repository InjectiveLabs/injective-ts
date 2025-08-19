/* eslint-disable class-methods-use-this */
import { ConcreteEvmWalletStrategyArgs } from '@injectivelabs/wallet-base'
import LedgerBase from './Base.js'
import { LedgerDerivationPathType } from '../../types.js'

export class LedgerLive extends LedgerBase {
  constructor(args: ConcreteEvmWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: LedgerDerivationPathType.LedgerLive,
    })
  }
}
