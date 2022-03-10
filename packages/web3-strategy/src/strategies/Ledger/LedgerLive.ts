/* eslint-disable class-methods-use-this */
import { ChainId } from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { LedgerDerivationPathType } from '../../types'
import LedgerBase from './Base'

export default class LedgerLive extends LedgerBase {
  constructor({ chainId, web3 }: { chainId: ChainId; web3: Web3 }) {
    super({
      chainId,
      web3,
      derivationPathType: LedgerDerivationPathType.LedgerLive,
    })
  }
}
