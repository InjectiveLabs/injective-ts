import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import {
  TxResponse,
  getGrpcTransport,
  ChainGrpcWasmApi,
  ChainGrpcBankApi,
  getInjectiveAddress,
  MsgExecuteContractCompat,
  IndexerRestExplorerApi,
} from '@injectivelabs/sdk-ts'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  ChainId,
  getSignedVAA,
  getSignedVAAWithRetry,
  tryNativeToUint8Array,
} from '@injectivelabs/wormhole-sdk'
import {
  transferFromInjective,
  getEmitterAddressInjective,
  parseSequenceFromLogInjective,
  getIsTransferCompletedInjective,
  getForeignAssetInjective,
} from '../injective'
import { INJ_DENOM, sleep } from '@injectivelabs/utils'
import { WORMHOLE_CHAINS } from '../constants'
import { TransferMsgArgs, WormholeClient, WormholeSource } from '../types'
import {
  getAssociatedChain,
  getContractAddresses,
  getAssociatedChainRecipient,
} from '../utils'
import { BaseWormholeClient } from '../WormholeClient'

const TIMEOUT_BETWEEN_RETRIES = 5000

interface WalletStrategy {
  getAddresses: () => Promise<string[]>
}

interface MsgBroadcaster {
  broadcast: (params: any) => Promise<TxResponse>
}

interface Provider {
  msgBroadcaster: MsgBroadcaster
  walletStrategy: WalletStrategy
}

export class InjectiveWormholeClient
  extends BaseWormholeClient
  implements WormholeClient<TxResponse, MsgExecuteContractCompat>
{
  public provider: Provider

  constructor({
    network,
    wormholeRpcUrl,
    wormholeRestUrl,
    provider,
  }: {
    network: Network
    provider: Provider
    wormholeRpcUrl?: string
    wormholeRestUrl?: string
  }) {
    super({ network, wormholeRpcUrl, wormholeRestUrl })
    this.provider = provider
  }

  async getAddress() {
    const { provider } = this

    const [address] = await provider.walletStrategy.getAddresses()

    return address.startsWith('0x') ? getInjectiveAddress(address) : address
  }

  async getBalance(
    address: string,
    tokenAddress?: string /* CW20 address on Injective */,
  ) {
    const { network } = this
    const endpoints = getNetworkEndpoints(network)

    const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc)
    const { balances } = await chainGrpcBankApi.fetchBalances(address)

    const balance = balances.find((balance) =>
      tokenAddress
        ? balance.denom.includes(tokenAddress)
        : balance.denom === INJ_DENOM,
    )

    return balance?.amount || '0'
  }

  async transfer(
    args: TransferMsgArgs & {
      additionalMsgs?: MsgExecuteContractCompat[]
      destination?: WormholeSource
    },
  ) {
    const { network, wormholeRpcUrl, wormholeRestUrl, provider } = this
    const {
      amount,
      signer,
      additionalMsgs = [],
      recipient: recipientArg,
      destination = WormholeSource.Solana,
    } = args

    const associatedChain = getAssociatedChain(destination)
    const recipient = getAssociatedChainRecipient(recipientArg, destination)

    if (!args.tokenAddress) {
      throw new GeneralException(new Error(`Please provide tokenAddress`))
    }

    if (!wormholeRpcUrl && !wormholeRestUrl) {
      throw new GeneralException(
        new Error(`Please provide wormholeRpcUrl | wormholeRestUrl`),
      )
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

    if (!signer) {
      throw new GeneralException(new Error(`Please provide signer`))
    }

    const { injectiveContractAddresses } = getContractAddresses(
      network,
      destination,
    )

    const messages = await transferFromInjective(
      signer,
      injectiveContractAddresses.token_bridge,
      args.tokenAddress,
      amount,
      associatedChain,
      tryNativeToUint8Array(recipient, associatedChain),
    )

    const txResponse = (await provider.msgBroadcaster.broadcast({
      msgs: [...additionalMsgs, ...messages],
      injectiveAddress: signer,
    })) as TxResponse

    if (!txResponse) {
      throw new GeneralException(new Error('Transaction can not be found!'))
    }

    return txResponse
  }

  async getTxResponse(txHash: string) {
    const { network } = this
    const endpoints = getNetworkEndpoints(network)
    const indexerRestExplorerApi = new IndexerRestExplorerApi(endpoints.indexer)

    try {
      const txResponse = await indexerRestExplorerApi.fetchTransaction(txHash)

      if (!txResponse) {
        throw new GeneralException(
          new Error('An error occurred while fetching the transaction info'),
        )
      }

      return {
        ...txResponse,
        txHash: txResponse.hash,
        height: txResponse.blockNumber,
        rawLog: JSON.stringify(txResponse.logs || []),
        timestamp: txResponse.blockTimestamp,
      } as TxResponse
    } catch (e) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }
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

    try {
      const { vaaBytes: signedVAA } = await getSignedVAAWithRetry(
        [wormholeRpcUrl],
        WORMHOLE_CHAINS.injective,
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

  async getSignedVAANoRetry(txResponse: TxResponse) {
    const { network, wormholeRpcUrl } = this

    if (!wormholeRpcUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRpcUrl`))
    }

    const { injectiveContractAddresses } = getContractAddresses(network)

    const sequence = parseSequenceFromLogInjective(txResponse)
    const emitterAddress = await getEmitterAddressInjective(
      injectiveContractAddresses.token_bridge,
    )

    try {
      const { vaaBytes: signedVAA } = await getSignedVAA(
        wormholeRpcUrl,
        WORMHOLE_CHAINS.injective,
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
    const { network } = this
    const endpoints = getNetworkEndpoints(network)

    const { injectiveContractAddresses } = getContractAddresses(network)

    return getIsTransferCompletedInjective(
      injectiveContractAddresses.token_bridge,
      Buffer.from(signedVAA, 'base64'),
      new ChainGrpcWasmApi(endpoints.grpc),
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

  async getForeignAsset(originChain: ChainId, originAddress: string) {
    const { network } = this
    const endpoints = getNetworkEndpoints(network)

    const { injectiveContractAddresses } = getContractAddresses(network)
    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

    const originAssetBinary = tryNativeToUint8Array(
      originAddress,
      originChain as ChainId,
    )
    const targetAsset = await getForeignAssetInjective(
      injectiveContractAddresses.token_bridge,
      chainGrpcWasmApi,
      originChain as ChainId,
      originAssetBinary,
    )

    return targetAsset || ''
  }

  async redeem({
    signedVAA,
    recipient,
  }: {
    signedVAA: string /* in base 64 */
    recipient: string
  }): Promise<MsgExecuteContractCompat> {
    const { network } = this
    const { injectiveContractAddresses } = getContractAddresses(network)

    return MsgExecuteContractCompat.fromJSON({
      contractAddress: injectiveContractAddresses.token_bridge,
      sender: recipient,
      msg: {
        submit_vaa: {
          data: signedVAA,
        },
      },
    })
  }

  async redeemNative(args: {
    signedVAA: string /* in base 64 */
    recipient: string
  }): Promise<MsgExecuteContractCompat> {
    return this.redeem(args)
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

  async getBridgedAssetBalance(
    injectiveAddress: string,
    tokenAddress: string /* CW20 address on Injective */,
  ) {
    const { network } = this
    const endpoints = getNetworkEndpoints(network)

    const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

    const response = await chainGrpcWasmApi.fetchSmartContractState(
      tokenAddress,
      Buffer.from(
        JSON.stringify({
          balance: {
            address: injectiveAddress,
          },
        }),
      ).toString('base64'),
    )

    if (response.data) {
      const state = JSON.parse(Buffer.from(response.data).toString()) as {
        balance: string
      }

      return { address: tokenAddress, balance: state.balance } as {
        address: string
        balance: string
      }
    }

    throw new GeneralException(
      new Error(`Could not get the balance from the token bridge contract`),
    )
  }
}
