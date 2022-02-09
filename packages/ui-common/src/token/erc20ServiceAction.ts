import { Web3Exception } from '@injectivelabs/exceptions'
import { BigNumberInWei } from '@injectivelabs/utils'
import { contractAddresses } from '@injectivelabs/contracts'
import { BaseCurrencyContract } from '@injectivelabs/contracts/dist/contracts/BaseCurrency'
import { GAS_LIMIT_MULTIPLIER, ZERO_IN_BASE } from '../constants'
import { getTransactionOptions } from '../utils'
import { ServiceActionOptions } from '../types'

export class TokenErc20ServiceAction {
  private options: ServiceActionOptions

  constructor({ options }: { options: ServiceActionOptions }) {
    this.options = options
  }

  async setTokenAllowance({
    address,
    amount,
    gasPrice,
    tokenAddress,
  }: {
    address: string
    amount: string // BigNumberInWei
    gasPrice: string // BigNumberInWei
    tokenAddress: string
  }) {
    const erc20Contract = new BaseCurrencyContract({
      web3Strategy: this.options.web3Strategy,
      address: tokenAddress,
      chainId: this.options.chainId,
    })
    const setAllowanceOfContractFunction = erc20Contract.setAllowanceOf({
      amount,
      contractAddress: contractAddresses[this.options.chainId].peggy,
      transactionOptions: getTransactionOptions({
        gasPrice: ZERO_IN_BASE.toFixed(),
        from: address,
      }),
    })

    const data = setAllowanceOfContractFunction.getABIEncodedTransactionData()
    const gas = new BigNumberInWei(
      await setAllowanceOfContractFunction.estimateGasAsync(),
    )

    try {
      const txHash = await this.options.web3Strategy.sendTransaction(
        {
          from: address,
          to: tokenAddress,
          gas: new BigNumberInWei(gas.times(GAS_LIMIT_MULTIPLIER).toFixed(0))
            .toNumber()
            .toString(16),
          maxFeePerGas: new BigNumberInWei(gasPrice).toNumber().toString(16),
          maxPriorityFeePerGas: null,
          data,
        },
        { address, chainId: this.options.chainId },
      )

      await this.options.web3Strategy.getTransactionReceipt(txHash)
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
