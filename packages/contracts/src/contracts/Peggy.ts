import {
  AccountAddress,
  EthereumChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
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

  deployERC20({
    denom,
    name,
    symbol,
    decimals = 18,
    transactionOptions,
  }: {
    denom: string
    name: string
    symbol: string
    decimals?: number
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
          .deployERC20(denom, name, symbol, decimals)
          .encodeABI()
      },

      async sendTransactionAsync(): Promise<string> {
        const { transactionHash } = await contract.methods
          .deployERC20(denom, name, symbol, decimals)
          .send(getTransactionOptionsAsNonPayableTx(transactionOptions))

        return transactionHash
      },

      async estimateGasAsync(): Promise<number> {
        return contract.methods
          .deployERC20(denom, name, symbol, decimals)
          .estimateGas(transactionOptions)
      },
    }
  }
}
