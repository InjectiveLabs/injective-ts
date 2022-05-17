/* eslint-disable class-methods-use-this */
import { ChainId } from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { LedgerDerivationPathType } from '../../types'
import LedgerBase from './Base'

export default class LedgerLegacy extends LedgerBase {
  constructor(args: { chainId: ChainId; web3Creator: () => Web3 }) {
    super({
      ...args,
      derivationPathType: LedgerDerivationPathType.LedgerMew,
    })
  }
}
