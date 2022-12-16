import { EthereumChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { BigNumberInWei } from '@injectivelabs/utils'
import { getContractAddressesForNetworkOrThrow } from '@injectivelabs/contracts'
import { Web3Exception } from '@injectivelabs/exceptions'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { WalletStrategy } from '../strategies/wallet'
import { INJ_DENOM } from '../utils/constants'
import { SendTransactionOptions } from './types'
import { peggyDenomToContractAddress } from './utils'

/**
 * Preparing and broadcasting
 * Ethereum transactions
 */
export class Web3Client {
  private walletStrategy: WalletStrategy

  private network: Network

  private ethereumChainId: EthereumChainId

  private web3: ReturnType<typeof createAlchemyWeb3>

  constructor({
    walletStrategy,
    ethereumChainId,
    network,
  }: {
    walletStrategy: WalletStrategy
    ethereumChainId: EthereumChainId
    network: Network
  }) {
    this.web3 = walletStrategy.getWeb3() as ReturnType<typeof createAlchemyWeb3>
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

  async fetchTokenBalanceAndAllowance({
    address,
    contractAddress,
  }: {
    address: string
    contractAddress: string
  }): Promise<{ balance: string; allowance: string }> {
    const { web3, network } = this

    if (
      !contractAddress.startsWith('peggy') ||
      !contractAddress.startsWith('0x')
    ) {
      return {
        balance: new BigNumberInWei(0).toFixed(),
        allowance: new BigNumberInWei(0).toFixed(),
      }
    }

    try {
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
          (tokenBalance: { contractAddress: string }) =>
            tokenBalance.contractAddress.toLowerCase() ===
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
      return await web3.alchemy.getTokenMetadata(address)
    } catch (e: unknown) {
      throw new Web3Exception(new Error((e as any).message))
    }
  }
}
