import { EthereumChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { BigNumberInWei } from '@injectivelabs/utils'
import {
  Erc20Contract,
  PeggyContract,
  PeggyOldContract,
  getContractAddressesForNetworkOrThrow,
} from '@injectivelabs/contracts'
import { GAS_LIMIT_MULTIPLIER, INJ_DENOM, TIP_IN_GWEI } from '../../constants'
import { getTransactionOptions, peggyDenomToContractAddress } from './utils'
import { getKeyFromRpcUrl } from '../../utils/alchemy'

/**
 * Preparing and broadcasting
 * Ethereum transactions
 */
export class Web3Composer {
  private network: Network

  private ethereumChainId: EthereumChainId

  private rpc: string

  constructor({
    ethereumChainId,
    network,
    rpc,
  }: {
    rpc: string
    ethereumChainId: EthereumChainId
    network: Network
  }) {
    this.rpc = rpc
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
    const { ethereumChainId, network } = this
    const alchemy = await this.getAlchemy()
    const ethersProvider = await alchemy.config.getProvider()

    const erc20Contract = new Erc20Contract({
      ethereumChainId,
      provider: ethersProvider,
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
    const { network, ethereumChainId } = this
    const alchemy = await this.getAlchemy()
    const ethersProvider = await alchemy.config.getProvider()

    const contractAddresses = getContractAddressesForNetworkOrThrow(network)
    const contractAddress =
      denom === INJ_DENOM
        ? contractAddresses.injective
        : peggyDenomToContractAddress(denom)
    const peggyContractAddress = contractAddresses.peggy

    const contract = new PeggyOldContract({
      ethereumChainId,
      address: peggyContractAddress,
      provider: ethersProvider,
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
    const { network, ethereumChainId } = this
    const alchemy = await this.getAlchemy()
    const ethersProvider = await alchemy.config.getProvider()

    const contractAddresses = getContractAddressesForNetworkOrThrow(network)
    const contractAddress =
      denom === INJ_DENOM
        ? contractAddresses.injective
        : peggyDenomToContractAddress(denom)
    const peggyContractAddress = contractAddresses.peggy

    const contract = new PeggyContract({
      ethereumChainId,
      provider: ethersProvider,
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

  private async getAlchemy() {
    const { rpc, ethereumChainId } = this
    const { Alchemy, Network } = await import('alchemy-sdk')

    return new Alchemy({
      apiKey: getKeyFromRpcUrl(rpc),
      network:
        ethereumChainId === EthereumChainId.Mainnet
          ? Network.ETH_MAINNET
          : Network.ETH_GOERLI,
    })
  }
}
