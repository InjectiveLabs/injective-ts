import type {
  OfflineDirectSigner,
  DirectSignResponse,
} from '@cosmjs/proto-signing'
import { StargateClient, DeliverTxResponse } from '@cosmjs/stargate'
import { Coin } from '@injectivelabs/ts-types'
import { SignDoc, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { DEFAULT_TIMESTAMP_TIMEOUT_MS } from '@injectivelabs/utils'
import { SigningCosmosClient } from '@cosmjs/launchpad'
import { fromBase64 } from '@cosmjs/encoding'
import { createSignedTx, createTransaction } from '../transaction'
import { CosmosQuery } from './CosmosQuery'

export class CosmosWallet {
  public query: CosmosQuery

  private rest: string

  private rpc: string

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
    pubKey?: string
    chainId: string
    address: string
    memo?: string
  }): Promise<{
    txRaw: TxRaw
    signature: string
    directSignResponse: DirectSignResponse
  }> {
    const { signer } = this
    const accountDetails = await this.query.fetchAccountDetails(address)
    const { authInfoBytes, bodyBytes, accountNumber } = createTransaction({
      fee,
      memo,
      message,
      chainId,
      pubKey:
        pubKey || Buffer.from(accountDetails.pubKey.key).toString('base64'),
      sequence: parseInt(accountDetails.sequence.toString(), 10),
      accountNumber: parseInt(accountDetails.accountNumber.toString(), 10),
    })
    const cosmosSignDoc = SignDoc.fromPartial({
      bodyBytes,
      authInfoBytes,
      chainId,
      accountNumber,
    })

    const response = await signer.signDirect(address, cosmosSignDoc)

    const txRaw = TxRaw.fromPartial({
      bodyBytes: response.signed.bodyBytes,
      authInfoBytes: response.signed.authInfoBytes,
      signatures: [fromBase64(response.signature.signature)],
    })

    return {
      txRaw,
      directSignResponse: response,
      signature: response.signature.signature,
    }
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
