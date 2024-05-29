/* eslint-disable class-methods-use-this */
import { sleep } from '@injectivelabs/utils'
import {
  AccountAddress,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import {
  ErrorType,
  MetamaskException,
  TransactionException,
  UnspecifiedErrorCode,
  WalletException,
} from '@injectivelabs/exceptions'
import TorusWallet from '@toruslabs/torus-embed'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { TxGrpcApi, TxRaw, TxResponse, toUtf8 } from '@injectivelabs/sdk-ts'
import { ConcreteWalletStrategy, EthereumWalletStrategyArgs } from '../../types'
import BaseConcreteStrategy from './Base'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { SendTransactionOptions } from '../types'

export const getNetworkFromChainId = (
  chainId: EthereumChainId,
): { host: string; networkName: string } => {
  if (chainId === EthereumChainId.Goerli) {
    return {
      host: 'goerli',
      networkName: 'Goerli Test Network',
    }
  }

  if (chainId === EthereumChainId.Sepolia) {
    return {
      host: 'sepolia',
      networkName: 'Sepolia Test Network',
    }
  }

  if (chainId === EthereumChainId.Kovan) {
    return {
      host: 'kovan',
      networkName: 'Kovan Test Network',
    }
  }

  return {
    host: 'mainnet',
    networkName: 'Main Ethereum Network',
  }
}

export default class Torus extends BaseConcreteStrategy implements ConcreteWalletStrategy {
  private torus: TorusWallet

  private connected = false

  constructor(args: EthereumWalletStrategyArgs) {
    super(args)
    this.torus = new TorusWallet()
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(): Promise<boolean> {
    return Promise.resolve(true)
  }

  async connect(): Promise<void> {
    const { connected, torus, ethereumChainId } = this

    if (connected) {
      return
    }

    if (!ethereumChainId) {
      throw new WalletException(new Error('Please provide Ethereum chainId'))
    }

    await torus.init({
      buildEnv: 'production',
      network: {
        chainId: ethereumChainId,
        ...getNetworkFromChainId(ethereumChainId),
      },
      showTorusButton: false,
    })

    await this.torus.login()

    this.connected = true
  }

  async getAddresses(): Promise<string[]> {
    await this.connect()

    try {
      const accounts = await this.torus.ethereum.request<string[]>({
        method: 'eth_requestAccounts',
      })

      return accounts && accounts.length > 0 ? (accounts as string[]) : []
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
    await this.connect()

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
    await this.connect()

    try {
      const response = await this.torus.ethereum.request<string>({
        method: 'eth_sendTransaction',
        params: [transaction],
      })

      return response || ''
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
          'You have to pass endpoints.grpc within the options for using Ethereum native wallets',
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
    await this.connect()

    try {
      const response = await this.torus.ethereum.request<string>({
        method: 'eth_signTypedData_v4',
        params: [address, eip712json],
      })

      return response || ''
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async signArbitrary(
    signer: AccountAddress,
    data: string | Uint8Array,
  ): Promise<string> {
    await this.connect()

    try {
      const signature = await this.torus.ethereum.request<string>({
        method: 'personal_sign',
        params: [toUtf8(data), signer],
      })

      if (!signature) {
        throw new WalletException(new Error('No signature returned'))
      }

      return signature
    } catch (e: unknown) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignArbitrary,
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

  async getEthereumChainId(): Promise<string> {
    await this.connect()

    try {
      const response = await this.torus.ethereum.request<string>({
        method: 'eth_chainId',
      })

      return response || ''
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  async getEthereumTransactionReceipt(txHash: string): Promise<string> {
    await this.connect()

    const interval = 1000
    const transactionReceiptRetry = async () => {
      const receipt = await this.torus.ethereum.request<string>({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      })

      if (!receipt) {
        await sleep(interval)
        await transactionReceiptRetry()
      }

      return receipt as string
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

  onChainIdChanged(_callback: () => void): void {
    //
  }

  onAccountChange(_callback: (account: AccountAddress) => void): void {
    //
  }

  cancelOnChainIdChange(): void {
    //
  }

  cancelOnAccountChange(): void {
    //
  }

  cancelAllEvents(): void {
    //
  }
}
