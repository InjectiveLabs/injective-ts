/* eslint-disable class-methods-use-this */
import { sleep } from '@injectivelabs/utils'
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import {
  ErrorType,
  WalletException,
  MetamaskException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { TxRaw, toUtf8, TxGrpcApi, TxResponse } from '@injectivelabs/sdk-ts'
import {
  ConcreteWalletStrategy,
  EthereumWalletStrategyArgs,
} from '../../../types/index.js'
import { BrowserEip1993Provider, SendTransactionOptions } from '../../types.js'
import BaseConcreteStrategy from '../Base.js'
import {
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
} from '../../../../types/enums.js'
import { getPhantomProvider } from './utils.js'

export default class Phantom extends BaseConcreteStrategy implements ConcreteWalletStrategy {
  constructor(args: EthereumWalletStrategyArgs) {
    super(args)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(): Promise<boolean> {
    await this.getAddresses()

    return Promise.resolve(true)
  }

  public async disconnect() {
    if (this.listeners[WalletEventListener.AccountChange]) {
      const ethereum = await this.getEthereum()

      ethereum.removeListener(
        'accountsChanged',
        this.listeners[WalletEventListener.AccountChange],
      )
    }

    if (this.listeners[WalletEventListener.ChainIdChange]) {
      const ethereum = await this.getEthereum()

      ethereum.removeListener(
        'chainChanged',
        this.listeners[WalletEventListener.ChainIdChange],
      )
    }

    this.listeners = {}
  }

  async getAddresses(): Promise<string[]> {
    const ethereum = await this.getEthereum()

    try {
      return await ethereum.request({
        method: 'eth_requestAccounts',
      })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getSessionOrConfirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  async sendEthereumTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    const ethereum = await this.getEthereum()

    try {
      return await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      })
    }
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    const { endpoints, txTimeout } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints within the options for using Ethereum native wallets',
        ),
      )
    }

    const txApi = new TxGrpcApi(endpoints.grpc)
    const response = await txApi.broadcast(transaction, { txTimeout })

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
        contextCode: response.code,
        contextModule: response.codespace,
      })
    }

    return response
  }

  /** @deprecated */
  async signTransaction(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    return this.signEip712TypedData(eip712json, address)
  }

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const ethereum = await this.getEthereum()

    try {
      return await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [address, eip712json],
      })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async signAminoCosmosTransaction(_transaction: {
    signDoc: any
    accountNumber: number
    chainId: string
    address: string
  }): Promise<string> {
    throw new WalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      },
    )
  }

  // eslint-disable-next-line class-methods-use-this
  async signCosmosTransaction(_transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    throw new WalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      },
    )
  }

  async signArbitrary(
    signer: AccountAddress,
    data: string | Uint8Array,
  ): Promise<string> {
    const ethereum = await this.getEthereum()

    try {
      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [toUtf8(data), signer],
      })

      return signature
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignArbitrary,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    const ethereum = await this.getEthereum()

    try {
      return ethereum.request({ method: 'eth_chainId' })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  async getEthereumTransactionReceipt(txHash: string): Promise<string> {
    const ethereum = await this.getEthereum()

    const interval = 1000
    const transactionReceiptRetry = async () => {
      const receipt = await ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      })

      if (!receipt) {
        await sleep(interval)
        await transactionReceiptRetry()
      }

      return receipt
    }

    try {
      return await transactionReceiptRetry()
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetEthereumTransactionReceipt,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
    )
  }

  async onChainIdChanged(callback: (chain: string) => void): Promise<void> {
    const ethereum = await this.getEthereum()

    this.listeners = {
      [WalletEventListener.ChainIdChange]: callback,
    }

    ethereum.on('chainChanged', callback)
  }

  async onAccountChange(
    callback: (account: AccountAddress) => void,
  ): Promise<void> {
    const ethereum = await this.getEthereum()

    const listener = (accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        callback(accounts[0])
      } else {
        this.getAddresses()
          .then((accounts) => {
            callback(accounts[0])
          })
          .catch((_error: any) => {
            //
          })
      }
    }

    this.listeners = {
      [WalletEventListener.AccountChange]: listener,
    }

    ethereum.on('accountsChanged', listener)
  }

  private async getEthereum(): Promise<BrowserEip1993Provider> {
    const provider = await getPhantomProvider()

    if (!provider) {
      throw new MetamaskException(
        new Error('Please install the Phantom wallet extension.'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    return provider
  }
}
