import LedgerBase from './Base.js'
import { LedgerDerivationPathType } from '../../types.js'
import type { ConcreteEvmWalletStrategyArgs } from '@injectivelabs/wallet-base'

export class LedgerLive extends LedgerBase {
  constructor(args: ConcreteEvmWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: LedgerDerivationPathType.LedgerLive,
    })
  }
}
