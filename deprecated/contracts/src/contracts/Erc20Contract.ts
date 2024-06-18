import {
  AccountAddress,
  EthereumChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import {
  GeneralException,
  UnspecifiedErrorCode,
  Web3Exception,
} from '@injectivelabs/exceptions'
import abi from './abi/injective'
import { Contract, ContractFunctionObj, ContractTxFunctionObj } from '../types'
import BaseContract from '../BaseContract'
import { ALLOWANCE_DEFAULT_GAS_LIMIT } from '../utils'

export class Erc20Contract extends BaseContract<any> {
  static contractName = 'Erc20'

  constructor({
    ethereumChainId,
    address,
    provider,
  }: {
    ethereumChainId: EthereumChainId
    address: string
    provider: any
  }) {
    super({
      abi: JSON.stringify(abi),
      ethereumChainId,
      address,
      provider,
    })
  }

  getBalanceOf(address: AccountAddress): ContractFunctionObj<string> {
    const { contract, ethersInterface } = this

    return {
      async callAsync() {
        return contract.methods.balanceOf(address)
      },

      getABIEncodedTransactionData(): string {
        return ethersInterface.encodeFunctionData('balanceOf', [address])
      },
    }
  }

  getAllowanceOf(
    address: AccountAddress,
    contractAddress: string,
  ): ContractFunctionObj<string> {
    const { contract, ethersInterface } = this

    return {
      async callAsync() {
        return contract.methods.allowance(address, contractAddress)
      },

      getABIEncodedTransactionData(): string {
        return ethersInterface.encodeFunctionData('allowance', [
          address,
          contractAddress,
        ])
      },
    }
  }

  setAllowanceOf({
    amount,
    contractAddress,
    transactionOptions,
  }: {
    amount: string
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
            contextModule: Contract.Erc20Contract,
          },
        )
      },

      getABIEncodedTransactionData(): string {
        return ethersInterface.encodeFunctionData('approve', [
          contractAddress,
          amount,
        ])
      },

      async sendTransactionAsync(): Promise<string> {
        throw new GeneralException(new Error('Not implemented'))
      },

      async estimateGasAsync(): Promise<number> {
        try {
          const response = await contract.estimateGas.approve(
            contractAddress,
            amount,
            {
              value: 0,
              from: transactionOptions.from,
            },
          )

          return parseInt(response.toString(), 10)
        } catch (e) {
          return ALLOWANCE_DEFAULT_GAS_LIMIT
        }
      },
    }
  }

  transfer({
    amount,
    recipient,
  }: {
    recipient: string
    amount: string
    transactionOptions: TransactionOptions
  }): ContractTxFunctionObj<string> {
    const { contract, ethersInterface } = this

    return {
      callAsync() {
        throw new Web3Exception(
          new Error('You cannot call this contract method as a call'),
          {
            code: UnspecifiedErrorCode,
            contextModule: Contract.Erc20Contract,
          },
        )
      },

      getABIEncodedTransactionData(): string {
        return ethersInterface.encodeFunctionData('transfer', [
          recipient,
          amount,
        ])
      },

      async sendTransactionAsync(): Promise<string> {
        throw new GeneralException(new Error('Not implemented'))
      },

      async estimateGasAsync(): Promise<number> {
        const response = await contract.estimateGas.transfer(recipient, amount)

        return parseInt(response.toString(), 10)
      },
    }
  }

  getName(): ContractFunctionObj<string> {
    const { contract, ethersInterface } = this

    return {
      async callAsync() {
        return contract.name()
      },

      getABIEncodedTransactionData(): string {
        return ethersInterface.encodeFunctionData('name', [])
      },
    }
  }

  getDecimals(): ContractFunctionObj<string> {
    const { contract, ethersInterface } = this

    return {
      async callAsync() {
        return contract.decimals()
      },

      getABIEncodedTransactionData(): string {
        return ethersInterface.encodeFunctionData('decimals', [])
      },
    }
  }

  getSymbol(): ContractFunctionObj<string> {
    const { contract, ethersInterface } = this

    return {
      async callAsync() {
        return contract.symbol()
      },

      getABIEncodedTransactionData(): string {
        return ethersInterface.encodeFunctionData('symbol', [])
      },
    }
  }
}
