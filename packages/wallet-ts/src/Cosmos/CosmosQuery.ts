import { HttpClient } from '@injectivelabs/utils'
import {
  AccountDetails,
  AccountRestResponse,
  BankBalancesRestResponse,
  BlockLatestRestResponse,
  InjectiveAccountRestResponse,
  NodeInfoRestResponse,
} from './types'

export class CosmosQuery {
  private rest: string

  // @ts-ignore
  private rpc: string

  private client: HttpClient

  constructor({ rpc, rest }: { rpc: string; rest: string }) {
    this.rpc = rpc
    this.rest = rest
    this.client = new HttpClient(this.rest)
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

    try {
      /**
       * Injective has different response than the rest of the
       * cosmos chains when querying the auth account endpoint
       * */
      const isInjectiveAddress =
        address.startsWith('inj') || address.startsWith('evmos')
      const { data } = (await client.get(
        `cosmos/auth/v1beta1/accounts/${address}`,
      )) as {
        data: AccountRestResponse | InjectiveAccountRestResponse
      }
      const baseAccount = isInjectiveAddress
        ? (data as InjectiveAccountRestResponse).account.base_account
        : (data as AccountRestResponse).account

      return {
        address: baseAccount.address,
        accountNumber: baseAccount.account_number,
        sequence: baseAccount.sequence,
        pubKey: {
          type: baseAccount.pub_key ? baseAccount.pub_key['@type'] : '',
          key: baseAccount.pub_key ? baseAccount.pub_key.key : '',
        },
      } as AccountDetails
    } catch (e) {
      throw new Error((e as any).message)
    }
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
}
