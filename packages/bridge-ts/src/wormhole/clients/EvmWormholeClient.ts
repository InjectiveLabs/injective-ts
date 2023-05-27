import { Network } from '@injectivelabs/networks'
import { getGrpcTransport } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  cosmos,
  ChainId,
  approveEth,
  redeemOnEth,
  transferFromEth,
  hexToUint8Array,
  uint8ArrayToHex,
  getEmitterAddressEth,
  getSignedVAAWithRetry,
  transferFromEthNative,
  parseSequenceFromLogEth,
  getIsTransferCompletedEth,
  ethers_contracts as EthersContracts,
} from '@certusone/wormhole-sdk'
import { BigNumber, sleep } from '@injectivelabs/utils'
import { ethers } from 'ethers'
import { zeroPad } from 'ethers/lib/utils'
import { WORMHOLE_CHAINS } from '../constants'
import { WormholeSource, WormholeClient, TransferMsgArgs } from '../types'
import { getContractAddresses, getEvmNativeAddress } from '../utils'
import { BaseWormholeClient } from '../WormholeClient'

type Provider = () =>
  | Promise<ethers.providers.Web3Provider>
  | ethers.providers.Web3Provider

export class EvmWormholeClient
  extends BaseWormholeClient
  implements
    WormholeClient<
      ethers.ContractReceipt & { txHash: string },
      ethers.providers.TransactionReceipt
    >
{
  public wormholeSource: WormholeSource = WormholeSource.Ethereum

  public provider: Provider

  constructor({
    network,
    wormholeRpcUrl,
    wormholeSource,
    provider,
  }: {
    network: Network
    wormholeSource: WormholeSource
    wormholeRpcUrl?: string
    provider: Provider
  }) {
    super({ network, wormholeRpcUrl })
    this.wormholeSource = wormholeSource
    this.provider = provider
  }

  get wormholeChainId(): ChainId {
    const { wormholeSource } = this

    switch (wormholeSource) {
      case WormholeSource.Ethereum:
        return WORMHOLE_CHAINS.ethereum
      case WormholeSource.Arbitrum:
        return WORMHOLE_CHAINS.arbitrum
      case WormholeSource.Polygon:
        return WORMHOLE_CHAINS.polygon
      default:
        return WORMHOLE_CHAINS.arbitrum
    }
  }

  get evmChainId(): number {
    const { wormholeSource } = this

    switch (wormholeSource) {
      case WormholeSource.Ethereum:
        return 1
      case WormholeSource.Arbitrum:
        return 42161
      case WormholeSource.Polygon:
        return 137
      default:
        return 1
    }
  }

  async getBalance(address: string, tokenAddress?: string) {
    const signer = await this.getProviderAndChainIdCheck()

    try {
      if (!tokenAddress) {
        const balance = await signer.provider.getBalance(address)

        return balance.toNumber().toString()
      }

      const tokenContract = EthersContracts.ERC20__factory.connect(
        tokenAddress,
        signer,
      )

      return (await tokenContract.balanceOf(address)).toString()
    } catch (e) {
      return '0'
    }
  }

  async transfer(args: TransferMsgArgs) {
    return args.tokenAddress
      ? this.transferToken(args)
      : this.transferNative(args)
  }

  async getTxResponse(txHash: string) {
    const signer = await this.getProviderAndChainIdCheck()
    const txResponse = await signer.provider.getTransactionReceipt(txHash)

    if (!txResponse) {
      throw new Error('An error occurred while fetching the transaction info')
    }

    return {
      ...txResponse,
      txHash: txResponse.transactionHash,
    } as ethers.ContractReceipt & { txHash: string }
  }

  async getSignedVAA(txResponse: ethers.ContractReceipt) {
    const { network, wormholeSource, wormholeRpcUrl, wormholeChainId } = this

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const sequence = parseSequenceFromLogEth(
      txResponse,
      associatedChainContractAddresses.core,
    )
    const emitterAddress = await getEmitterAddressEth(
      associatedChainContractAddresses.token_bridge,
    )

    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      [wormholeRpcUrl],
      wormholeChainId,
      emitterAddress,
      sequence,
      {
        transport: getGrpcTransport(),
      },
    )

    return Buffer.from(signedVAA).toString('base64')
  }

  async getIsTransferCompleted(signedVAA: string /* in base 64 */) {
    const { network, wormholeSource } = this

    const signer = await this.getProviderAndChainIdCheck()
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    return getIsTransferCompletedEth(
      associatedChainContractAddresses.token_bridge,
      signer,
      Buffer.from(signedVAA, 'base64'),
    )
  }

  async getIsTransferCompletedRetry(signedVAA: string /* in base 64 */) {
    const RETRIES = 2
    const TIMEOUT_BETWEEN_RETRIES = 2000

    for (let i = 0; i < RETRIES; i += 1) {
      if (await this.getIsTransferCompleted(signedVAA)) {
        return true
      }

      await sleep(TIMEOUT_BETWEEN_RETRIES)
    }

    return false
  }

  async redeem(
    signedVAA: string /* in base 64 */,
  ): Promise<ethers.ContractReceipt> {
    const { network, wormholeSource } = this

    const signer = await this.getProviderAndChainIdCheck()
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    return redeemOnEth(
      associatedChainContractAddresses.token_bridge,
      signer,
      Buffer.from(signedVAA, 'base64'),
    )
  }

  async getTokenAllowance({
    address,
    tokenAddress,
  }: {
    address: string
    tokenAddress: string
  }) {
    const { network, wormholeSource } = this

    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const signer = await this.getProviderAndChainIdCheck()
    const tokenContract = EthersContracts.ERC20__factory.connect(
      tokenAddress,
      signer,
    )

    return (
      await tokenContract.allowance(
        address,
        associatedChainContractAddresses.token_bridge,
      )
    ).toString()
  }

  private async getProviderAndChainIdCheck() {
    const { provider } = this

    if (!provider) {
      throw new GeneralException(new Error(`Please provide provider`))
    }

    const actualProvider =
      provider instanceof Function ? await provider() : provider
    const signer = actualProvider.getSigner()
    const chainId = await signer.getChainId()

    if (chainId !== this.evmChainId) {
      throw new GeneralException(
        new Error(`Please switch to the ${this.evmChainId} Network`),
      )
    }

    return signer
  }

  private async transferToken(args: TransferMsgArgs) {
    const { network, wormholeRpcUrl, wormholeSource } = this
    const { amount, recipient, tokenAddress } = args

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!recipient) {
      throw new GeneralException(new Error(`Please provide recipient`))
    }

    const signer = await this.getProviderAndChainIdCheck()
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const allowance = await this.getTokenAllowance({
      address: await signer.getAddress(),
      tokenAddress,
    })

    if (new BigNumber(allowance).lt(amount)) {
      await approveEth(
        associatedChainContractAddresses.token_bridge,
        tokenAddress,
        signer,
        new BigNumber(2).pow(256).minus(1).toFixed(),
      )
    }

    const transferReceipt = await transferFromEth(
      associatedChainContractAddresses.token_bridge,
      signer,
      tokenAddress,
      amount,
      WORMHOLE_CHAINS.injective,
      hexToUint8Array(
        uint8ArrayToHex(zeroPad(cosmos.canonicalAddress(recipient), 32)),
      ),
    )

    if (!transferReceipt) {
      throw new Error('An error occurred while fetching the transaction info')
    }

    return {
      txHash: transferReceipt.transactionHash,
      ...transferReceipt,
    } as ethers.ContractReceipt & {
      txHash: string
    }
  }

  private async transferNative(args: TransferMsgArgs) {
    const { network, wormholeRpcUrl, wormholeSource } = this
    const { amount, recipient } = args

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!recipient) {
      throw new GeneralException(new Error(`Please provide recipient`))
    }

    const signer = await this.getProviderAndChainIdCheck()

    const nativeTokenAddress = getEvmNativeAddress(network, wormholeSource)
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const allowance = await this.getTokenAllowance({
      address: await signer.getAddress(),
      tokenAddress: nativeTokenAddress,
    })

    if (new BigNumber(allowance).lt(amount)) {
      await approveEth(
        associatedChainContractAddresses.token_bridge,
        nativeTokenAddress,
        signer,
        new BigNumber(2).pow(256).minus(1).toFixed(),
      )
    }

    const transferReceipt = await transferFromEthNative(
      associatedChainContractAddresses.token_bridge,
      signer,
      amount,
      WORMHOLE_CHAINS.injective,
      hexToUint8Array(
        uint8ArrayToHex(zeroPad(cosmos.canonicalAddress(recipient), 32)),
      ),
    )

    if (!transferReceipt) {
      throw new Error('An error occurred while fetching the transaction info')
    }

    return {
      txHash: transferReceipt.transactionHash,
      ...transferReceipt,
    } as ethers.ContractReceipt & {
      txHash: string
    }
  }
}
