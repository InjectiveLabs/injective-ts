import type {
  OfflineDirectSigner,
  DirectSignResponse,
} from '@cosmjs/proto-signing'
import { StargateClient, DeliverTxResponse } from '@cosmjs/stargate'
import { Coin } from '@injectivelabs/ts-types'
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { DEFAULT_TIMESTAMP_TIMEOUT_MS } from '@injectivelabs/utils'
import { SigningCosmosClient } from '@cosmjs/launchpad'
import { createSignedTx, createTransaction } from '../transaction'
import { CosmosQuery } from './CosmosQuery'

export class CosmosWallet {
  private rest: string

  private rpc: string

  private query: CosmosQuery

  private signer: OfflineDirectSigner

  constructor({
    rpc,
    rest,
    signer,
  }: {
    rpc: string
    rest: string
    signer: OfflineDirectSigner
  }) {
    this.rpc = rpc
    this.rest = rest
    this.signer = signer
    this.query = new CosmosQuery({ rpc, rest })
  }

  async signTransaction({
    message,
    address,
    fee,
    chainId,
    pubKey,
    memo = '',
  }: {
    message: {
      type: string
      message: any
    }
    fee: {
      amount: Coin[]
      gas: string
    }
    chainId: string
    address: string
    pubKey: string /* in base64 */
    memo?: string
  }): Promise<DirectSignResponse> {
    const { signer } = this
    const accountDetails = await this.query.fetchAccountDetails(address)
    const { authInfoBytes, bodyBytes, accountNumber } = createTransaction({
      message,
      memo,
      fee,
      chainId,
      pubKey,
      sequence: parseInt(accountDetails.sequence.toString(), 10),
      accountNumber: parseInt(accountDetails.accountNumber.toString(), 10),
    })
    const cosmosSignDoc = SignDoc.fromPartial({
      bodyBytes,
      authInfoBytes,
      chainId,
      accountNumber,
    })

    return signer.signDirect(address, cosmosSignDoc)
  }

  async broadcastTransaction(
    signResponse: DirectSignResponse,
  ): Promise<DeliverTxResponse> {
    const client = await this.getStargateClient()
    const txRaw = createSignedTx(signResponse)

    return client.broadcastTx(
      txRaw.serializeBinary(),
      DEFAULT_TIMESTAMP_TIMEOUT_MS,
    )
  }

  /**
   * Can be used only for broadcasting transactions for
   * cosmos chains that follow the cosmos conventions for
   * account public key derivation and coin type.
   *
   * For example, for the Injective chain, you should use a combination of
   * signTransaction + broadcastTransaction as it follows the Ethereum conventions
   * for public key derivation and coin type
   */
  async signAndBroadcastTransaction({
    message,
    address,
    fee,
    memo = '',
  }: {
    address: string
    message: {
      type: string
      value: any
    }
    fee: {
      amount: Coin[]
      gas: string
    }
    memo?: string
  }) {
    const signingClient = await this.getStargateSigningClient(address)

    return signingClient.signAndBroadcast([message], fee, memo)
  }

  private async getStargateClient() {
    const { rpc } = this

    return StargateClient.connect(rpc)
  }

  private async getStargateSigningClient(address: string) {
    const { signer, rest } = this

    return new SigningCosmosClient(rest, address, signer as any)
  }
}
