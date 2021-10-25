import { AminoMsg } from '@cosmjs/amino'
import {
  SigningCosmosClient,
  LcdClient,
  setupBankExtension,
} from '@cosmjs/launchpad'
import { CosmosChainId, TestnetCosmosChainId } from './types'
import { getLcdEndpointFromChainId } from './endpoints'
import { KeplrWallet } from './KeplrWallet'

export class CosmJsWallet {
  private chainId: string

  private endpoints: { rest: string; rpc: string }

  private keplr: KeplrWallet

  private lcdClient

  constructor(chainId: string) {
    this.chainId = chainId
    this.keplr = new KeplrWallet(this.chainId)
    this.endpoints = getLcdEndpointFromChainId(
      chainId as TestnetCosmosChainId | CosmosChainId,
    )
    this.lcdClient = LcdClient.withExtensions(
      { apiUrl: this.endpoints.rest },
      setupBankExtension,
    )
  }

  async getSigningClient(address: string) {
    const { chainId, endpoints, keplr } = this
    const Keplr = await keplr.getKeplrWallet()

    return new SigningCosmosClient(
      endpoints.rest,
      address,
      Keplr.getOfflineSignerOnlyAmino(chainId),
    )
  }

  async getBalance({ address, denom }: { address: string; denom?: string }) {
    const { lcdClient } = this
    const { result } = await lcdClient.bank.balances(address)

    if (!denom) {
      return result
    }

    const balance = result.find((balance) => balance.denom === denom)

    if (!balance) {
      throw new Error(`Balance for ${denom} denom not found`)
    }

    return balance
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
}
