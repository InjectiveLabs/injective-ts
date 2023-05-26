import { Network } from '@injectivelabs/networks'
import { getGrpcTransport } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  cosmos,
  approveEth,
  redeemOnEth,
  transferFromEth,
  hexToUint8Array,
  uint8ArrayToHex,
  getEmitterAddressEth,
  getSignedVAAWithRetry,
  parseSequenceFromLogEth,
  getIsTransferCompletedEth,
  ethers_contracts as EthersContracts,
  ChainId,
  transferFromEthNative,
} from '@certusone/wormhole-sdk'
import { BigNumber, sleep } from '@injectivelabs/utils'
import { ethers } from 'ethers'
import { zeroPad } from 'ethers/lib/utils'
import { WORMHOLE_CHAINS } from '../constants'
import {
  WormholeSource,
  EvmTransferMsgArgs,
  EvmNativeTransferMsgArgs,
} from '../types'
import { getContractAddresses, getEvmNativeAddress } from '../utils'
import { WormholeClient } from '../WormholeClient'

type Provider = ethers.providers.Web3Provider | undefined

export class EvmWormholeClient extends WormholeClient {
  public wormholeSource: WormholeSource = WormholeSource.Ethereum

  constructor({
    network,
    wormholeRpcUrl,
    wormholeSource,
  }: {
    network: Network
    wormholeSource: WormholeSource
    wormholeRpcUrl?: string
  }) {
    super({ network, wormholeRpcUrl })

    this.wormholeSource = wormholeSource
  }

  get wormholeChainId(): ChainId {
    const { wormholeSource } = this

    switch (wormholeSource) {
      case WormholeSource.Ethereum:
        return WORMHOLE_CHAINS.ethereum
      case WormholeSource.Aribtrum:
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
      case WormholeSource.Aribtrum:
        return 42161
      case WormholeSource.Polygon:
        return 137
      default:
        return 1
    }
  }

  async getEvmTokenBalanceNoThrow({
    address,
    tokenAddress,
    provider,
  }: {
    address: string
    tokenAddress: string
    provider: Provider
  }) {
    if (!provider) {
      throw new GeneralException(new Error(`Please provide provider`))
    }

    const signer = await this.getProviderAndChainIdCheck(provider)
    const tokenContract = EthersContracts.ERC20__factory.connect(
      tokenAddress,
      signer,
    )

    try {
      return (await tokenContract.balanceOf(address)).toString()
    } catch (e) {
      return '0'
    }
  }

  async getEvmTokenAllowance({
    address,
    tokenAddress,
    provider,
  }: {
    address: string
    tokenAddress: string
    provider: Provider
  }) {
    const { network, wormholeSource } = this

    if (!provider) {
      throw new GeneralException(new Error(`Please provide provider`))
    }

    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const signer = await this.getProviderAndChainIdCheck(provider)
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

  async transferToInjective(args: EvmTransferMsgArgs & { provider: Provider }) {
    const { network, wormholeRpcUrl, wormholeSource } = this
    const { amount, recipient, provider, tokenAddress } = args

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!recipient) {
      throw new GeneralException(new Error(`Please provide recipient`))
    }

    const signer = await this.getProviderAndChainIdCheck(provider)
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const allowance = await this.getEvmTokenAllowance({
      address: await signer.getAddress(),
      tokenAddress,
      provider,
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

  async transferNativeToInjective(
    args: EvmNativeTransferMsgArgs & { provider: Provider },
  ) {
    const { network, wormholeRpcUrl, wormholeSource } = this
    const { amount, recipient, provider } = args

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!recipient) {
      throw new GeneralException(new Error(`Please provide recipient`))
    }

    const signer = await this.getProviderAndChainIdCheck(provider)

    const nativeTokenAddress = getEvmNativeAddress(network, wormholeSource)
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const allowance = await this.getEvmTokenAllowance({
      address: await signer.getAddress(),
      tokenAddress: nativeTokenAddress,
      provider,
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

  async redeem(
    signedVAA: string /* in base 64 */,
    provider: Provider,
  ): Promise<ethers.ContractReceipt> {
    const { network, wormholeSource } = this

    const signer = await this.getProviderAndChainIdCheck(provider)
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

  async getIsTransferCompleted(
    signedVAA: string /* in base 64 */,
    provider: Provider,
  ) {
    const { network, wormholeSource } = this

    const signer = await this.getProviderAndChainIdCheck(provider)
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

  async getIsTransferCompletedRetry(
    signedVAA: string /* in base 64 */,
    provider: Provider,
  ) {
    const RETRIES = 2
    const TIMEOUT_BETWEEN_RETRIES = 2000

    for (let i = 0; i < RETRIES; i += 1) {
      if (await this.getIsTransferCompleted(signedVAA, provider)) {
        return true
      }

      await sleep(TIMEOUT_BETWEEN_RETRIES)
    }

    return false
  }

  private async getProviderAndChainIdCheck(provider: Provider) {
    if (!provider) {
      throw new GeneralException(new Error(`Please provide provider`))
    }

    const signer = provider.getSigner()
    const chainId = await signer.getChainId()

    if (chainId !== this.evmChainId) {
      throw new GeneralException(
        new Error(`Please switch to the ${this.evmChainId} Network`),
      )
    }

    return signer
  }
}
