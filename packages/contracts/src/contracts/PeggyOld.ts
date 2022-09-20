import {
  AccountAddress,
  EthereumChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import Web3 from 'web3'
import { getTransactionOptionsAsNonPayableTx } from '../utils'
import abi from './abi/peggy-old'
import { ContractTxFunctionObj } from '../types'
import BaseContract from '../BaseContract'

export class PeggyOldContract extends BaseContract<any> {
  static contractName = 'PeggyOld'

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
        throw new Error('You cannot call this contract method as a call')
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
