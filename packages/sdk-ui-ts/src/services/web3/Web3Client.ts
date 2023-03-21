import { Network } from '@injectivelabs/networks'
import { BigNumberInWei } from '@injectivelabs/utils'
import { getContractAddressesForNetworkOrThrow } from '@injectivelabs/contracts'
import { Web3Exception } from '@injectivelabs/exceptions'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { peggyDenomToContractAddress } from './utils'
import { INJ_DENOM } from '../../constants'

/**
 * Preparing and broadcasting
 * Ethereum transactions
 */
export class Web3Client {
  private network: Network

  private web3: ReturnType<typeof createAlchemyWeb3>

  constructor({ rpc, network }: { rpc: string; network: Network }) {
    this.web3 = createAlchemyWeb3(rpc as string)
    this.network = network
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
            tokenBalance.contractAddress === tokenContractAddress,
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
    const { web3 } = this

    try {
      return await web3.alchemy.getTokenMetadata(address)
    } catch (e: unknown) {
      throw new Web3Exception(new Error((e as any).message))
    }
  }
}
