import {
  Extension,
  Wallet,
  Dec,
  MsgTransfer,
  Coin,
  LCDClient,
} from '@terra-money/terra.js'
import { Height } from '@terra-money/terra.js/dist/core/ibc/msgs/client/Height'

export class TerraJsWallet {
  private extension: Extension

  private lcdClient: LCDClient

  constructor({
    restEndpoint,
    chainId,
  }: {
    restEndpoint: string
    chainId: string
  }) {
    this.extension = new Extension()
    this.lcdClient = new LCDClient({
      URL: restEndpoint,
      chainID: chainId,
    })
  }

  static isTerraExtensionAvailable(): boolean {
    return window.isTerraExtensionAvailable
  }

  async connect(): Promise<Wallet> {
    await this.extension.request('connect')

    return new Promise((resolve) => {
      this.extension.on('connect', (w: Wallet) => {
        resolve(w)
      })
    })
  }

  async connectWithRequest(): Promise<string> {
    const response = await this.extension.request('connect')

    return (response.payload as { address: string }).address
  }

  async fetchBalances({
    address,
    denom,
  }: {
    address: string
    denom?: string
  }): Promise<{ denom: string; amount: string }[]> {
    const [coins] = await this.lcdClient.bank.balance(address)
    const balances = coins.toArray()

    if (balances.length === 0) {
      return []
    }

    if (denom) {
      const balance = balances.find(
        (balance) => balance.denom.toLowerCase() === denom.toLowerCase(),
      )

      if (!balance) {
        throw new Error(`No balance found for ${denom}`)
      }

      return [{ denom: balance.denom, amount: balance.amount.toString() }]
    }

    return balances.map((balance) => ({
      denom: balance.denom,
      amount: balance.amount.toString(),
    }))
  }

  async sendIbcTokens({
    senderAddress,
    recipientAddress,
    transferAmount,
    sourcePort,
    sourceChannel,
    timeoutHeight,
    timeoutTimestamp,
  }: {
    senderAddress: string
    recipientAddress: string
    transferAmount: any
    sourcePort: string
    sourceChannel: string
    timeoutHeight: any
    timeoutTimestamp: number
  }) {
    const amount = new Dec(transferAmount.amount)
    const coin = new Coin(transferAmount.denom, amount)
    const height = new Height(
      timeoutHeight?.revision_height,
      timeoutHeight?.revision_height,
    )
    const msgTransfer = new MsgTransfer(
      sourcePort,
      sourceChannel,
      coin,
      senderAddress,
      recipientAddress,
      height,
      timeoutTimestamp,
    )

    try {
      const response = await this.extension.request('post', {
        msgs: [msgTransfer.toJSON()],
        purgeQueue: true,
      })

      return response.payload
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
