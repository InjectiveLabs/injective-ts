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
import { AccountMetrics, PeggyServiceOptions } from '../types'
import { getTransactionOptions } from '../utils'
import { AddressTransformer } from '../address/transformer'
import { PeggyTransformer } from './transformer'
import { TxProvider } from '../providers/TxProvider'
import { MetricsProvider } from '../providers/MetricsProvider'

export class PeggyService {
  private options: PeggyServiceOptions

  private metricsProvider: MetricsProvider

  private txProvider: TxProvider

  constructor({ options }: { options: PeggyServiceOptions }) {
    this.options = options
    this.metricsProvider = new MetricsProvider(options.metrics)
    this.txProvider = new TxProvider({
      ...options,
      metricsProvider: this.metricsProvider,
    })
  }

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
    const { options } = this
    const contractAddress = PeggyTransformer.peggyDenomToContractAddress(
      denom,
      options.chainId,
    )
    const peggyContractAddress = contractAddresses[options.chainId].peggy
    const contract = new PeggyContract({
      address: peggyContractAddress,
      chainId: options.chainId,
      web3Strategy: options.web3Strategy,
    })
    const formattedDestinationAddress =
      AddressTransformer.getAddressFromInjectiveAddress(destinationAddress)

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
      const txHash = await options.web3Strategy.sendTransaction(
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
        { address, chainId: options.chainId },
      )

      await options.web3Strategy.getTransactionReceipt(txHash)

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
