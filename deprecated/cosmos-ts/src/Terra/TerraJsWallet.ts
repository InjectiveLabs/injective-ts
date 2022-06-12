import { MsgTransfer, Coin, LCDClient, Fee, Int } from '@terra-money/terra.js'
import {
  ConnectType,
  getChainOptions,
  NetworkInfo,
  WalletController,
  WalletInfo,
  WalletStatus,
} from '@terra-money/wallet-controller'
import { Height } from '@terra-money/terra.js/dist/core/ibc/msgs/client/Height'
import { BigNumberInBase, DEFAULT_GAS_LIMIT, sleep } from '@injectivelabs/utils'
import { firstValueFrom } from 'rxjs'

export class TerraJsWallet {
  private walletController?: WalletController

  static isTerraExtensionAvailable(): boolean {
    return window.isTerraExtensionAvailable
  }

  async getWalletController(): Promise<WalletController> {
    if (!this.walletController) {
      const options = await getChainOptions()

      this.walletController = new WalletController({
        ...options,
        waitingChromeExtensionInstallCheck: 3 * 1000,
      })
    }

    return this.walletController
  }

  async connect(): Promise<void> {
    const controller = await this.getWalletController()

    const extensionIsEnabled =
      await this.extensionConnectTypeIsInAvailableConnectTypes()

    if (!extensionIsEnabled) {
      throw new Error('Extension connect type is not available')
    }

    try {
      controller.connect(ConnectType.EXTENSION)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async getAddresses(): Promise<string[]> {
    const wallets = await this.getWallets()

    if (!wallets) {
      throw new Error('There are no wallets connected on Terra Extension')
    }

    return wallets.map((wallet) => wallet.terraAddress)
  }

  async fetchBalances({
    address,
    denom,
  }: {
    address: string
    denom?: string
  }): Promise<{ denom: string; amount: string }[]> {
    const networkInfo = await this.getNetwork()

    if (!networkInfo) {
      throw new Error('We could not fetch network info from Terra Extension')
    }

    const lcdClient = new LCDClient({
      URL: networkInfo.lcd,
      chainID: networkInfo.chainID,
    })

    const [coins] = await lcdClient.bank.balance(address)
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
    timeoutTimestamp,
  }: {
    senderAddress: string
    recipientAddress: string
    transferAmount: any
    sourcePort: string
    sourceChannel: string
    timeoutTimestamp: number
  }) {
    let responseHeight
    try {
      const networkInfo = await this.getNetwork()

      if (!networkInfo) {
        throw new Error('We could not fetch network info from Terra Extension')
      }

      const lcdClient = new LCDClient({
        URL: networkInfo.lcd,
        chainID: networkInfo.chainID,
      })
      const { height } = (await lcdClient.apiRequester.get(
        `ibc/core/channel/v1/channels/${sourceChannel}/ports/transfer/packet_commitments`,
      )) as any
      responseHeight = height
    } catch (e) {
      throw new Error('We could not fetch network info from Terra Extension')
    }

    const decimalPlaces = 6
    const gasPrice = new BigNumberInBase(
      transferAmount.denom === 'uluna' ? 0.00506 : 0.15,
    ).toWei(decimalPlaces)
    const fee = new Fee(DEFAULT_GAS_LIMIT, `${gasPrice}${transferAmount.denom}`)
    const coin = new Coin(transferAmount.denom, new Int(transferAmount.amount))

    const timeoutBlocks = 40
    const height = new Height(
      parseInt(responseHeight.revision_number as string, 10),
      parseInt(responseHeight.revision_height as string, 10) + timeoutBlocks,
    )

    const msgTransfer = new MsgTransfer(
      sourcePort,
      sourceChannel,
      coin,
      senderAddress,
      recipientAddress,
      height,
      timeoutTimestamp * 1_000_000_000 /* Has to be in nano seconds */,
    )

    try {
      const controller = await this.getWalletController()
      const response = await controller.post(
        {
          fee,
          msgs: [msgTransfer],
          memo: '',
        },
        senderAddress,
      )

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  private async getWallets(): Promise<WalletInfo[] | undefined> {
    const controller = await this.getWalletController()
    const PROMISE_RETRIES = Array.from(Array(15).keys())
    const INTERVAL_TO_RETRY = 1000

    for (const _ of PROMISE_RETRIES) {
      const states = await firstValueFrom(controller.states())

      if (states.status === WalletStatus.WALLET_CONNECTED) {
        return states.wallets
      }

      await sleep(INTERVAL_TO_RETRY)
    }

    return undefined
  }

  private async getNetwork(): Promise<NetworkInfo | undefined> {
    const controller = await this.getWalletController()
    const PROMISE_RETRIES = Array.from(Array(3).keys())
    const INTERVAL_TO_RETRY = 1000

    for (const _ of PROMISE_RETRIES) {
      const states = await firstValueFrom(controller.states())

      if (states.status === WalletStatus.WALLET_CONNECTED) {
        return states.network
      }

      await sleep(INTERVAL_TO_RETRY)
    }

    return undefined
  }

  private async extensionConnectTypeIsInAvailableConnectTypes(): Promise<boolean> {
    const controller = await this.getWalletController()
    const PROMISE_RETRIES = Array.from(Array(3).keys())
    const INTERVAL_TO_RETRY = 1000

    for (const _ of PROMISE_RETRIES) {
      const connectTypes = await firstValueFrom(
        controller.availableConnectTypes(),
      )

      if (connectTypes.includes(ConnectType.EXTENSION)) {
        return true
      }

      await sleep(INTERVAL_TO_RETRY)
    }

    return false
  }
}
