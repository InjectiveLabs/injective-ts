import { AminoMsg, StdFee } from '@cosmjs/amino'
import {
  SigningCosmosClient,
  LcdClient,
  setupBankExtension,
  setupAuthExtension,
  BankExtension,
  AuthExtension,
  NodeInfoResponse,
  BroadcastMode,
} from '@cosmjs/launchpad'
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin'
import { Height } from 'cosmjs-types/ibc/core/client/v1/client'
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
  HttpClient,
  DEFAULT_STD_FEE,
  BigNumber,
  // BigNumber,
} from '@injectivelabs/utils'
import { SigningStargateClient } from '@cosmjs/stargate'
import Long from 'long'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { MsgTransfer } from '@injectivelabs/sdk-ts'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { fromBase64 } from '@cosmjs/encoding'
import { createSignedTx, createTransaction } from '@injectivelabs/injective-tx'
import { CosmosChainId, TestnetCosmosChainId } from '../chains/types'
import { getEndpointFromChainId } from '../chains/endpoints'
import { KeplrWallet } from '../Keplr/KeplrWallet'

const ethereumCurveBasedAddressesPrefixes = ['inj', 'evmos']

export class CosmJsWallet {
  private chainId: string

  private endpoints: { rest: string; rpc: string }

  private keplr: KeplrWallet

  private lcdClient: LcdClient & BankExtension & AuthExtension

  constructor(chainId: string) {
    this.chainId = chainId
    this.keplr = new KeplrWallet(this.chainId)
    this.endpoints = getEndpointFromChainId(
      chainId as TestnetCosmosChainId | CosmosChainId,
    )
    this.lcdClient = LcdClient.withExtensions(
      { apiUrl: this.endpoints.rest },
      setupBankExtension,
      setupAuthExtension,
    )
  }

  async getSigningClient(address: string) {
    const { chainId, endpoints, keplr } = this
    const Keplr = await keplr.getKeplrWallet()

    return new SigningCosmosClient(
      endpoints.rest,
      address,
      Keplr.getOfflineSigner(chainId),
    )
  }

  async getSigningStargateClient() {
    const { chainId, keplr, endpoints } = this
    const Keplr = await keplr.getKeplrWallet()

    return SigningStargateClient.connectWithSigner(
      endpoints.rpc,
      await Keplr.getOfflineSignerAuto(chainId),
    )
  }

  async fetchBalance({ address, denom }: { address: string; denom?: string }) {
    const { lcdClient } = this
    const { result } = await lcdClient.bank.balances(address)

    if (!denom) {
      return result
    }

    const balance = result.find((balance) => balance.denom === denom)

    if (!balance) {
      return {
        amount: '0',
        denom,
      }
    }

    return balance
  }

  async fetchAccountDetails(address: string) {
    const { lcdClient } = this
    const isEthereumCurveBasedAddressPrefix =
      ethereumCurveBasedAddressesPrefixes.some((word) =>
        address.startsWith(word),
      )

    if (!isEthereumCurveBasedAddressPrefix) {
      const { result } = await lcdClient.auth.account(address)

      return result.value
    }

    const client = new HttpClient(this.endpoints.rest)
    const response = (await client.get(`/auth/accounts/${address}`)) as {
      data: any
    }

    return response.data.result
  }

  async fetchLatestBlock() {
    const { lcdClient } = this
    const { block } = await lcdClient.blocksLatest()

    return { ...block }
  }

  async fetchNodeInfo(): Promise<{
    nodeInfo: NodeInfoResponse['node_info']
    applicationVersion: NodeInfoResponse['application_version']
  }> {
    const { lcdClient } = this
    const { node_info: nodeInfo, application_version: applicationVersion } =
      (await lcdClient.nodeInfo()) as NodeInfoResponse

    return { nodeInfo, applicationVersion }
  }

  async signRawTransaction({
    message,
    address,
    fee,
    memo = '',
  }: {
    message: {
      type: string
      value: any
    }
    fee: StdFee
    address: string
    memo?: string
  }): Promise<DirectSignResponse> {
    const { chainId, keplr } = this
    const Keplr = await keplr.getKeplrWallet()
    const key = await Keplr.getKey(chainId)
    const accountDetails = await this.fetchAccountDetails(key.bech32Address)

    const baseAccount = accountDetails.base_account || accountDetails
    const { signDirect: signDirectTx } = createTransaction({
      message,
      memo,
      fee,
      chainId,
      pubKey: Buffer.from(key.pubKey).toString('base64'),
      sequence: parseInt(
        baseAccount.sequence ? baseAccount.sequence.toString() : 0,
        10,
      ),
      accountNumber: parseInt(
        baseAccount.account_number ? baseAccount.account_number.toString() : 0,
        10,
      ),
    })

    return this.signTransactionDirect({
      address,
      signTx: signDirectTx,
    })
  }

  async broadcastRawTransaction(
    signResponse: DirectSignResponse,
  ): Promise<string> {
    const rawTx = createSignedTx(signResponse)
    const { chainId, keplr } = this
    const Keplr = await keplr.getKeplrWallet()

    try {
      return Buffer.from(
        await Keplr.sendTx(
          chainId,
          rawTx.serializeBinary(),
          BroadcastMode.Sync,
        ),
      ).toString('hex')
    } catch (e) {
      throw new Error((e as any).message)
    }
  }

  async sendIbcTokens({
    senderAddress,
    recipientAddress,
    transferAmount,
    sourcePort,
    sourceChannel,
    fee,
    timeoutHeight,
    timeoutTimestamp,
    memo = '',
  }: {
    senderAddress: string
    recipientAddress: string
    transferAmount: Coin
    sourcePort: string
    sourceChannel: string
    timeoutHeight?: Height
    timeoutTimestamp?: number
    fee?: StdFee
    memo?: string
  }) {
    const timeoutTimestampInMs = 300 * 1000
    const now = new Date()
    const timestamp = new Date(now.getTime() + timeoutTimestampInMs)
    const actualTimeoutTimestamp =
      (timeoutTimestamp || timestamp.getTime()) * 1e6

    if (
      ethereumCurveBasedAddressesPrefixes.some((prefix) =>
        senderAddress.startsWith(prefix),
      )
    ) {
      const latestBlock = await this.fetchLatestBlock()
      const ibcMessage = MsgTransfer.fromJSON({
        channelId: sourceChannel,
        port: sourcePort,
        timeout: actualTimeoutTimestamp,
        height: {
          revisionHeight: new BigNumber(latestBlock.header.height)
            .plus(100)
            .toNumber(),
          revisionNumber: new BigNumber(
            latestBlock.header.version.block,
          ).toNumber(),
        },
        sender: senderAddress,
        receiver: recipientAddress,
        amount: {
          denom: transferAmount.denom,
          amount: transferAmount.amount,
        },
      })

      const message = ibcMessage.toDirectSign()

      try {
        const signResponse = await this.signRawTransaction({
          message: {
            type: message.type,
            value: message.message,
          },
          memo,
          address: senderAddress,
          fee: fee || DEFAULT_STD_FEE,
        })
        const { signature, signed } = signResponse

        const txRaw = TxRaw.fromPartial({
          bodyBytes: signed.bodyBytes,
          authInfoBytes: signed.authInfoBytes,
          signatures: [fromBase64(signature.signature)],
        })

        return await (
          await this.getSigningStargateClient()
        ).broadcastTx(TxRaw.encode(txRaw).finish(), timeoutTimestampInMs)
      } catch (e) {
        throw new Error(e as any)
      }
    }

    return (await this.getSigningStargateClient()).sendIbcTokens(
      senderAddress,
      recipientAddress,
      transferAmount,
      sourcePort,
      sourceChannel,
      timeoutHeight,
      actualTimeoutTimestamp,
      {
        amount: [
          {
            denom: transferAmount.denom,
            amount: DEFAULT_GAS_PRICE.toString(),
          },
        ],
        gas: DEFAULT_GAS_LIMIT.toString(),
      },
      memo,
    )
  }

  async signAndBroadcast({
    address,
    fee,
    message,
    memo = '',
  }: {
    message: AminoMsg
    address: string
    memo?: string
    fee: {
      gas: string
      amount: {
        amount: string
        denom: string
      }[]
    }
  }) {
    return (await this.getSigningClient(address)).signAndBroadcast(
      [message],
      fee,
      memo,
    )
  }

  private async signTransactionDirect({
    address,
    signTx,
  }: {
    address: string
    signTx: {
      bodyBytes?: Uint8Array | null
      authInfoBytes?: Uint8Array | null
      chainId?: string | null
      accountNumber?: Long | null
    }
  }) {
    const { chainId, keplr } = this
    const Keplr = await keplr.getKeplrWallet()

    try {
      return await Keplr.signDirect(chainId, address, signTx)
    } catch (e) {
      throw new Error((e as any).message)
    }
  }
}
