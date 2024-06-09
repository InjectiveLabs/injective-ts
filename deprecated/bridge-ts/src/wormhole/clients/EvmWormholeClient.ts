import { Network } from '@injectivelabs/networks'
import { getGrpcTransport } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  cosmos,
  ChainId,
  approveEth,
  redeemOnEth,
  getSignedVAA,
  transferFromEth,
  redeemOnEthNative,
  getEmitterAddressEth,
  getSignedVAAWithRetry,
  transferFromEthNative,
  parseSequenceFromLogEth,
  getIsTransferCompletedEth,
  ethers_contracts as EthersContracts,
  CHAIN_ID_POLYGON,
  getForeignAssetEth,
  tryNativeToUint8Array,
} from '@injectivelabs/wormhole-sdk'
import { BigNumber, sleep } from '@injectivelabs/utils'
import { ethers } from 'ethers'
import { zeroPad } from 'ethers/lib/utils'
import { WORMHOLE_CHAINS, WORMHOLE_NATIVE_WRAPPED_ADDRESS } from '../constants'
import { WormholeSource, WormholeClient, TransferMsgArgs } from '../types'
import { getEvmChainName, getContractAddresses } from '../utils'
import { BaseWormholeClient } from '../WormholeClient'

const TIMEOUT_BETWEEN_RETRIES = 5000

export type Provider = () =>
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

  private singletonProvider: ethers.providers.Web3Provider | undefined

  constructor({
    network,
    wormholeRpcUrl,
    wormholeRestUrl,
    wormholeSource,
    provider,
  }: {
    network: Network
    wormholeSource: WormholeSource
    wormholeRpcUrl?: string
    wormholeRestUrl?: string
    provider: Provider
  }) {
    super({ network, wormholeRpcUrl, wormholeRestUrl })
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
        return WORMHOLE_CHAINS.ethereum
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

  async getAddress() {
    const signer = await this.getProviderAndChainIdCheck()

    return signer.getAddress()
  }

  async getBalance(address: string, tokenAddress?: string) {
    const signer = await this.getProviderAndChainIdCheck()

    try {
      if (!tokenAddress) {
        return (await signer.provider.getBalance(address)).toString()
      }

      if (isNativeTokenAddress(tokenAddress)) {
        return (await signer.provider.getBalance(address)).toString()
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
    return args.tokenAddress && !isNativeTokenAddress(args.tokenAddress)
      ? this.transferToken(args)
      : this.transferNative(args)
  }

  async getTxResponse(txHash: string) {
    const signer = await this.getProviderAndChainIdCheck()
    try {
      const txResponse = await signer.provider.getTransactionReceipt(txHash)

      if (!txResponse) {
        throw new GeneralException(
          new Error('An error occurred while fetching the transaction info'),
        )
      }

      return {
        ...txResponse,
        txHash: txResponse.transactionHash,
      } as ethers.ContractReceipt & { txHash: string }
    } catch (e) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
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

    try {
      const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
        [wormholeRpcUrl],
        wormholeChainId,
        emitterAddress,
        sequence,
        {
          transport: getGrpcTransport(),
        },
        TIMEOUT_BETWEEN_RETRIES,
      )

      return Buffer.from(signedVAA).toString('base64')
    } catch (e) {
      throw new GeneralException(
        new Error(
          `Could not get the signed VAA. Is the transaction confirmed?`,
        ),
      )
    }
  }

  async getSignedVAANoRetry(txResponse: ethers.ContractReceipt) {
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

    try {
      const { vaaBytes: signedVAA } = await getSignedVAA(
        wormholeRpcUrl,
        wormholeChainId,
        emitterAddress,
        sequence,
        {
          transport: getGrpcTransport(),
        },
      )

      return Buffer.from(signedVAA).toString('base64')
    } catch (e) {
      throw new GeneralException(
        new Error(
          `Could not get the signed VAA. Is the transaction confirmed?`,
        ),
      )
    }
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

    for (let i = 0; i < RETRIES; i += 1) {
      if (await this.getIsTransferCompleted(signedVAA)) {
        return true
      }

      await sleep(TIMEOUT_BETWEEN_RETRIES)
    }

    return false
  }

  async redeem({
    signedVAA,
  }: {
    signedVAA: string /* in base 64 */
    recipient?: string
  }): Promise<ethers.ContractReceipt> {
    const { network, wormholeSource, wormholeChainId } = this

    const signer = await this.getProviderAndChainIdCheck()
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    return redeemOnEth(
      associatedChainContractAddresses.token_bridge,
      signer,
      Buffer.from(signedVAA, 'base64'),
      {
        ...(wormholeChainId === CHAIN_ID_POLYGON && {
          gasLimit: '300000',
          type: 0,
        }),
      },
    )
  }

  async redeemNative({
    signedVAA,
  }: {
    signedVAA: string /* in base 64 */
    recipient?: string
  }): Promise<ethers.ContractReceipt> {
    const { network, wormholeSource, wormholeChainId } = this

    const signer = await this.getProviderAndChainIdCheck()
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    return redeemOnEthNative(
      associatedChainContractAddresses.token_bridge,
      signer,
      Buffer.from(signedVAA, 'base64'),
      {
        ...(wormholeChainId === CHAIN_ID_POLYGON && {
          gasLimit: '300000',
          type: 0,
        }),
      },
    )
  }

  async getForeignAsset(originChain: ChainId, originAddress: string) {
    const { network, wormholeSource } = this

    const signer = await this.getProviderAndChainIdCheck()
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const originAssetBinary = tryNativeToUint8Array(
      originAddress,
      originChain as ChainId,
    )
    const targetAsset = await getForeignAssetEth(
      associatedChainContractAddresses.token_bridge,
      signer,
      originChain as ChainId,
      originAssetBinary,
    )

    return targetAsset || ''
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

  protected async transferToken(args: TransferMsgArgs) {
    const { network, wormholeRpcUrl, wormholeRestUrl, wormholeSource } = this
    const { amount, recipient, tokenAddress } = args

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
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
      zeroPad(cosmos.canonicalAddress(recipient), 32),
    )

    if (!transferReceipt) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }

    return {
      txHash: transferReceipt.transactionHash,
      ...transferReceipt,
    } as ethers.ContractReceipt & {
      txHash: string
    }
  }

  protected async transferNative(args: TransferMsgArgs) {
    const { network, wormholeRpcUrl, wormholeRestUrl, wormholeSource } = this
    const { amount, recipient } = args

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
    }

    if (!recipient) {
      throw new GeneralException(new Error(`Please provide recipient`))
    }

    const signer = await this.getProviderAndChainIdCheck()

    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      wormholeSource,
    )

    const transferReceipt = await transferFromEthNative(
      associatedChainContractAddresses.token_bridge,
      signer,
      amount,
      WORMHOLE_CHAINS.injective,
      zeroPad(cosmos.canonicalAddress(recipient), 32),
    )

    if (!transferReceipt) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }

    return {
      txHash: transferReceipt.transactionHash,
      ...transferReceipt,
    } as ethers.ContractReceipt & {
      txHash: string
    }
  }

  protected async getProvider() {
    const { provider } = this

    if (this.singletonProvider) {
      return this.singletonProvider
    }

    this.singletonProvider =
      provider instanceof Function ? await provider() : provider

    return this.singletonProvider
  }

  protected async getProviderAndChainIdCheck() {
    const provider = await this.getProvider()
    const signer = provider.getSigner()
    const chainId = await signer.getChainId()

    /**
     * Trigger network change on Metamask and re-fetch the
     * provider again so it has the updated chainId
     */
    if (chainId !== this.evmChainId) {
      const chainIdToHex = this.evmChainId.toString(16)

      try {
        const metamaskProvider = (window as any).ethereum as any

        // Set up a race between `wallet_switchEthereumChain` & the `chainChanged` event
        // to ensure the chain has been switched. This is because there could be a case
        // where a wallet may not resolve the `wallet_switchEthereumChain` method, or
        // resolves slower than `chainChanged`.
        await Promise.race([
          metamaskProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chainIdToHex}` }],
          }),
          new Promise<void>((resolve) =>
            metamaskProvider.on('change', ({ chain }: any) => {
              if (chain?.id === chainIdToHex) {
                resolve()
              }
            }),
          ),
        ])

        return signer
      } catch (e) {
        throw new GeneralException(
          new Error(
            `Please switch to the ${getEvmChainName(
              this.evmChainId,
            )} Network on Metamask`,
          ),
        )
      }
    }

    return signer
  }
}

export const isNativeTokenAddress = (tokenAddress?: string) => {
  const wrappedNativeWrappedTokensMap = {
    ...WORMHOLE_NATIVE_WRAPPED_ADDRESS(Network.Mainnet),
    ...WORMHOLE_NATIVE_WRAPPED_ADDRESS(Network.Testnet),
    ...WORMHOLE_NATIVE_WRAPPED_ADDRESS(Network.Devnet),
  }
  const wrappedTokenAddresses = Object.values(wrappedNativeWrappedTokensMap)

  return tokenAddress && wrappedTokenAddresses.includes(tokenAddress)
}

/** in seconds */
export const EVM_NETWORK_BLOCK_TIME = {
  [WormholeSource.Ethereum]: 12,
  [WormholeSource.Polygon]: 2,
  [WormholeSource.Arbitrum]: 15,
}
