/* eslint-disable class-methods-use-this */
import { ConcreteEvmWalletStrategyArgs } from '@injectivelabs/wallet-base'
import { TrezorDerivationPathType } from '../types.js'
import TrezorBase from './Base.js'

export class TrezorBip44 extends TrezorBase {
  constructor(args: ConcreteEvmWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: TrezorDerivationPathType.Bip44,
    })
  }
}
