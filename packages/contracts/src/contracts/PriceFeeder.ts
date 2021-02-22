import { PriceFeeder } from '@injectivelabs/web3-contract-typings/types/PriceFeeder'
import { ChainId } from '@injectivelabs/ts-types'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import abi from './abi/injective_futures'
import BaseContract from '../base'

export class PriceFeederContract extends BaseContract<
  PriceFeeder,
  keyof PriceFeeder['events']
> {
  static contractName = 'PriceFeeder'

  constructor({
    chainId,
    address,
    web3Strategy,
  }: {
    chainId: ChainId
    address: string
    web3Strategy: Web3Strategy
  }) {
    super({
      abi,
      chainId,
      address,
      web3Strategy,
    })
  }
}
