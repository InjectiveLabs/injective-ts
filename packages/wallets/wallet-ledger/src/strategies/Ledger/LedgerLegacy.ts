/* eslint-disable class-methods-use-this */
import { EthereumWalletStrategyArgs } from '@injectivelabs/wallet-ts'
import { LedgerDerivationPathType } from '../../types'
import LedgerBase from './Base'

export default class LedgerLegacy extends LedgerBase {
  constructor(args: EthereumWalletStrategyArgs) {
    super({
      ...args,
      derivationPathType: LedgerDerivationPathType.LedgerMew,
    })
  }
}
