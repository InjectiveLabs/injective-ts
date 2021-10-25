import { AminoMsg, StdFee } from '@cosmjs/amino'
import {
  SigningCosmosClient,
  LcdClient,
  setupBankExtension,
} from '@cosmjs/launchpad'
import { SigningStargateClient } from '@cosmjs/stargate'
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin'
import { Height } from 'cosmjs-types/ibc/core/client/v1/client'
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

  async getSigningStargateClient() {
    const { chainId, keplr, endpoints } = this
    const Keplr = await keplr.getKeplrWallet()

    return SigningStargateClient.connectWithSigner(
      endpoints.rest,
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
      return {
        amount: '0',
        denom,
      }
    }

    return balance
  }

  async sendIbcTokens({
    senderAddress,
    recipientAddress,
    transferAmount,
    sourcePort,
    sourceChannel,
    timeoutHeight,
    timeoutTimestamp,
    fee,
    memo = '',
  }: {
    senderAddress: string
    recipientAddress: string
    transferAmount: Coin
    sourcePort: string
    sourceChannel: string
    timeoutHeight?: Height
    timeoutTimestamp?: number
    fee: StdFee
    memo?: string
  }) {
    return (await this.getSigningStargateClient()).sendIbcTokens(
      senderAddress,
      recipientAddress,
      transferAmount,
      sourcePort,
      sourceChannel,
      timeoutHeight,
      timeoutTimestamp,
      fee,
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
}
