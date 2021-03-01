import { Peggy } from '@injectivelabs/web3-contract-typings/types/Peggy'
import { ContractException } from '@injectivelabs/exceptions'
import {
  AccountAddress,
  ChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import { BigNumberInWei } from '@injectivelabs/utils'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import { getTransactionOptionsAsNonPayableTx } from '@injectivelabs/tx-utils'
import abi from './abi/peggy'
import { ContractTxFunctionObj } from '../types'
import BaseContract from '../BaseContract'

export class PeggyContract extends BaseContract<Peggy, keyof Peggy['events']> {
  static contractName = 'Peggy'

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

  sendToCosmos({
    contractAddress,
    address,
    amount,
    transactionOptions,
  }: {
    contractAddress: string
    address: AccountAddress
    amount: BigNumberInWei
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
          .sendToCosmos(contractAddress, address, amount.toFixed())
          .encodeABI()
      },

      async sendTransactionAsync(): Promise<string> {
        const { transactionHash } = await contract.methods
          .sendToCosmos(contractAddress, address, amount.toFixed())
          .send(getTransactionOptionsAsNonPayableTx(transactionOptions))

        return transactionHash
      },

      async estimateGasAsync(): Promise<number> {
        return contract.methods
          .sendToCosmos(contractAddress, address, amount.toFixed())
          .estimateGas(transactionOptions)
      },
    }
  }
}
