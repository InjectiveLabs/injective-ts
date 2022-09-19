/* eslint-disable class-methods-use-this */
import { sleep } from '@injectivelabs/utils'
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import Web3 from 'web3'
import TorusWallet from '@toruslabs/torus-embed'
import { ConcreteWalletStrategy } from '../types'
import BaseConcreteStrategy from './Base'

export const getNetworkFromChainId = (
  chainId: EthereumChainId,
): { host: string; networkName: string } => {
  if (chainId === EthereumChainId.Goerli) {
    return {
      host: 'goerli',
      networkName: 'Goerli Test Network',
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

export default class Torus
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private torus: TorusWallet

  private connected = false

  constructor(args: {
    chainId: ChainId
    ethereumChainId: EthereumChainId
    web3: Web3
  }) {
    super(args)
    this.torus = new TorusWallet()
  }

  async connect(): Promise<void> {
    const { connected, torus, ethereumChainId } = this

    if (connected) {
      return
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
    } catch (e: any) {
      throw new Web3Exception(`Metamask: ${e.message}`)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async confirm(address: AccountAddress): Promise<string> {
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
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async sendTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    throw new Error(
      'sendTransaction is not supported. Trezor only supports sending transaction to Ethereum',
    )
  }

  /**
   * When using Ethereum based wallets, the cosmos transaction
   * is being converted to EIP712 and then sent for signing
   */
  async signTransaction(
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
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  async getNetworkId(): Promise<string> {
    await this.connect()

    try {
      const response = await this.torus.ethereum.request<string>({
        method: 'net_version',
      })

      return response || ''
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
  }

  async getChainId(): Promise<string> {
    await this.connect()

    try {
      const response = await this.torus.ethereum.request<string>({
        method: 'eth_chainId',
      })

      return response || ''
    } catch (e: any) {
      throw new Web3Exception(e.message)
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
    } catch (e: any) {
      throw new Web3Exception(e.message)
    }
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
