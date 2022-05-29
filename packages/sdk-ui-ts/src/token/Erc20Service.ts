import { createAlchemyWeb3, AlchemyWeb3 } from '@alch/alchemy-web3'
import { BigNumberInWei, DEFAULT_GAS_PRICE } from '@injectivelabs/utils'
import { Token } from '@injectivelabs/sdk-ts'
import { TokenWithBalance } from '../types/token'
import { getContractAddressesForNetworkOrThrow } from '@injectivelabs/contracts'
import { Network } from '@injectivelabs/networks'
import { TokenMeta } from '@injectivelabs/token-metadata'
import { Web3Exception } from '@injectivelabs/exceptions'
import { BaseCurrencyContract } from '@injectivelabs/contracts/dist/contracts/BaseCurrency'
import {
  GAS_LIMIT_MULTIPLIER,
  TX_DEFAULTS_GAS,
  ZERO_IN_BASE,
} from '../constants'
import { ChainId, TransactionOptions } from '@injectivelabs/ts-types'
import type { Web3Strategy } from '@injectivelabs/web3-strategy'

export const getTransactionOptions = (
  transactionOptions: Partial<TransactionOptions>,
): TransactionOptions => ({
  from: transactionOptions.from,
  gas: transactionOptions.gas ? transactionOptions.gas : TX_DEFAULTS_GAS,
  gasPrice: transactionOptions.gasPrice
    ? transactionOptions.gasPrice.toString()
    : DEFAULT_GAS_PRICE.toString(),
})

export class Erc20Service {
  private web3: AlchemyWeb3

  private network: Network

  private chainId: ChainId

  constructor({
    network,
    alchemyRpcEndpoint,
    chainId,
  }: {
    network: Network
    alchemyRpcEndpoint: string
    chainId: ChainId
  }) {
    this.chainId = chainId
    this.network = network
    this.web3 = createAlchemyWeb3(alchemyRpcEndpoint)
  }

  async fetchTokenBalanceAndAllowance({
    address,
    token,
  }: {
    address: string
    token: Token
  }): Promise<TokenWithBalance> {
    if (token.denom.startsWith('ibc/')) {
      return {
        ...token,
        balance: new BigNumberInWei(0).toFixed(),
        allowance: new BigNumberInWei(0).toFixed(),
      }
    }

    try {
      const tokenBalances = await this.web3.alchemy.getTokenBalances(address, [
        token.address,
      ])
      const tokenBalance = tokenBalances.tokenBalances
        .filter((tokenBalance) => tokenBalance.tokenBalance)
        .find(
          (tokenBalance) =>
            (
              tokenBalance as unknown as { contractAddress: string }
            ).contractAddress.toLowerCase() === token.address.toLowerCase(),
        )
      const balance = tokenBalance ? tokenBalance.tokenBalance || 0 : 0

      const contractAddresses = getContractAddressesForNetworkOrThrow(
        this.network,
      )
      const allowance = await this.web3.alchemy.getTokenAllowance({
        owner: address,
        spender: contractAddresses.peggy,
        contract: token.address,
      })

      return {
        ...token,
        balance: new BigNumberInWei(balance || 0).toFixed(),
        allowance: new BigNumberInWei(allowance || 0).toFixed(),
      }
    } catch (e) {
      return {
        ...token,
        balance: new BigNumberInWei(0).toFixed(),
        allowance: new BigNumberInWei(0).toFixed(),
      }
    }
  }

  async fetchTokenMeta(denom: string): Promise<TokenMeta> {
    const address = denom.startsWith('peggy')
      ? denom.replace('peggy', '')
      : denom

    try {
      const tokenMeta = await this.web3.alchemy.getTokenMetadata(address)

      if (!tokenMeta) {
        throw new Error(`Token for ${denom} not found`)
      }

      return {
        address,
        name: tokenMeta.name as string,
        logo: tokenMeta.logo as string,
        symbol: tokenMeta.symbol as string,
        decimals: tokenMeta.decimals as number,
        coinGeckoId: '',
      }
    } catch (e) {
      throw new Error(`Token ${denom} not found`)
    }
  }

  async setTokenAllowance({
    address,
    amount,
    web3Strategy,
    gasPrice,
    tokenAddress,
  }: {
    address: string
    web3Strategy: Web3Strategy
    amount: string
    gasPrice: string
    tokenAddress: string
  }) {
    const { chainId, network } = this
    const erc20Contract = new BaseCurrencyContract({
      web3: web3Strategy.getWeb3(),
      address: tokenAddress,
      chainId: chainId,
    })
    const contractAddresses = getContractAddressesForNetworkOrThrow(network)
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
      const txHash = await web3Strategy.sendTransaction(
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
        { address, chainId: chainId },
      )

      await web3Strategy.getTransactionReceipt(txHash)
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }
}
