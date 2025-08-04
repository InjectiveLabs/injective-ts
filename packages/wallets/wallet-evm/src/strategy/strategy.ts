/* eslint-disable class-methods-use-this */
import { isEvmBrowserWallet } from '@injectivelabs/wallet-base'
import {
  TxRaw,
  toUtf8,
  TxGrpcApi,
  TxResponse,
  isServerSide,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts'
import {
  ErrorType,
  ErrorContext,
  WalletException,
  ThrownException,
  BitGetException,
  MetamaskException,
  OkxWalletException,
  UnspecifiedErrorCode,
  TransactionException,
  TrustWalletException,
  RainbowWalletException,
} from '@injectivelabs/exceptions'
import {
  Wallet,
  StdSignDoc,
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
  BaseConcreteStrategy,
  SendTransactionOptions,
  BrowserEip1993Provider,
  ConcreteWalletStrategy,
  ConcreteWalletStrategyArgs,
  EIP6963AnnounceProviderEvent,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import { sleep, capitalize } from '@injectivelabs/utils'
import { AccountAddress, EvmChainId } from '@injectivelabs/ts-types'
import {
  getBitGetProvider,
  getPhantomProvider,
  getRainbowProvider,
  getMetamaskProvider,
  getOkxWalletProvider,
  getTrustWalletProvider,
} from './utils/index.js'

export class EvmWallet
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public wallet?: Wallet
  public evmProviders: Partial<Record<Wallet, BrowserEip1993Provider>> = {}

  constructor(
    args: (ConcreteWalletStrategyArgs | ConcreteEvmWalletStrategyArgs) & {
      wallet: Wallet
    },
  ) {
    super(args)

    if (!isEvmBrowserWallet(args.wallet)) {
      throw new WalletException(
        new Error(
          `Evm Wallet for ${capitalize(args.wallet)} is not supported.`,
        ),
      )
    }

    if (!isServerSide()) {
      window.addEventListener(
        'eip6963:announceProvider',
        (announcement: any) => {
          const event = announcement as unknown as EIP6963AnnounceProviderEvent
          const walletName = event.detail.info.name.toLowerCase()

          if (walletName === Wallet.Metamask.toLowerCase()) {
            this.evmProviders[Wallet.Metamask] = event.detail.provider
          }

          if (walletName === Wallet.Rainbow.toLowerCase()) {
            this.evmProviders[Wallet.Rainbow] = event.detail.provider
          }

          if (walletName === Wallet.Phantom.toLowerCase()) {
            this.evmProviders[Wallet.Phantom] = event.detail.provider
          }

          if (walletName === Wallet.OkxWallet.toLowerCase()) {
            this.evmProviders[Wallet.OkxWallet] = event.detail.provider
          }

          if (walletName === Wallet.BitGet.toLowerCase()) {
            this.evmProviders[Wallet.BitGet] = event.detail.provider
          }

          if (walletName === Wallet.TrustWallet.toLowerCase()) {
            this.evmProviders[Wallet.TrustWallet] = event.detail.provider
          }
        },
      )
      window.dispatchEvent(new Event('eip6963:requestProvider'))
    }

    this.wallet = args.wallet
  }

  public EvmWalletException(
    error: Error,
    context?: ErrorContext,
  ): ThrownException {
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

    if (this.wallet === Wallet.Rainbow) {
      return new RainbowWalletException(error, context)
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
      return (await ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[]
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

  async sendEvmTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; evmChainId: EvmChainId },
  ): Promise<string> {
    const ethereum = await this.getEthereum()

    try {
      return (await ethereum.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      })) as string
    } catch (e: unknown) {
      throw this.EvmWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEvmTransaction,
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

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const ethereum = await this.getEthereum()

    try {
      return (await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [address, eip712json],
      })) as string
    } catch (e: unknown) {
      if (
        (e as any).message.includes(
          'Ledger: The signature doesnt match the right address',
        )
      ) {
        throw new MetamaskException(
          new Error(
            'Please connect directly with Ledger to sign this transaction',
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
            contextModule: WalletAction.SignTransaction,
          },
        )
      }

      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async signAminoCosmosTransaction(_transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
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

      return signature as string
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
      return ethereum.request({ method: 'eth_chainId' }) as Promise<string>
    } catch (e: unknown) {
      throw this.EvmWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  async getEvmTransactionReceipt(txHash: string): Promise<string> {
    const ethereum = await this.getEthereum()

    const interval = 1000
    const transactionReceiptRetry = async () => {
      const receipt = (await ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash],
      })) as string

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
        contextModule: WalletAction.GetEvmTransactionReceipt,
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
    callback: (account: AccountAddress | string[]) => void,
  ): Promise<void> {
    const ethereum = await this.getEthereum()

    this.listeners = {
      [WalletEventListener.AccountChange]: callback,
    }

    ethereum.on('accountsChanged', callback)
  }

  private async getEthereum(): Promise<BrowserEip1993Provider> {
    const evmProvider = this.evmProviders[this.wallet as Wallet]

    if (evmProvider) {
      return evmProvider
    }

    const backUpProvider =
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
        : this.wallet === Wallet.Rainbow
        ? await getRainbowProvider()
        : undefined

    if (!backUpProvider) {
      throw this.EvmWalletException(
        new Error(`Please install the ${this.wallet} wallet extension.`),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    return backUpProvider
  }
}
