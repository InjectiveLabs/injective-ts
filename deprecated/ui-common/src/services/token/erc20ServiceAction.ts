import { Web3Exception } from '@injectivelabs/exceptions'
import { BigNumberInWei } from '@injectivelabs/utils'
import { BaseCurrencyContract } from '@injectivelabs/contracts/dist/contracts/BaseCurrency'
import { getContractAddressesForNetworkOrThrow } from '@injectivelabs/contracts'
import { GAS_LIMIT_MULTIPLIER, ZERO_IN_BASE } from '../../constants'
import { getTransactionOptions } from '../../utils'
import { BaseWeb3ActionService } from '../BaseWeb3ActionService'

export class TokenErc20ServiceAction extends BaseWeb3ActionService {
  /*
   * Amount should always be in x * 10^(denomDecimals) format
   * where x is a human readable number.
   * Use `denomAmountToChainDenomAmount` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted amount
   * */
  async setTokenAllowance({
    address,
    amount,
    gasPrice,
    tokenAddress,
  }: {
    address: string
    amount: string
    gasPrice: string
    tokenAddress: string
  }) {
    const erc20Contract = new BaseCurrencyContract({
      web3: this.web3Strategy.getWeb3(),
      address: tokenAddress,
      chainId: this.options.chainId,
    })
    const contractAddresses = getContractAddressesForNetworkOrThrow(
      this.options.network,
    )
    const setAllowanceOfContractFunction = erc20Contract.setAllowanceOf({
      amount,
      contractAddress: contractAddresses.peggy,
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
      const txHash = await this.web3Strategy.sendTransaction(
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

      await this.web3Strategy.getTransactionReceipt(txHash)
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
