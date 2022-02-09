import { Web3Exception } from '@injectivelabs/exceptions'
import { BigNumberInWei } from '@injectivelabs/utils'
import { PeggyContract } from '@injectivelabs/contracts/dist/contracts/Peggy'
import { contractAddresses } from '@injectivelabs/contracts/dist'
import { PeggyComposer } from '@injectivelabs/chain-consumer'
import {
  BIG_NUMBER_ROUND_DOWN_MODE,
  GAS_LIMIT_MULTIPLIER,
  ZERO_IN_BASE,
} from '../constants'
import { AccountMetrics } from '../types'
import { getTransactionOptions, getAddressFromInjectiveAddress } from '../utils'
import { PeggyTransformer } from './transformer'
import { BaseActionService } from '../BaseActionService'

export class PeggyActionService extends BaseActionService {
  async transfer({
    address,
    amount,
    denom,
    destinationAddress,
    gasPrice,
  }: {
    address: string
    amount: string // BigNumberInWei
    denom: string
    destinationAddress: string
    gasPrice: string // BigNumberInWei
  }) {
    const contractAddress = PeggyTransformer.peggyDenomToContractAddress(
      denom,
      this.options.chainId,
    )
    const peggyContractAddress = contractAddresses[this.options.chainId].peggy
    const contract = new PeggyContract({
      address: peggyContractAddress,
      chainId: this.options.chainId,
      web3Strategy: this.web3Strategy,
    })
    const formattedDestinationAddress =
      getAddressFromInjectiveAddress(destinationAddress)

    const depositForContractFunction = contract.sendToCosmos({
      amount,
      contractAddress,
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

  async withdraw({
    address,
    amount,
    denom,
    destinationAddress,
    bridgeFee,
    injectiveAddress,
  }: {
    address: string
    amount: string // BigNumberInWei
    denom: string
    destinationAddress: string
    bridgeFee: string // BigNumberInWei
    injectiveAddress: string
  }) {
    const { txProvider } = this
    const bridgeFeeToFixed = new BigNumberInWei(bridgeFee).toFixed(
      0,
      BIG_NUMBER_ROUND_DOWN_MODE,
    )
    const message = PeggyComposer.withdraw({
      denom,
      amount: new BigNumberInWei(amount)
        .minus(bridgeFeeToFixed)
        .toFixed(0, BIG_NUMBER_ROUND_DOWN_MODE),
      bridgeFeeAmount: bridgeFeeToFixed,
      bridgeFeeDenom: denom,
      address: destinationAddress,
      injectiveAddress,
    })

    try {
      const txHash = await txProvider.broadcast({
        bucket: AccountMetrics.Send,
        message,
        address,
      })

      return {
        amount,
        denom,
        txHash,
        bridgeFee: bridgeFeeToFixed,
        receiver: address,
        sender: injectiveAddress,
      }
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
