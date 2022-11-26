import Web3 from 'web3'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import {
  ErrorType,
  GeneralException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { WalletStrategyEthereumOptions } from '../../types'

export default abstract class BaseConcreteStrategy {
  protected chainId: ChainId

  protected ethereumChainId?: EthereumChainId

  protected web3?: Web3

  protected constructor({
    ethereumOptions,
    chainId,
    web3,
  }: {
    web3?: Web3
    chainId: ChainId
    ethereumOptions?: WalletStrategyEthereumOptions
  }) {
    this.web3 = web3
    this.ethereumChainId = ethereumOptions
      ? ethereumOptions.ethereumChainId
      : undefined
    this.chainId = chainId
  }

  getWeb3(): Web3 {
    const { web3 } = this

    if (!web3) {
      throw new GeneralException(
        new Error(
          'This wallet does not support Web3 (its not Ethereum compatible)',
        ),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.ExecutionError,
        },
      )
    }

    return web3
  }
}
