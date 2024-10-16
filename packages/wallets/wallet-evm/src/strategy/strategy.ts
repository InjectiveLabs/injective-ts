/* eslint-disable class-methods-use-this */
import {
  ErrorType,
  ErrorContext,
  WalletException,
  BitGetException,
  ConcreteException,
  MetamaskException,
  OkxWalletException,
  UnspecifiedErrorCode,
  TransactionException,
  TrustWalletException,
} from '@injectivelabs/exceptions'
import {
  Wallet,
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
  BaseConcreteStrategy,
  SendTransactionOptions,
  BrowserEip1993Provider,
  ConcreteWalletStrategy,
  ConcreteWalletStrategyArgs,
  ConcreteEthereumWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import { sleep } from '@injectivelabs/utils'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import { TxRaw, toUtf8, TxGrpcApi, TxResponse } from '@injectivelabs/sdk-ts'
import {
  getBitGetProvider,
  getPhantomProvider,
  getMetamaskProvider,
  getOkxWalletProvider,
  getTrustWalletProvider,
} from './utils'

const evmWallets = [
  Wallet.BitGet,
  Wallet.Phantom,
  Wallet.Metamask,
  Wallet.OkxWallet,
  Wallet.TrustWallet,
]

export class EvmWallet
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public wallet?: Wallet

  constructor(
    args: (ConcreteWalletStrategyArgs | ConcreteEthereumWalletStrategyArgs) & {
      wallet: Wallet
    },
  ) {
    super(args)

    console.log('EvmWallet.constructor args:', args)

    if (!evmWallets.includes(args.wallet)) {
      throw new WalletException(
        new Error(`Evm Wallet for ${args.wallet} is not supported.`),
      )
    }

    this.wallet = args.wallet
  }

  public EvmWalletException(
    error: Error,
    context?: ErrorContext,
  ): ConcreteException {
    if (this.wallet === Wallet.Metamask) {
      return new MetamaskException(error, context)
    }

    if (this.wallet === Wallet.BitGet) {
      return new BitGetException(error, context)
    }

    if (this.wallet === Wallet.OkxWallet) {
      return new OkxWalletException(error, context)
    }

    if (this.wallet === Wallet.Phantom) {
      return new MetamaskException(error, context)
    }

    if (this.wallet === Wallet.TrustWallet) {
      return new TrustWalletException(error, context)
    }

    return new WalletException(error, context)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(): Promise<boolean> {
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
      throw this.EvmWalletException(new Error((e as any).message), {
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
      throw this.EvmWalletException(new Error((e as any).message), {
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
        contextModule: WalletAction.SignTransaction,
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
        contextModule: WalletAction.SignTransaction,
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
      throw this.EvmWalletException(new Error((e as any).message), {
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
      throw this.EvmWalletException(new Error((e as any).message), {
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
      throw this.EvmWalletException(new Error((e as any).message), {
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

    this.listeners = {
      [WalletEventListener.AccountChange]: callback,
    }

    ethereum.on('accountsChanged', callback)
  }

  private async getEthereum(): Promise<BrowserEip1993Provider> {
    const provider =
      this.wallet === Wallet.Metamask
        ? await getMetamaskProvider()
        : this.wallet === Wallet.Phantom
        ? await getPhantomProvider()
        : this.wallet === Wallet.BitGet
        ? await getBitGetProvider()
        : this.wallet === Wallet.OkxWallet
        ? await getOkxWalletProvider()
        : this.wallet === Wallet.TrustWallet
        ? await getTrustWalletProvider()
        : undefined

    if (!provider) {
      throw this.EvmWalletException(
        new Error(`Please install the ${this.wallet} wallet extension.`),
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
