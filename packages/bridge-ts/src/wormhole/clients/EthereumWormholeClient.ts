import { getNetworkEndpoints } from '@injectivelabs/networks'
import {
  isBrowser,
  ChainGrpcWasmApi,
  MsgExecuteContract,
} from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  tryNativeToHexString,
  tryNativeToUint8Array,
  getSignedVAAWithRetry,
  redeemOnInjective,
  transferFromEth,
  getForeignAssetInjective,
  approveEth,
  parseSequenceFromLogEth,
  getEmitterAddressEth,
  getIsTransferCompletedEth,
} from '@certusone/wormhole-sdk'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ethers } from 'ethers'
import { WORMHOLE_CHAINS } from '../constants'
import { EthereumTransferMsgArgs } from '../types'
import { WormholeClient } from '../WormholeClient'
import { getEthereumContractAddresses } from '../utils'

export class EthereumWormholeClient extends WormholeClient {
  /** TODO: Refactor */
  async transferFromEthereumToInjective(
    args: EthereumTransferMsgArgs & { provider: ethers.providers.Web3Provider },
  ): Promise<MsgExecuteContract> {
    const { network, wormholeRpcUrl } = this
    const { amount, recipient, provider } = args
    const endpoints = getNetworkEndpoints(network)

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    const { contractAddresses, ethereumContractAddresses } =
      getEthereumContractAddresses(network)

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)
    const foreignAsset = await getForeignAssetInjective(
      contractAddresses.token_bridge,
      // @ts-ignore
      chainGrpcWasmApi,
      WORMHOLE_CHAINS.ethereum,
      new Uint8Array(
        Buffer.from(tryNativeToHexString(args.tokenAddress, 'injective')),
      ),
    )

    if (!foreignAsset) {
      throw new GeneralException(new Error(`Foreign Injective asset not found`))
    }

    await approveEth(
      ethereumContractAddresses.token_bridge,
      args.tokenAddress,
      provider.getSigner(),
      amount,
    )

    const receipt = await transferFromEth(
      ethereumContractAddresses.token_bridge,
      provider.getSigner(),
      args.tokenAddress,
      amount,
      WORMHOLE_CHAINS.injective,
      tryNativeToUint8Array(args.recipient, WORMHOLE_CHAINS.injective),
    )

    const sequence = parseSequenceFromLogEth(
      receipt,
      ethereumContractAddresses.core,
    )
    const emitterAddress = getEmitterAddressEth(
      ethereumContractAddresses.token_bridge,
    )

    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      [wormholeRpcUrl],
      WORMHOLE_CHAINS.ethereum,
      emitterAddress,
      sequence,
      {
        transport: isBrowser() ? undefined : NodeHttpTransport(),
      },
    )

    const transferIsCompleted = await getIsTransferCompletedEth(
      ethereumContractAddresses.token_bridge,
      provider,
      signedVAA,
    )

    if (!transferIsCompleted) {
      throw new Error('The transfer has not been completed')
    }

    return redeemOnInjective(
      contractAddresses.token_bridge,
      recipient,
      signedVAA,
    )
  }
}
