import { isServerSide, sleep } from '@injectivelabs/utils'
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import Web3 from 'web3'
import {
  ErrorType,
  MetamaskException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  ConcreteWalletStrategy,
  Eip1993ProviderWithMetamask,
  WalletAction,
  WindowWithEip1193Provider,
} from '../types'
import BaseConcreteStrategy from './Base'

const $window = (isServerSide()
  ? {}
  : window) as unknown as WindowWithEip1193Provider

export default class Metamask
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private ethereum: Eip1993ProviderWithMetamask

  constructor(args: {
    ethereumChainId: EthereumChainId
    web3: Web3
    chainId: ChainId
  }) {
    super(args)
    this.ethereum = $window.ethereum
  }

  async getAddresses(): Promise<string[]> {
    const ethereum = this.getEthereum()

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
  async confirm(address: AccountAddress): Promise<string> {
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
    const ethereum = this.getEthereum()

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

  // eslint-disable-next-line class-methods-use-this
  async sendTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    throw new MetamaskException(
      new Error(
        'sendTransaction is not supported. Metamask only supports sending transaction to Ethereum',
      ),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      },
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
    const ethereum = this.getEthereum()

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

  async getNetworkId(): Promise<string> {
    const ethereum = this.getEthereum()

    try {
      return ethereum.request({ method: 'net_version' })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetNetworkId,
      })
    }
  }

  async getChainId(): Promise<string> {
    const ethereum = this.getEthereum()

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
    const ethereum = this.getEthereum()

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

  onChainIdChanged(callback: () => void): void {
    const { ethereum } = this

    if (!ethereum) {
      return
    }

    ethereum.on('chainChanged', callback)
  }

  onAccountChange(callback: (account: AccountAddress) => void): void {
    const { ethereum } = this

    if (!ethereum) {
      return
    }

    ethereum.on('accountsChanged', callback)
  }

  cancelOnChainIdChange(): void {
    const { ethereum } = this

    if (ethereum) {
      // ethereum.removeListener('chainChanged', handler)
    }
  }

  cancelOnAccountChange(): void {
    const { ethereum } = this

    if (ethereum) {
      // ethereum.removeListener('chainChanged', handler)
    }
  }

  cancelAllEvents(): void {
    const { ethereum } = this

    if (ethereum) {
      ethereum.removeAllListeners()
    }
  }

  private getEthereum(): Eip1993ProviderWithMetamask {
    const { ethereum } = this

    if (!ethereum) {
      throw new MetamaskException(
        new Error('Please install the Metamask wallet extension.'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    return ethereum
  }
}
