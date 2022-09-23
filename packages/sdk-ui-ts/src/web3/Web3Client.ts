import { EthereumChainId, TransactionOptions } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { BigNumberInWei } from '@injectivelabs/utils'
import {
  Erc20Contract,
  PeggyContract,
  PeggyOldContract,
  getContractAddressesForNetworkOrThrow,
} from '@injectivelabs/contracts'
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { SendTransactionOptions } from './types'
import {
  DEFAULT_GAS_PRICE,
  GAS_LIMIT_MULTIPLIER,
  INJ_DENOM,
  TX_DEFAULTS_GAS,
} from './constants'
import { Web3Exception } from '@injectivelabs/exceptions'

export const getTransactionOptions = (
  transactionOptions: Partial<TransactionOptions>,
): TransactionOptions => ({
  from: transactionOptions.from,
  gas: transactionOptions.gas ? transactionOptions.gas : TX_DEFAULTS_GAS,
  gasPrice: transactionOptions.gasPrice
    ? transactionOptions.gasPrice.toString()
    : DEFAULT_GAS_PRICE.toString(),
})

export const peggyDenomToContractAddress = (denom: string): string =>
  denom.toLowerCase().replace('peggy', '')

export class Web3Client {
  private walletStrategy: WalletStrategy

  private network: Network

  private ethereumChainId: EthereumChainId

  constructor({
    walletStrategy,
    ethereumChainId,
    network,
  }: {
    walletStrategy: WalletStrategy
    ethereumChainId: EthereumChainId
    network: Network
  }) {
    this.walletStrategy = walletStrategy
    this.ethereumChainId = ethereumChainId
    this.network = network
  }

  async sendTransaction(args: SendTransactionOptions) {
    const { walletStrategy, ethereumChainId } = this

    try {
      const txHash = await walletStrategy.sendEthereumTransaction(args.tx, {
        ethereumChainId,
        address: args.address,
      })

      await walletStrategy.getEthereumTransactionReceipt(txHash)

      return txHash
    } catch (e: unknown) {
      throw new Web3Exception(new Error((e as any).message))
    }
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
    const { walletStrategy, ethereumChainId, network } = this
    const web3 = walletStrategy.getWeb3() as any
    const erc20Contract = new Erc20Contract({
      ethereumChainId,
      web3: web3 as any,
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
        .toNumber()
        .toString(16),
      maxFeePerGas: new BigNumberInWei(gasPrice).toNumber().toString(16),
      maxPriorityFeePerGas: null,
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
    amount: string // BigNumberInWi
    denom: string
    destinationAddress: string
    gasPrice: string // BigNumberInWei
  }) {
    const { walletStrategy, network, ethereumChainId } = this
    const web3 = walletStrategy.getWeb3() as any
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
        .toNumber()
        .toString(16),
      maxFeePerGas: new BigNumberInWei(gasPrice).toNumber().toString(16),
      maxPriorityFeePerGas: null,
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
    const { walletStrategy, network, ethereumChainId } = this

    const web3 = walletStrategy.getWeb3() as any
    const contractAddresses = getContractAddressesForNetworkOrThrow(network)
    const contractAddress =
      denom === INJ_DENOM
        ? contractAddresses.injective
        : peggyDenomToContractAddress(denom)
    const peggyContractAddress = contractAddresses.peggy
    const contract = new PeggyContract({
      address: peggyContractAddress,
      ethereumChainId,
      web3: web3 as any,
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
        .toNumber()
        .toString(16),
      maxFeePerGas: new BigNumberInWei(gasPrice).toNumber().toString(16),
      maxPriorityFeePerGas: null,
      data: abiEncodedData,
    }
  }

  async fetchTokenBalanceAndAllowance({
    address,
    contractAddress,
  }: {
    address: string
    contractAddress: string
  }): Promise<{ balance: string; allowance: string }> {
    if (contractAddress.startsWith('ibc/')) {
      return {
        balance: new BigNumberInWei(0).toFixed(),
        allowance: new BigNumberInWei(0).toFixed(),
      }
    }

    try {
      const { walletStrategy, network } = this
      const web3 = walletStrategy.getWeb3() as any
      const tokenAddress = peggyDenomToContractAddress(contractAddress)
      const contractAddresses = getContractAddressesForNetworkOrThrow(network)
      const tokenContractAddress =
        tokenAddress === INJ_DENOM ? contractAddresses.injective : tokenAddress
      const tokenBalances = await web3.alchemy.getTokenBalances(address, [
        tokenContractAddress,
      ])

      const tokenBalance = tokenBalances.tokenBalances
        .filter((tokenBalance: any) => tokenBalance.tokenBalance)
        .find(
          (tokenBalance: any) =>
            (
              tokenBalance as unknown as { contractAddress: string }
            ).contractAddress.toLowerCase() ===
            tokenContractAddress.toLowerCase(),
        )
      const balance = tokenBalance ? tokenBalance.tokenBalance || 0 : 0

      const allowance = await web3.alchemy.getTokenAllowance({
        owner: address,
        spender: contractAddresses.peggy,
        contract: tokenContractAddress,
      })

      return {
        balance: new BigNumberInWei(balance || 0).toFixed(),
        allowance: new BigNumberInWei(allowance || 0).toFixed(),
      }
    } catch (e) {
      return {
        balance: new BigNumberInWei(0).toFixed(),
        allowance: new BigNumberInWei(0).toFixed(),
      }
    }
  }

  async fetchTokenMetaData(address: string) {
    const { walletStrategy } = this

    const web3 = walletStrategy.getWeb3() as any

    try {
      const tokenMeta = await web3.alchemy.getTokenMetadata(address)

      return tokenMeta
    } catch (e: unknown) {
      throw new Web3Exception(new Error((e as any).message))
    }
  }
}
