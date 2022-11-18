import { getEndpointsForNetwork } from '@injectivelabs/networks'
import { isBrowser, ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
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
} from '@certusone/wormhole-sdk'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ethers } from 'ethers'
import {
  WORMHOLE_CHAINS,
  WORMHOLE_CONTRACT_BY_NETWORK,
  WORMHOLE_ETHEREUM_CONTRACT_BY_NETWORK,
} from '../constants'
import {
  WormholeContractAddresses,
  WormholeEthereumContractAddresses,
  TransferMsgArgs,
} from '../types'
import { WormholeClient } from '../WormholeClient'

export class EthereumWormholeClient extends WormholeClient {
  async transferFromEthereumToInjective(
    args: TransferMsgArgs,
    provider: ethers.providers.Web3Provider,
  ) {
    const { network, wormholeRpcUrl } = this
    const { amount, recipient } = args
    const endpoints = getEndpointsForNetwork(network)

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const ethereumContractAddresses = (
      WORMHOLE_ETHEREUM_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeEthereumContractAddresses
      }
    )[network] as WormholeEthereumContractAddresses

    const contractAddresses = (
      WORMHOLE_CONTRACT_BY_NETWORK as {
        [key: string]: WormholeContractAddresses
      }
    )[network] as WormholeContractAddresses

    if (!contractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Injective not found`),
      )
    }

    if (!ethereumContractAddresses) {
      throw new GeneralException(
        new Error(`Contracts for ${network} on Solana not found`),
      )
    }

    if (!contractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} on Injective not found`),
      )
    }

    if (!ethereumContractAddresses.token_bridge) {
      throw new GeneralException(
        new Error(`Token Bridge Address for ${network} on Ethereum not found`),
      )
    }

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.sentryGrpcApi)
    const foreignAsset = await getForeignAssetInjective(
      contractAddresses.token_bridge,
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

    return redeemOnInjective(
      contractAddresses.token_bridge,
      recipient,
      signedVAA,
    )
  }
}
