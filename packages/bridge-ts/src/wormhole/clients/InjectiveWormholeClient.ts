import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import {
  isBrowser,
  MsgExecuteContractCompat,
  ChainGrpcWasmApi,
  TxResponse,
} from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  tryNativeToUint8Array,
  getSignedVAAWithRetry,
  transferFromInjective,
  parseSequenceFromLogInjective,
  getEmitterAddressInjective,
  tryNativeToHexString,
  getForeignAssetInjective,
  hexToUint8Array,
  getIsTransferCompletedInjective,
} from '@injectivelabs/wormhole-sdk'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { NATIVE_MINT } from '@solana/spl-token'
import { sleep } from '@injectivelabs/utils'
import { WORMHOLE_CHAINS } from '../constants'
import { InjectiveTransferMsgArgs, WormholeSource } from '../types'
import {
  getAssociatedChain,
  getAssociatedChainRecipient,
  getContractAddresses,
} from '../utils'
import { WormholeClient } from '../WormholeClient'

interface MsgBroadcaster {
  broadcast: (params: any) => Promise<TxResponse>
  broadcastOld: (params: any) => Promise<TxResponse>
}

export class InjectiveWormholeClient extends WormholeClient {
  public provider?: MsgBroadcaster

  constructor({
    network,
    wormholeRpcUrl,
    provider,
  }: {
    network: Network
    wormholeRpcUrl?: string
    provider?: MsgBroadcaster
  }) {
    super({ network, wormholeRpcUrl })

    this.provider = provider
  }

  async getBridgedAssetBalance({
    injectiveAddress,
    tokenAddress = NATIVE_MINT.toString(),
    source = WormholeSource.Solana,
  }: {
    injectiveAddress: string
    tokenAddress: string
    source: WormholeSource
  }) {
    const { network } = this
    const endpoints = getNetworkEndpoints(network)

    const associatedChain = getAssociatedChain(source)
    const { injectiveContractAddresses } = getContractAddresses(network)

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

    const originAssetHex = tryNativeToHexString(tokenAddress, associatedChain)
    const foreignAsset = await getForeignAssetInjective(
      injectiveContractAddresses.token_bridge,
      chainGrpcWasmApi,
      associatedChain,
      hexToUint8Array(originAssetHex),
    )

    if (!foreignAsset) {
      throw new GeneralException(new Error(`Foreign asset not found`))
    }

    const response = await chainGrpcWasmApi.fetchSmartContractState(
      foreignAsset,
      Buffer.from(
        JSON.stringify({
          balance: {
            address: injectiveAddress,
          },
        }),
      ).toString('base64'),
    )

    if (typeof response.data === 'string') {
      const state = JSON.parse(
        Buffer.from(response.data, 'base64').toString('utf-8'),
      ) as { balance: string }

      return { address: foreignAsset, balance: state.balance } as {
        address: string
        balance: string
      }
    }

    throw new GeneralException(
      new Error(`Could not get the balance from the token bridge contract`),
    )
  }

  async transferFromInjective(
    args: InjectiveTransferMsgArgs & {
      /**
       * Additional messages that we run before the bridge, an example
       * could be redeeming from the token factory to CW20
       */
      additionalMsgs?: MsgExecuteContractCompat[]
      /**
       * The destination chain where we transfer to
       */
      destination?: WormholeSource
    },
  ) {
    const { network, wormholeRpcUrl, provider } = this
    const {
      amount,
      recipient: recipientArg,
      additionalMsgs = [],
      destination = WormholeSource.Solana,
    } = args

    const associatedChain = getAssociatedChain(destination)
    const recipient = getAssociatedChainRecipient(recipientArg)

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!recipient) {
      throw new GeneralException(
        new Error(`Please provide the associatedChain provider`),
      )
    }

    if (!provider) {
      throw new GeneralException(
        new Error(`Please provide Injective wallet provider`),
      )
    }

    const { injectiveContractAddresses } = getContractAddresses(network)

    const messages = await transferFromInjective(
      args.injectiveAddress,
      injectiveContractAddresses.token_bridge,
      args.tokenAddress,
      amount,
      associatedChain,
      tryNativeToUint8Array(recipient, associatedChain),
    )

    const txResponse = (await provider.broadcastOld({
      msgs: [...additionalMsgs, ...messages],
      injectiveAddress: args.injectiveAddress,
    })) as TxResponse

    if (!txResponse) {
      throw new GeneralException(new Error('Transaction can not be found!'))
    }

    return txResponse
  }

  async getSignedVAA(txResponse: TxResponse) {
    const { network, wormholeRpcUrl } = this

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const { injectiveContractAddresses } = getContractAddresses(network)

    const sequence = parseSequenceFromLogInjective(txResponse)
    const emitterAddress = await getEmitterAddressInjective(
      injectiveContractAddresses.token_bridge,
    )

    const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
      [wormholeRpcUrl],
      WORMHOLE_CHAINS.injective,
      emitterAddress,
      sequence,
      {
        transport: isBrowser() ? undefined : NodeHttpTransport(),
      },
    )

    return Buffer.from(signedVAA).toString('base64')
  }

  async redeem(
    injectiveAddress: string,
    signedVAA: string /* in base 64 */,
  ): Promise<MsgExecuteContractCompat> {
    const { network } = this
    const { injectiveContractAddresses } = getContractAddresses(network)

    return MsgExecuteContractCompat.fromJSON({
      contractAddress: injectiveContractAddresses.token_bridge,
      sender: injectiveAddress,
      msg: {
        submit_vaa: {
          data: signedVAA,
        },
      },
    })
  }

  async createWrapped(
    injectiveAddress: string,
    signedVAA: string /* in base 64 */,
  ): Promise<MsgExecuteContractCompat> {
    const { network } = this
    const { injectiveContractAddresses } = getContractAddresses(network)

    return MsgExecuteContractCompat.fromJSON({
      contractAddress: injectiveContractAddresses.token_bridge,
      sender: injectiveAddress,
      msg: {
        submit_vaa: {
          data: signedVAA,
        },
      },
    })
  }

  async getIsTransferCompleted(signedVAA: string /* in base 64 */) {
    const { network } = this
    const endpoints = getNetworkEndpoints(network)

    const { injectiveContractAddresses } = getContractAddresses(network)

    return getIsTransferCompletedInjective(
      injectiveContractAddresses.token_bridge,
      Buffer.from(signedVAA, 'base64'),
      // @ts-ignore
      new ChainGrpcWasmApi(endpoints.grpc),
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
}
