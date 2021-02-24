import { InjectiveFutures } from '@injectivelabs/web3-contract-typings/types/InjectiveFutures'
import { ChainId } from '@injectivelabs/ts-types'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import abi from './abi/injective_futures'
import BaseContract from '../BaseContract'

export class InjectiveFuturesContract extends BaseContract<
  InjectiveFutures,
  keyof InjectiveFutures['events']
> {
  static contractName = 'InjectiveFutures'

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
