import { ChainId } from '@injectivelabs/ts-types'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import { ChainIdContractAddresses } from './types'
import { BaseCurrencyContract } from './contracts/BaseCurrency'
import { DepositManagerContract } from './contracts/DepositManager'
import { PeggyContract } from './contracts/Peggy'

export class Contracts {
  public readonly peggy: PeggyContract

  public readonly injective: BaseCurrencyContract

  public readonly depositManager: DepositManagerContract

  constructor({
    chainId,
    contractAddresses,
    web3Strategy,
  }: {
    chainId: ChainId
    contractAddresses: ChainIdContractAddresses
    web3Strategy: Web3Strategy
  }) {
    this.peggy = new PeggyContract({
      chainId,
      web3Strategy,
      address: contractAddresses.peggy,
    })
    this.injective = new BaseCurrencyContract({
      chainId,
      web3Strategy,
      address: contractAddresses.injective,
    })
    this.depositManager = new DepositManagerContract({
      chainId,
      web3Strategy,
      address: contractAddresses.depositManager,
    })
  }
}
