import { Web3Exception } from '@injectivelabs/exceptions'
import { BigNumberInWei } from '@injectivelabs/utils'
import { getContractAddressesForNetworkOrThrow } from '@injectivelabs/contracts'
import { PeggyContract } from '@injectivelabs/contracts/dist/contracts/Peggy'
import { GAS_LIMIT_MULTIPLIER, ZERO_IN_BASE } from '../../constants'
import {
  getTransactionOptions,
  getAddressFromInjectiveAddress,
} from '../../utils'
import { PeggyTransformer } from './transformer'
import { BaseWeb3ActionService } from '../BaseWeb3ActionService'

export class PeggyContractActionService extends BaseWeb3ActionService {
  /**
   * Amount should always be in x * 10^(denomDecimals) format
   * where x is a human readable number.
   * Use `denomAmountToChainDenomAmount` function from the
   * @injectivelabs/utils package to convert
   * a human readable number to a chain accepted amount
   * */
  async transfer({
    address,
    amount,
    denom,
    destinationAddress,
    gasPrice,
  }: {
    address: string
    amount: string // BigNumberInWi
    denom: string
    destinationAddress: string
    gasPrice: string // BigNumberInWei
  }) {
    const contractAddresses = getContractAddressesForNetworkOrThrow(
      this.options.network,
    )
    const contractAddress = PeggyTransformer.peggyDenomToContractAddress(
      denom,
      contractAddresses.injective,
    )
    const peggyContractAddress = contractAddresses.peggy
    const contract = new PeggyContract({
      address: peggyContractAddress,
      chainId: this.options.chainId,
      web3: this.web3Strategy.getWeb3(),
    })
    const formattedDestinationAddress =
      getAddressFromInjectiveAddress(destinationAddress)

    const depositForContractFunction = contract.sendToCosmos({
      contractAddress,
      amount: new BigNumberInWei(amount).toFixed(),
      address: `0x${'0'.repeat(24)}${formattedDestinationAddress.slice(2)}`,
      transactionOptions: getTransactionOptions({
        gasPrice: ZERO_IN_BASE.toFixed(),
        from: address,
      }),
    })

    const data = depositForContractFunction.getABIEncodedTransactionData()
    const gas = new BigNumberInWei(
      await depositForContractFunction.estimateGasAsync(),
    )

    try {
      const txHash = await this.web3Strategy.sendTransaction(
        {
          from: address,
          to: peggyContractAddress,
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

      return {
        amount,
        denom,
        txHash,
        receiver: destinationAddress,
        sender: address,
      }
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
