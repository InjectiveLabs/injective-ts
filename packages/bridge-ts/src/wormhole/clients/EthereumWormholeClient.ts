import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { getGrpcTransport, ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  tryNativeToHexString,
  transferFromEth,
  parseSequenceFromLogEth,
  getEmitterAddressEth,
  getSignedVAAWithRetry,
  getForeignAssetInjective,
  hexToUint8Array,
  approveEth,
  redeemOnEth,
  getIsTransferCompletedEth,
  uint8ArrayToHex,
  cosmos,
  ethers_contracts as EthersContracts,
  getForeignAssetEth,
} from '@injectivelabs/wormhole-sdk'
import { BigNumber, sleep } from '@injectivelabs/utils'
import { ethers } from 'ethers'
import { zeroPad } from 'ethers/lib/utils'
import { WORMHOLE_CHAINS } from '../constants'
import { EthereumTransferMsgArgs, WormholeSource } from '../types'
import { getContractAddresses } from '../utils'
import { WormholeClient } from '../WormholeClient'

type Provider = ethers.providers.Web3Provider | undefined

export class EthereumWormholeClient extends WormholeClient {
  constructor({
    network,
    wormholeRpcUrl,
  }: {
    network: Network
    wormholeRpcUrl?: string
  }) {
    super({ network, wormholeRpcUrl })
  }

  async getErc20TokenBalance({
    address,
    tokenAddress,
    provider,
  }: {
    address: string /* in CW20 */
    tokenAddress: string
    provider: Provider
  }) {
    const { network } = this

    if (!provider) {
      throw new GeneralException(new Error(`Please provide provider`))
    }

    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      WormholeSource.Ethereum,
    )

    const originAssetHex = tryNativeToHexString(
      tokenAddress,
      WORMHOLE_CHAINS.injective,
    )

    const foreignAsset = await getForeignAssetEth(
      associatedChainContractAddresses.token_bridge,
      provider,
      WORMHOLE_CHAINS.injective,
      hexToUint8Array(originAssetHex),
    )

    if (!foreignAsset) {
      throw new GeneralException(new Error(`Foreign Ethereum asset not found`))
    }

    const signer = provider.getSigner()
    const tokenContract = EthersContracts.ERC20__factory.connect(
      foreignAsset,
      signer,
    )

    return (await tokenContract.balanceOf(address)).toString()
  }

  async transferToInjective(
    args: EthereumTransferMsgArgs & { provider: Provider },
  ) {
    const { network, wormholeRpcUrl } = this
    const { amount, recipient, provider, tokenAddress } = args
    const endpoints = getNetworkEndpoints(network)

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!recipient) {
      throw new GeneralException(new Error(`Please provide recipient`))
    }

    if (!provider) {
      throw new GeneralException(new Error(`Please provide provider`))
    }

    const signer = provider.getSigner()
    const { injectiveContractAddresses, associatedChainContractAddresses } =
      getContractAddresses(network, WormholeSource.Ethereum)

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

    const originAssetHex = tryNativeToHexString(
      tokenAddress,
      WORMHOLE_CHAINS.ethereum,
    )

    const foreignAsset = await getForeignAssetInjective(
      injectiveContractAddresses.token_bridge,
      // @ts-ignore
      chainGrpcWasmApi,
      WORMHOLE_CHAINS.ethereum,
      hexToUint8Array(originAssetHex),
    )

    if (!foreignAsset) {
      throw new GeneralException(new Error(`Foreign Injective asset not found`))
    }

    await approveEth(
      associatedChainContractAddresses.token_bridge,
      tokenAddress,
      signer,
      new BigNumber(2).pow(256).minus(1).toFixed(),
    )

    const transferReceipt = await transferFromEth(
      associatedChainContractAddresses.token_bridge,
      signer,
      foreignAsset,
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
    const { network, wormholeRpcUrl } = this

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      WormholeSource.Ethereum,
    )

    const sequence = parseSequenceFromLogEth(
      txResponse as ethers.ContractReceipt,
      associatedChainContractAddresses.token_bridge,
    )
    const emitterAddress = await getEmitterAddressEth(
      associatedChainContractAddresses.token_bridge,
    )

    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      [wormholeRpcUrl],
      WORMHOLE_CHAINS.ethereum,
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
    const { network } = this

    if (!provider) {
      throw new GeneralException(new Error(`Please provide provider`))
    }

    const signer = provider.getSigner()
    const { associatedChainContractAddresses } = getContractAddresses(
      network,
      WormholeSource.Ethereum,
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
    const { network } = this

    if (!provider) {
      throw new GeneralException(new Error(`Please provide provider`))
    }

    const signer = provider.getSigner()
    const { injectiveContractAddresses } = getContractAddresses(
      network,
      WormholeSource.Ethereum,
    )

    return getIsTransferCompletedEth(
      injectiveContractAddresses.token_bridge,
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
}
