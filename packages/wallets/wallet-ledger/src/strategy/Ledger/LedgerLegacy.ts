/* eslint-disable class-methods-use-this */
import { ConcreteEthereumWalletStrategyArgs } from '@injectivelabs/wallet-base'
import { LedgerDerivationPathType } from '../../types'
import LedgerBase from './Base'

export class LedgerLegacy extends LedgerBase {
  constructor(args: ConcreteEthereumWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: LedgerDerivationPathType.LedgerMew,
    })
  }
}
