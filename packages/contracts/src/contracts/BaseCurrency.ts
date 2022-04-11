import { ContractException } from '@injectivelabs/exceptions'
import {
  AccountAddress,
  ChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import Web3 from 'web3'
import abi from './abi/injective'
import { ContractFunctionObj, ContractTxFunctionObj } from '../types'
import { getTransactionOptionsAsNonPayableTx } from '../utils'
import BaseContract from '../BaseContract'

export class BaseCurrencyContract extends BaseContract<any> {
  static contractName = 'BaseCurrency'

  constructor({
    chainId,
    web3,
    address,
  }: {
    chainId: ChainId
    web3: Web3
    address: string
  }) {
    super({
      abi,
      chainId,
      address,
      web3,
    })
  }

  getBalanceOf(address: AccountAddress): ContractFunctionObj<string> {
    const { contract } = this

    return {
      async callAsync() {
        return contract.methods.balanceOf(address).call()
      },

      getABIEncodedTransactionData(): string {
        return contract.methods.balanceOf(address).encodeABI()
      },
    }
  }

  getAllowanceOf(
    address: AccountAddress,
    contractAddress: string,
  ): ContractFunctionObj<string> {
    const { contract } = this

    return {
      async callAsync() {
        return contract.methods.allowance(address, contractAddress).call()
      },

      getABIEncodedTransactionData(): string {
        return contract.methods.allowance(address, contractAddress).encodeABI()
      },
    }
  }

  setAllowanceOf({
    contractAddress,
    amount,
    transactionOptions,
  }: {
    contractAddress: string
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
        return contract.methods.approve(contractAddress, amount).encodeABI()
      },

      async sendTransactionAsync(): Promise<string> {
        const { transactionHash } = await contract.methods
          .approve(contractAddress, amount)
          .send(getTransactionOptionsAsNonPayableTx(transactionOptions))

        return transactionHash
      },

      async estimateGasAsync(): Promise<number> {
        return contract.methods
          .approve(contractAddress, amount)
          .estimateGas(transactionOptions)
      },
    }
  }

  getName(): ContractFunctionObj<string> {
    const { contract } = this

    return {
      async callAsync() {
        return contract.methods.name().call()
      },

      getABIEncodedTransactionData(): string {
        return contract.methods.name().encodeABI()
      },
    }
  }

  getDecimals(): ContractFunctionObj<string> {
    const { contract } = this

    return {
      async callAsync() {
        return contract.methods.decimals().call()
      },

      getABIEncodedTransactionData(): string {
        return contract.methods.decimals().encodeABI()
      },
    }
  }

  getSymbol(): ContractFunctionObj<string> {
    const { contract } = this

    return {
      async callAsync() {
        return contract.methods.symbol().call()
      },

      getABIEncodedTransactionData(): string {
        return contract.methods.symbol().encodeABI()
      },
    }
  }
}
