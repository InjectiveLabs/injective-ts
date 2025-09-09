 
import TrezorBase from './Base.js'
import { TrezorDerivationPathType } from '../types.js'
import type { ConcreteEvmWalletStrategyArgs } from '@injectivelabs/wallet-base'

export class TrezorBip44 extends TrezorBase {
  constructor(args: ConcreteEvmWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: TrezorDerivationPathType.Bip44,
    })
  }
}
