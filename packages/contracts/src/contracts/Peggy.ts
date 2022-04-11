import { ContractException } from '@injectivelabs/exceptions'
import {
  AccountAddress,
  ChainId,
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
    chainId,
    address,
    web3,
  }: {
    chainId: ChainId
    web3: Web3
    address: string
  }) {
    super({
      abi,
      chainId,
      web3,
      address,
    })
  }

  sendToCosmos({
    contractAddress,
    address,
    amount,
    transactionOptions,
  }: {
    contractAddress: string
    address: AccountAddress
    amount: string
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
          .sendToCosmos(contractAddress, address, amount)
          .encodeABI()
      },

      async sendTransactionAsync(): Promise<string> {
        const { transactionHash } = await contract.methods
          .sendToCosmos(contractAddress, address, amount)
          .send(getTransactionOptionsAsNonPayableTx(transactionOptions))

        return transactionHash
      },

      async estimateGasAsync(): Promise<number> {
        return contract.methods
          .sendToCosmos(contractAddress, address, amount)
          .estimateGas(transactionOptions)
      },
    }
  }
}
