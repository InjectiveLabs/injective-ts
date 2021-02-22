import { BaseCurrency as Injective } from '@injectivelabs/web3-contract-typings/types/BaseCurrency'
import {
  BigNumber,
  BigNumberInWei,
  getTransactionOptionsAsNonPayableTx,
} from '@injectivelabs/utils'
import { ContractException } from '@injectivelabs/exceptions'
import {
  AccountAddress,
  ChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import abi from './abi/injective'
import { ContractFunctionObj, ContractTxFunctionObj } from '../types'
import BaseContract from '../base'

export class InjectiveContract extends BaseContract<
  Injective,
  keyof Injective['events']
> {
  static contractName = 'Injective'

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

  getBalanceOf(address: AccountAddress): ContractFunctionObj<BigNumberInWei> {
    const { contract } = this

    return {
      async callAsync() {
        return new BigNumberInWei(
          await contract.methods.balanceOf(address).call(),
        )
      },

      getABIEncodedTransactionData(): string {
        return contract.methods.balanceOf(address).encodeABI()
      },
    }
  }

  getAllowanceOf(
    address: AccountAddress,
    contractAddress: string,
  ): ContractFunctionObj<BigNumberInWei> {
    const { contract } = this

    return {
      async callAsync() {
        return new BigNumberInWei(
          await contract.methods.allowance(address, contractAddress).call(),
        )
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
    amount: BigNumber
    transactionOptions: TransactionOptions
  }): ContractTxFunctionObj<BigNumberInWei> {
    const { contract } = this

    return {
      callAsync() {
        throw new ContractException(
          'You cannot call this contract method as a call',
        )
      },

      getABIEncodedTransactionData(): string {
        return contract.methods
          .approve(contractAddress, amount.toFixed())
          .encodeABI()
      },

      async sendTransactionAsync(): Promise<string> {
        const { transactionHash } = await contract.methods
          .approve(contractAddress, amount.toFixed())
          .send(getTransactionOptionsAsNonPayableTx(transactionOptions))

        return transactionHash
      },

      async estimateGasAsync(): Promise<number> {
        return contract.methods
          .approve(contractAddress, amount.toFixed())
          .estimateGas(transactionOptions)
      },
    }
  }
}
