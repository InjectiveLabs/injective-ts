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
} from '@certusone/wormhole-sdk'
import { PublicKey as SolanaPublicKey } from '@solana/web3.js'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { NATIVE_MINT } from '@solana/spl-token'
import { sleep } from '@injectivelabs/utils'
import { WORMHOLE_CHAINS } from '../constants'
import { InjectiveTransferMsgArgs, TransferMsgArgs } from '../types'
import { getSolanaContractAddresses } from '../utils'
import { WormholeClient } from '../WormholeClient'

export class InjectiveWormholeClient extends WormholeClient {
  constructor({
    network,
    wormholeRpcUrl,
  }: {
    network: Network
    wormholeRpcUrl?: string
  }) {
    super({ network, wormholeRpcUrl })
  }

  // eslint-disable-next-line class-methods-use-this
  async attestFromInjectiveToSolana(
    _args: Omit<TransferMsgArgs, 'address' | 'amount'>,
    _provider: BaseMessageSignerWalletAdapter,
  ) {
    throw new GeneralException(new Error(`Not implemented yet!`))
  }

  async getSolanaBridgedAssetBalance(
    injectiveAddress: string,
    tokenAddress: string = NATIVE_MINT.toString(),
  ) {
    const { network } = this
    const endpoints = getNetworkEndpoints(network)

    const { contractAddresses } = getSolanaContractAddresses(network)

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

    const originAssetHex = tryNativeToHexString(
      tokenAddress,
      WORMHOLE_CHAINS.solana,
    )
    const foreignAsset = await getForeignAssetInjective(
      contractAddresses.token_bridge,
      chainGrpcWasmApi as any /* TODO */,
      WORMHOLE_CHAINS.solana,
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

  async transferFromInjectiveToSolana(
    args: InjectiveTransferMsgArgs & {
      /**
       * Additional messages that we run before the bridge, an example
       * could be redeeming from the token factory to CW20
       */
      additionalMsgs?: MsgExecuteContractCompat[]
      provider: { broadcast: (params: any) => TxResponse } /* TODO */
    },
  ) {
    const { network, wormholeRpcUrl } = this
    const { amount, recipient, provider, additionalMsgs = [] } = args
    const solanaPubKey = new SolanaPublicKey(recipient)

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    if (!solanaPubKey) {
      throw new GeneralException(
        new Error(`Please provide solanaOptions.provider`),
      )
    }

    const { contractAddresses } = getSolanaContractAddresses(network)

    const messages = await transferFromInjective(
      args.injectiveAddress,
      contractAddresses.token_bridge,
      args.tokenAddress,
      amount,
      WORMHOLE_CHAINS.solana,
      tryNativeToUint8Array(solanaPubKey.toString(), WORMHOLE_CHAINS.solana),
    )

    const txResponse = (await provider.broadcast({
      msgs: [...messages, ...additionalMsgs],
      injectiveAddress: args.injectiveAddress,
    })) as TxResponse

    if (!txResponse) {
      throw new GeneralException(new Error('Transaction can not be found!'))
    }

    return txResponse
  }

  async getSignedVAAOnInjective(txResponse: TxResponse) {
    const { network, wormholeRpcUrl } = this

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const { contractAddresses } = getSolanaContractAddresses(network)

    const sequence = parseSequenceFromLogInjective(txResponse)
    const emitterAddress = await getEmitterAddressInjective(
      contractAddresses.token_bridge,
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

  async redeemOnInjective({
    injectiveAddress,
    signedVAA,
  }: {
    injectiveAddress: string
    signedVAA: string /* in base 64 */
  }): Promise<MsgExecuteContractCompat> {
    const { network } = this

    const { contractAddresses } = getSolanaContractAddresses(network)

    return MsgExecuteContractCompat.fromJSON({
      contractAddress: contractAddresses.token_bridge,
      sender: injectiveAddress,
      msg: {
        submit_vaa: {
          data: signedVAA,
        },
      },
    })
  }

  async createWrappedOnInjective({
    injectiveAddress,
    signedVAA,
  }: {
    injectiveAddress: string
    signedVAA: string /* in base 64 */
  }): Promise<MsgExecuteContractCompat> {
    const { network } = this

    const { contractAddresses } = getSolanaContractAddresses(network)

    return MsgExecuteContractCompat.fromJSON({
      contractAddress: contractAddresses.token_bridge,
      sender: injectiveAddress,
      msg: {
        submit_vaa: {
          data: signedVAA,
        },
      },
    })
  }

  async getIsTransferCompletedInjective(signedVAA: string /* in base 64 */) {
    const { network } = this
    const endpoints = getNetworkEndpoints(network)

    const { contractAddresses } = getSolanaContractAddresses(network)

    return getIsTransferCompletedInjective(
      contractAddresses.token_bridge,
      Buffer.from(signedVAA, 'base64'),
      new ChainGrpcWasmApi(endpoints.grpc) as any /* TODO */,
    )
  }

  async getIsTransferCompletedInjectiveRetry(
    signedVAA: string /* in base 64 */,
  ) {
    const RETRIES = 2
    const TIMEOUT_BETWEEN_RETRIES = 2000

    for (let i = 0; i < RETRIES; i += 1) {
      if (await this.getIsTransferCompletedInjective(signedVAA)) {
        return true
      }

      await sleep(TIMEOUT_BETWEEN_RETRIES)
    }

    return false
  }
}
