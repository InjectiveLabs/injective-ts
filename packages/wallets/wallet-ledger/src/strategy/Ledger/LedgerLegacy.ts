/* eslint-disable class-methods-use-this */
import { ConcreteEvmWalletStrategyArgs } from '@injectivelabs/wallet-base'
import { LedgerDerivationPathType } from '../../types.js'
import LedgerBase from './Base.js'

export class LedgerLegacy extends LedgerBase {
  constructor(args: ConcreteEvmWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: LedgerDerivationPathType.LedgerMew,
    })
  }
}
