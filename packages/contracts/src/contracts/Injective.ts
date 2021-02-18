import { BaseCurrency as Injective } from '@injectivelabs/web3-contract-typings/types/BaseCurrency'
import {
  BigNumber,
  BigNumberInWei,
  getTransactionOptionsAsNonPayableTx,
} from '@injectivelabs/utils'
import { AbiItem } from 'web3-utils'
import { ContractException } from '@injectivelabs/exceptions'
import {
  AccountAddress,
  ChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import Web3 from 'web3'
import abi from './abi/injective'
import { ContractFunctionObj, ContractTxFunctionObj } from '../types'

export class InjectiveContract {
  static contractName = 'Injective'

  public readonly abi: AbiItem[]

  public readonly address: string

  private readonly contract: Injective

  private readonly chainId: ChainId

  private readonly web3: Web3

  private readonly web3Ws: Web3

  constructor({
    chainId,
    address,
    web3Strategy,
  }: {
    chainId: ChainId
    address: string
    web3Strategy: Web3Strategy
  }) {
    this.abi = abi
    this.chainId = chainId
    this.address = address
    this.web3 = web3Strategy.getWeb3ForChainId(this.chainId)
    this.web3Ws = web3Strategy.getWeb3WsForChainId(this.chainId)

    if (!this.web3 || !this.web3Ws) {
      throw new ContractException(
        `Web3Strategy was not initialized for ${this.chainId} chainId`,
      )
    }

    this.contract = (new this.web3.eth.Contract(
      abi,
      address,
    ) as unknown) as Injective
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
