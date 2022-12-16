import { EthereumChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { BigNumberInWei } from '@injectivelabs/utils'
import {
  Erc20Contract,
  PeggyContract,
  PeggyOldContract,
  getContractAddressesForNetworkOrThrow,
} from '@injectivelabs/contracts'
import { GeneralException } from '@injectivelabs/exceptions'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import Web3 from 'web3'
import {
  GAS_LIMIT_MULTIPLIER,
  INJ_DENOM,
  TIP_IN_GWEI,
} from '../utils/constants'
import { getTransactionOptions, peggyDenomToContractAddress } from './utils'

/**
 * Preparing and broadcasting
 * Ethereum transactions
 */
export class Web3Composer {
  private network: Network

  private ethereumChainId: EthereumChainId

  private web3: Web3

  constructor({
    ethereumChainId,
    network,
    rpc,
    web3,
  }: {
    rpc?: string
    web3?: Web3
    ethereumChainId: EthereumChainId
    network: Network
  }) {
    if (!web3 && !rpc) {
      throw new GeneralException(
        new Error(
          'Please provide either a web3 instance of a Ethereum rpc url',
        ),
      )
    }

    this.web3 = web3 || createAlchemyWeb3(rpc as string)
    this.ethereumChainId = ethereumChainId
    this.network = network
  }

  async getSetTokenAllowanceTx({
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
    const { ethereumChainId, network, web3 } = this

    const erc20Contract = new Erc20Contract({
      web3,
      ethereumChainId,
      address: tokenAddress,
    })

    const contractAddresses = getContractAddressesForNetworkOrThrow(network)
    const setAllowanceOfContractFunction = erc20Contract.setAllowanceOf({
      amount,
      contractAddress: contractAddresses.peggy,
      transactionOptions: getTransactionOptions({
        gasPrice: '0',
        from: address,
      }),
    })

    const data = setAllowanceOfContractFunction.getABIEncodedTransactionData()
    const gas = new BigNumberInWei(
      await setAllowanceOfContractFunction.estimateGasAsync(),
    )

    return {
      from: address,
      to: tokenAddress,
      gas: new BigNumberInWei(gas.times(GAS_LIMIT_MULTIPLIER).toFixed(0))
        .decimalPlaces(0)
        .toNumber()
        .toString(16),
      maxFeePerGas: new BigNumberInWei(gasPrice)
        .decimalPlaces(0)
        .toNumber()
        .toString(16),
      maxPriorityFeePerGas: TIP_IN_GWEI.toString(16),
      data,
    }
  }

  async getPeggyTransferTxOld({
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
    const { web3, network, ethereumChainId } = this

    const contractAddresses = getContractAddressesForNetworkOrThrow(network)
    const contractAddress =
      denom === INJ_DENOM
        ? contractAddresses.injective
        : peggyDenomToContractAddress(denom)
    const peggyContractAddress = contractAddresses.peggy

    const contract = new PeggyOldContract({
      address: peggyContractAddress,
      ethereumChainId,
      web3: web3 as any,
    })

    const depositForContractFunction = contract.sendToCosmos({
      contractAddress,
      amount: new BigNumberInWei(amount).toFixed(),
      address: `0x${'0'.repeat(24)}${destinationAddress.slice(2)}`,
      transactionOptions: getTransactionOptions({
        gasPrice: '0',
        from: address,
      }),
    })

    const data = depositForContractFunction.getABIEncodedTransactionData()
    const gas = new BigNumberInWei(
      await depositForContractFunction.estimateGasAsync(),
    )

    return {
      from: address,
      to: peggyContractAddress,
      gas: new BigNumberInWei(gas.times(GAS_LIMIT_MULTIPLIER).toFixed(0))
        .decimalPlaces(0)
        .toNumber()
        .toString(16),
      maxFeePerGas: new BigNumberInWei(gasPrice)
        .decimalPlaces(0)
        .toNumber()
        .toString(16),
      maxPriorityFeePerGas: TIP_IN_GWEI.toString(16),
      data,
    }
  }

  async getPeggyTransferTx({
    address,
    amount,
    denom,
    destinationAddress,
    gasPrice,
    data = '',
  }: {
    address: string
    amount: string // BigNumberInWi
    denom: string
    destinationAddress: string
    gasPrice: string // BigNumberInWei,
    data?: string
  }) {
    const { network, web3, ethereumChainId } = this

    const contractAddresses = getContractAddressesForNetworkOrThrow(network)
    const contractAddress =
      denom === INJ_DENOM
        ? contractAddresses.injective
        : peggyDenomToContractAddress(denom)
    const peggyContractAddress = contractAddresses.peggy

    const contract = new PeggyContract({
      web3,
      ethereumChainId,
      address: peggyContractAddress,
    })

    const depositForContractFunction = contract.sendToInjective({
      contractAddress,
      data,
      amount: new BigNumberInWei(amount).toFixed(),
      address: `0x${'0'.repeat(24)}${destinationAddress.slice(2)}`,
      transactionOptions: getTransactionOptions({
        gasPrice: '0',
        from: address,
      }),
    })

    const abiEncodedData =
      depositForContractFunction.getABIEncodedTransactionData()
    const gas = new BigNumberInWei(
      await depositForContractFunction.estimateGasAsync(),
    )

    return {
      from: address,
      to: peggyContractAddress,
      gas: new BigNumberInWei(gas.times(GAS_LIMIT_MULTIPLIER).toFixed(0))
        .decimalPlaces(0)
        .toNumber()
        .toString(16),
      maxFeePerGas: new BigNumberInWei(gasPrice)
        .decimalPlaces(0)
        .toNumber()
        .toString(16),
      maxPriorityFeePerGas: TIP_IN_GWEI.toString(16),
      data: abiEncodedData,
    }
  }
}
