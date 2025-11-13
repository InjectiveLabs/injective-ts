import { sleep, capitalize } from '@injectivelabs/utils'
import {
  toUtf8,
  TxGrpcApi,
  isServerSide,
  uint8ArrayToHex,
  stringToUint8Array,
} from '@injectivelabs/sdk-ts'
import {
  Wallet,
  WalletAction,
  WalletDeviceType,
  getEvmChainConfig,
  isEvmBrowserWallet,
  WalletEventListener,
  BaseConcreteStrategy,
} from '@injectivelabs/wallet-base'
import {
  ErrorType,
  WalletException,
  BitGetException,
  MetamaskException,
  OkxWalletException,
  UnspecifiedErrorCode,
  TransactionException,
  TrustWalletException,
  RainbowWalletException,
} from '@injectivelabs/exceptions'
import {
  getRabbyProvider,
  getBitGetProvider,
  getPhantomProvider,
  getRainbowProvider,
  getMetamaskProvider,
  getOkxWalletProvider,
  getTrustWalletProvider,
} from './utils/index.js'
import type { EvmChainId, AccountAddress } from '@injectivelabs/ts-types'
import type { ErrorContext, ThrownException } from '@injectivelabs/exceptions'
import type {
  TxRaw,
  TxResponse,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts'
import type {
  StdSignDoc,
  Eip1193Provider,
  SendTransactionOptions,
  BrowserEip1993Provider,
  ConcreteWalletStrategy,
  ConcreteWalletStrategyArgs,
  EIP6963AnnounceProviderEvent,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'

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

          if (walletName === Wallet.Rabby.toLowerCase()) {
            this.evmProviders[Wallet.Rabby] = event.detail.provider
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

  async getSessionOrConfirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${uint8ArrayToHex(
        stringToUint8Array(
          `Confirmation for ${address} at time: ${Date.now()}`,
        ),
      )}`,
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

    const interval = 3000
    const maxAttempts = 10
    let attempts = 0

    while (attempts < maxAttempts) {
      attempts++
      await sleep(interval)

      try {
        const receipt = await ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        })

        if (receipt) {
          return txHash
        }
      } catch {}
    }

    throw new Error(
      `Failed to retrieve transaction receipt for txHash: ${txHash}`,
    )
  }

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

  async getEip1193Provider(): Promise<Eip1193Provider> {
    return this.getEthereum() as unknown as Eip1193Provider
  }

  async addEvmNetwork(chainId: EvmChainId): Promise<void> {
    const ethereum = await this.getEthereum()

    const chainIdToHex = chainId.toString(16)
    const chain = getEvmChainConfig(chainId)

    const params = {
      chainId: `0x${chainIdToHex}`,
      chainName: chain.name,
      rpcUrls: [...(chain.rpcUrls?.default?.http || [])],
      blockExplorerUrls: chain.blockExplorers?.default?.url
        ? [chain.blockExplorers.default.url]
        : [],
      nativeCurrency: chain.nativeCurrency,
    }

    try {
      await Promise.race([
        ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainIdToHex}` }],
        }),
        new Promise<void>((resolve) =>
          ethereum.on('chainChanged', ({ chain }: any) => {
            if (chain?.id === chainIdToHex) {
              resolve()
            }
          }),
        ),
      ])
    } catch (error) {
      if ((error as any).code === 4902) {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [params],
        })

        return
      }

      throw this.EvmWalletException(
        new Error(
          `Something went wrong while adding ${capitalize(
            this.wallet || 'wallet',
          )} network`,
        ),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetChainId,
        },
      )
    }
  }

  private async getEthereum(): Promise<BrowserEip1993Provider> {
    const evmProvider = this.evmProviders[this.wallet as Wallet]

    if (evmProvider) {
      return evmProvider
    }

    const backUpProvider =
      this.wallet === Wallet.Metamask
        ? await getMetamaskProvider()
        : this.wallet === Wallet.Rabby
        ? await getRabbyProvider()
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
