import {
  AccountAddress,
  EthereumChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import {
  Web3Exception,
  GeneralException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
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
    data = '',
    amount,
    address,
    contractAddress,
    transactionOptions,
  }: {
    data?: any
    amount: string
    address: AccountAddress
    contractAddress: string
    transactionOptions: TransactionOptions
  }): ContractTxFunctionObj<string> {
    const { contract, ethersInterface } = this

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
        return ethersInterface.encodeFunctionData('sendToInjective', [
          contractAddress,
          address,
          amount,
          data,
        ])
      },

      async sendTransactionAsync(): Promise<string> {
        throw new GeneralException(new Error('Not implemented'))
      },

      async estimateGasAsync(): Promise<number> {
        const response = await contract.estimateGas.sendToInjective(
          contractAddress,
          address,
          amount,
          data,
          {
            from: transactionOptions.from,
          },
        )

        return parseInt(response.toString(), 10)
      },
    }
  }

  deployERC20({
    name,
    denom,
    symbol,
    decimals = 18,
  }: {
    denom: string
    name: string
    symbol: string
    decimals?: number
    transactionOptions: TransactionOptions
  }): ContractTxFunctionObj<string> {
    const { contract, ethersInterface } = this

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
        return ethersInterface.encodeFunctionData('deployERC20', [
          denom,
          name,
          symbol,
          decimals,
        ])
      },

      async sendTransactionAsync(): Promise<string> {
        throw new GeneralException(new Error('Not implemented'))
      },

      async estimateGasAsync(): Promise<number> {
        const response = await contract.estimateGas.deployERC20(
          denom,
          name,
          symbol,
          decimals,
        )

        return parseInt(response.toString(), 10)
      },
    }
  }
}
