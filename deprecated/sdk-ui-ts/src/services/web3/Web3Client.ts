import { Network, isTestnetOrDevnet } from '@injectivelabs/networks'
import { BigNumberInWei } from '@injectivelabs/utils'
import { getContractAddressesForNetworkOrThrow } from '@injectivelabs/contracts'
import { Web3Exception } from '@injectivelabs/exceptions'
import { peggyDenomToContractAddress } from './utils'
import { INJ_DENOM } from '../../constants'
import { getKeyFromRpcUrl } from '../../utils/alchemy'
import { Alchemy, Network as AlchemyNetwork } from 'alchemy-sdk'

/**
 * Preparing and broadcasting
 * Ethereum transactions
 */
export class Web3Client {
  private network: Network

  private rpc: string

  private alchemy: Alchemy | undefined

  constructor({ rpc, network }: { rpc: string; network: Network }) {
    this.rpc = rpc
    this.network = network
  }

  async fetchTokenBalanceAndAllowance({
    address,
    contractAddress,
  }: {
    address: string
    contractAddress: string
  }): Promise<{ balance: string; allowance: string }> {
    const { network } = this

    if (
      !contractAddress.startsWith('peggy') &&
      !contractAddress.startsWith('0x') &&
      contractAddress !== INJ_DENOM
    ) {
      return {
        balance: new BigNumberInWei(0).toFixed(),
        allowance: new BigNumberInWei(0).toFixed(),
      }
    }

    try {
      const alchemy = await this.getAlchemy()
      const ethersProvider = await alchemy.config.getProvider()
      const tokenAddress = peggyDenomToContractAddress(contractAddress)
      const contractAddresses = getContractAddressesForNetworkOrThrow(network)
      const tokenContractAddress =
        tokenAddress === INJ_DENOM ? contractAddresses.injective : tokenAddress

      const tokenBalances = await alchemy.core.getTokenBalances(address, [
        tokenContractAddress,
      ])

      const tokenBalance = tokenBalances.tokenBalances
        .filter((tokenBalance: any) => tokenBalance.tokenBalance)
        .find(
          (tokenBalance: { contractAddress: string }) =>
            tokenBalance.contractAddress === tokenContractAddress,
        )

      const balance = tokenBalance ? tokenBalance.tokenBalance || 0 : 0
      const allowance = await ethersProvider.send('alchemy_getTokenAllowance', [
        {
          owner: address,
          spender: contractAddresses.peggy,
          contract: tokenContractAddress,
        },
      ])

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
    const alchemy = await this.getAlchemy()

    try {
      return await alchemy.core.getTokenMetadata(address)
    } catch (e: unknown) {
      throw new Web3Exception(new Error((e as any).message))
    }
  }

  private async getAlchemy() {
    if (this.alchemy) {
      return this.alchemy
    }

    const { rpc, network } = this

    this.alchemy = new Alchemy({
      apiKey: getKeyFromRpcUrl(rpc),
      network: !isTestnetOrDevnet(network)
        ? AlchemyNetwork.ETH_MAINNET
        : AlchemyNetwork.ETH_SEPOLIA,
    })

    return this.alchemy
  }
}
