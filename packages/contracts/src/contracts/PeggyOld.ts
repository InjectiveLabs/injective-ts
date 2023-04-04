import {
  AccountAddress,
  EthereumChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import { UnspecifiedErrorCode, Web3Exception } from '@injectivelabs/exceptions'
import { getTransactionOptionsAsNonPayableTx } from '../utils'
import abi from './abi/peggy-old'
import { Contract, ContractTxFunctionObj } from '../types'
import BaseContract from '../BaseContract'

export class PeggyOldContract extends BaseContract<any> {
  static contractName = 'PeggyOld'

  constructor({
    ethereumChainId,
    address,
    provider,
  }: {
    ethereumChainId: EthereumChainId
    provider: any
    address: string
  }) {
    super({
      abi: JSON.stringify(abi),
      ethereumChainId,
      provider,
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
        throw new Web3Exception(
          new Error('You cannot call this contract method as a call'),
          {
            code: UnspecifiedErrorCode,
            contextModule: Contract.PeggyOld,
          },
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
