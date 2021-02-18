import Web3 from 'web3'
import { DepositManager } from '@injectivelabs/web3-contract-typings/types/DepositManager'
import { AbiItem } from 'web3-utils'
import { ContractException } from '@injectivelabs/exceptions'
import {
  BigNumberInWei,
  getTransactionOptionsAsNonPayableTx,
} from '@injectivelabs/utils'
import {
  AccountAddress,
  ChainId,
  TransactionOptions,
} from '@injectivelabs/ts-types'
import { Web3Strategy } from '@injectivelabs/web3-strategy'
import abi from './abi/depositManager'
import { ContractTxFunctionObj } from '../types'

export class DepositManagerContract {
  static contractName = 'DepositManager'

  public readonly abi: AbiItem[]

  public readonly address: string

  private readonly contract: DepositManager

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
    ) as unknown) as DepositManager
  }

  public depositFor({
    address,
    amount,
    transactionOptions,
  }: {
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
          .depositFor(amount.toFixed(), address)
          .encodeABI()
      },

      async sendTransactionAsync(): Promise<string> {
        const { transactionHash } = await contract.methods
          .depositFor(amount.toFixed(), address)
          .send(getTransactionOptionsAsNonPayableTx(transactionOptions))

        return transactionHash
      },

      async estimateGasAsync(): Promise<number> {
        return contract.methods
          .depositFor(amount.toFixed(), address)
          .estimateGas(transactionOptions)
      },
    }
  }
}
