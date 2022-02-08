import { Web3Exception } from '@injectivelabs/exceptions'
import { AlchemyApi } from '@injectivelabs/alchemy-api'
import { BigNumberInWei } from '@injectivelabs/utils'
import { contractAddresses } from '@injectivelabs/contracts'
import { BaseCurrencyContract } from '@injectivelabs/contracts/dist/contracts/BaseCurrency'
import { GAS_LIMIT_MULTIPLIER, ZERO_IN_BASE } from '../constants'
import { Token, TokenWithBalance } from './types'
import { TokenServiceOptions } from '../types'
import { getTransactionOptions } from '../utils'

export class TokenErc20Service {
  private options: TokenServiceOptions

  private alchemyApi: AlchemyApi

  constructor({
    options,
    alchemyRpcEndpoint,
  }: {
    options: TokenServiceOptions
    alchemyRpcEndpoint: string
  }) {
    this.options = options
    this.alchemyApi = new AlchemyApi(alchemyRpcEndpoint)
  }

  setTokenAllowance = async ({
    address,
    amount,
    gasPrice,
    tokenAddress,
  }: {
    address: string
    amount: string // BigNumberInWei
    gasPrice: string // BigNumberInWei
    tokenAddress: string
  }) => {
    const { options } = this
    const erc20Contract = new BaseCurrencyContract({
      web3Strategy: options.web3Strategy,
      address: tokenAddress,
      chainId: options.chainId,
    })
    const setAllowanceOfContractFunction = erc20Contract.setAllowanceOf({
      amount,
      contractAddress: contractAddresses[options.chainId].peggy,
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
      const txHash = await options.web3Strategy.sendTransaction(
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
        { address, chainId: options.chainId },
      )

      await options.web3Strategy.getTransactionReceipt(txHash)
    } catch (error: any) {
      throw new Web3Exception(error.message)
    }
  }

  async getTokenBalanceAndAllowance({
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
      const { options } = this
      const tokenBalances = await this.alchemyApi.fetchTokenBalances({
        address,
        contractAddresses: [token.address],
      })
      const tokenBalance = tokenBalances.tokenBalances
        .filter((tokenBalance) => tokenBalance.tokenBalance)
        .find(
          (tokenBalance) =>
            (
              tokenBalance as unknown as { contractAddress: string }
            ).contractAddress.toLowerCase() === token.address.toLowerCase(),
        )
      const balance = tokenBalance ? tokenBalance.tokenBalance || 0 : 0

      const allowance = await this.alchemyApi.fetchTokenAllowance({
        owner: address,
        spender: contractAddresses[options.chainId].peggy,
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
}
