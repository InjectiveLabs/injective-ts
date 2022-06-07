import { EthereumChainId, TransactionOptions } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { BigNumberInWei } from '@injectivelabs/utils'
import {
  Erc20Contract,
  PeggyContract,
  getContractAddressesForNetworkOrThrow,
} from '@injectivelabs/contracts'
import { WalletStrategy } from '../wallet-strategy'
import { SendTransactionOptions } from './types'
import {
  DEFAULT_GAS_PRICE,
  GAS_LIMIT_MULTIPLIER,
  INJ_DENOM,
  TX_DEFAULTS_GAS,
} from './constants'

export const getTransactionOptions = (
  transactionOptions: Partial<TransactionOptions>,
): TransactionOptions => ({
  from: transactionOptions.from,
  gas: transactionOptions.gas ? transactionOptions.gas : TX_DEFAULTS_GAS,
  gasPrice: transactionOptions.gasPrice
    ? transactionOptions.gasPrice.toString()
    : DEFAULT_GAS_PRICE.toString(),
})

export const peggyDenomToContractAddress = (
  denom: string,
  injectiveContractAddress: string,
): string => {
  const denomLowerCased = denom.toLowerCase()
  const contractAddress = denomLowerCased.replace('peggy', '')

  return denomLowerCased === INJ_DENOM
    ? injectiveContractAddress
    : contractAddress
}

export class Web3Client {
  private walletStrategy: WalletStrategy

  constructor(walletStrategy: WalletStrategy) {
    this.walletStrategy = walletStrategy
  }

  async sendTransaction(args: SendTransactionOptions) {
    const { walletStrategy } = this

    const txHash = await walletStrategy.sendEthereumTransaction(args.tx, {
      address: args.address,
      ethereumChainId: args.ethereumChainId,
    })

    await walletStrategy.getEthereumTransactionReceipt(txHash)

    return txHash
  }

  async getSetTokenAllowanceTx({
    address,
    amount,
    network,
    ethereumChainId,
    gasPrice,
    tokenAddress,
  }: {
    address: string
    network: Network
    ethereumChainId: EthereumChainId
    amount: string
    gasPrice: string
    tokenAddress: string
  }) {
    const { walletStrategy } = this
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

  async getPeggyTransferTx({
    address,
    amount,
    network,
    ethereumChainId,
    denom,
    destinationAddress,
    gasPrice,
  }: {
    network: Network
    ethereumChainId: EthereumChainId
    address: string
    amount: string // BigNumberInWi
    denom: string
    destinationAddress: string
    gasPrice: string // BigNumberInWei
  }) {
    const { walletStrategy } = this
    const web3 = walletStrategy.getWeb3() as any
    const contractAddresses = getContractAddressesForNetworkOrThrow(network)
    const contractAddress = peggyDenomToContractAddress(
      denom,
      contractAddresses.injective,
    )
    const peggyContractAddress = contractAddresses.peggy
    const contract = new PeggyContract({
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

  async fetchTokenBalanceAndAllowance({
    address,
    contractAddress,
    network,
  }: {
    address: string
    contractAddress: string
    network: Network
  }): Promise<{ balance: string; allowance: string }> {
    if (contractAddress.startsWith('ibc/')) {
      return {
        balance: new BigNumberInWei(0).toFixed(),
        allowance: new BigNumberInWei(0).toFixed(),
      }
    }

    try {
      const { walletStrategy } = this
      const web3 = walletStrategy.getWeb3() as any
      const tokenBalances = await web3.alchemy.getTokenBalances(address, [
        contractAddress,
      ])
      const tokenBalance = tokenBalances.tokenBalances
        .filter((tokenBalance: any) => tokenBalance.tokenBalance)
        .find(
          (tokenBalance: any) =>
            (
              tokenBalance as unknown as { contractAddress: string }
            ).contractAddress.toLowerCase() === contractAddress.toLowerCase(),
        )
      const balance = tokenBalance ? tokenBalance.tokenBalance || 0 : 0

      const contractAddresses = getContractAddressesForNetworkOrThrow(network)
      const allowance = await web3.alchemy.getTokenAllowance({
        owner: address,
        spender: contractAddresses.peggy,
        contract: contractAddress,
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
}
