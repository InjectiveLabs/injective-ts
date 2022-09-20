import {
  AccountAddress,
  EthereumChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { UnspecifiedErrorCode, Web3Exception } from '@injectivelabs/exceptions'
import { getTransactionOptionsAsNonPayableTx } from '../utils'
import abi from './abi/peggy'
import { Contract, ContractTxFunctionObj } from '../types'
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
        throw new Web3Exception(
          new Error('You cannot call this contract method as a call'),
          {
            code: UnspecifiedErrorCode,
            contextModule: Contract.Peggy,
          },
        )
      },

      getABIEncodedTransactionData(): string {
        return contract.methods
          .sendToInjective(contractAddress, address, amount, data)
          .encodeABI()
      },

      async sendTransactionAsync(): Promise<string> {
        const { transactionHash } = await contract.methods
          .sendToInjective(contractAddress, address, amount, data)
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
