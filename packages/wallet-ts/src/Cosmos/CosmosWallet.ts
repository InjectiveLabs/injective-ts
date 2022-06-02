import { SigningStargateClient } from '@cosmjs/stargate'
import type {
  OfflineDirectSigner,
  DirectSignResponse,
} from '@cosmjs/proto-signing'
import { HttpClient } from '@injectivelabs/utils'
import { Coin } from '@injectivelabs/ts-types'
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import {
  AccountDetails,
  AccountRestResponse,
  BankBalancesRestResponse,
  BlockLatestRestResponse,
  NodeInfoRestResponse,
} from '../types/lcd'
import { createTransaction } from '../transaction'

export class CosmJsWallet {
  private rest: string

  private rpc: string

  private signer: OfflineDirectSigner

  private client: HttpClient

  constructor({
    rpc,
    rest,
    signer,
  }: {
    chainId: string
    rpc: string
    rest: string
    signer: OfflineDirectSigner
  }) {
    this.rpc = rpc
    this.signer = signer
    this.rest = rest
    this.client = new HttpClient(this.rest)
  }

  async getSigningStargateClient() {
    const { rpc, signer } = this

    return SigningStargateClient.connectWithSigner(rpc, signer)
  }

  async fetchBalance({ address, denom }: { address: string; denom?: string }) {
    const { client } = this
    const { data } = (await client.get(
      `cosmos/bank/v1beta1/balances/${address}`,
    )) as { data: BankBalancesRestResponse }

    if (!denom) {
      return data.balances
    }

    const balance = data.balances.find((balance) => balance.denom === denom)

    if (!balance) {
      return {
        amount: '0',
        denom,
      }
    }

    return balance
  }

  async fetchAccountDetails(address: string): Promise<AccountDetails> {
    const { client } = this

    /**
     * Injective has different response than the rest of the
     * cosmos chains when querying the auth account endpoint
     * */
    const isInjectiveAddress = address.startsWith('inj')
    const path = isInjectiveAddress
      ? 'auth/accounts'
      : 'cosmos/auth/v1beta1/accounts'

    const { data } = (await client.get(`${path}/${address}`)) as {
      data: AccountRestResponse
    }
    const { base_account: baseAccount } = data.account

    return {
      address: baseAccount.address,
      accountNumber: baseAccount.account_number,
      sequence: baseAccount.sequence,
      pubKey: {
        type: baseAccount.pub_key['@type'],
        key: baseAccount.pub_key.key,
      },
    } as AccountDetails
  }

  async fetchLatestBlock(): Promise<BlockLatestRestResponse['block']> {
    const { client } = this
    const { data } = (await client.get(
      `cosmos/base/tendermint/v1beta1/blocks/latest`,
    )) as { data: BlockLatestRestResponse }

    return data.block
  }

  async fetchNodeInfo(): Promise<{
    nodeInfo: NodeInfoRestResponse['default_node_info']
    applicationVersion: NodeInfoRestResponse['application_version']
  }> {
    const { client } = this
    const { data } = (await client.get(
      `cosmos/base/tendermint/v1beta1/node_info`,
    )) as { data: NodeInfoRestResponse }

    return {
      nodeInfo: data.default_node_info,
      applicationVersion: data.application_version,
    }
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
    const accountDetails = await this.fetchAccountDetails(address)
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
}
