import { ContractException } from '@injectivelabs/exceptions'
import {
  AccountAddress,
  EthereumChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { getTransactionOptionsAsNonPayableTx } from '../utils'
import abi from './abi/peggy'
import { ContractTxFunctionObj } from '../types'
import BaseContract from '../BaseContract'

export class PeggyContract extends BaseContract<any> {
  static contractName = 'Peggy'

  constructor({
    ethereumChainId,
    address,
    web3,
  }: {
    ethereumChainId: EthereumChainId
    web3: Web3
    address: string
  }) {
    super({
      abi,
      ethereumChainId,
      web3,
      address,
    })
  }

  sendToInjective({
    contractAddress,
    address,
    amount,
    data = '',
    transactionOptions,
  }: {
    contractAddress: string
    address: AccountAddress
    amount: string
    data?: any
    transactionOptions: TransactionOptions
  }): ContractTxFunctionObj<string> {
    const { contract } = this

    return {
      callAsync() {
        throw new ContractException(
          'You cannot call this contract method as a call',
        )
      },

      getABIEncodedTransactionData(): string {
        return contract.methods
          .sendToInjective(contractAddress, address, amount, data)
          .encodeABI()
      },

      async sendTransactionAsync(): Promise<string> {
        const { transactionHash } = await contract.methods
          .sendToInjective(contractAddress, address, amount)
          .send(getTransactionOptionsAsNonPayableTx(transactionOptions))

        return transactionHash
      },

      async estimateGasAsync(): Promise<number> {
        return contract.methods
          .sendToInjective(contractAddress, address, amount, data)
          .estimateGas(transactionOptions)
      },
    }
  }
}
