import Web3 from 'web3'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import {
  ErrorType,
  GeneralException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

export default abstract class BaseConcreteStrategy {
  protected ethereumChainId: EthereumChainId

  protected chainId: ChainId

  protected web3?: Web3

  protected constructor({
    ethereumChainId,
    chainId,
  }: {
    ethereumChainId: EthereumChainId
    chainId: ChainId
    web3?: Web3
  }) {
    this.ethereumChainId = ethereumChainId
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
