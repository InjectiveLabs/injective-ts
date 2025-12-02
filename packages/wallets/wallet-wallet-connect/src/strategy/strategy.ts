import { toUtf8, TxGrpcApi } from '@injectivelabs/sdk-ts'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import {
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
  BaseConcreteStrategy,
} from '@injectivelabs/wallet-base'
import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
  TransactionException,
  WalletConnectException,
} from '@injectivelabs/exceptions'
import type { EvmChainId } from '@injectivelabs/ts-types'
import type { AccountAddress } from '@injectivelabs/ts-types'
import type {
  TxRaw,
  TxResponse,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts'
import type {
  StdSignDoc,
  Eip1193Provider,
  ConcreteWalletStrategy,
  SendTransactionOptions,
} from '@injectivelabs/wallet-base'

const WalletConnectIds = {
  FireBlocks:
    '5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489',
}

export class WalletConnect
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public provider: InstanceType<typeof EthereumProvider> | undefined

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(args?: { topic: string }): Promise<boolean> {
    await this.connectWalletConnect(args?.topic)

    return Promise.resolve(true)
  }

  public async disconnect() {
    if (this.listeners[WalletEventListener.AccountChange]) {
      const wc = await this.getConnectedWalletConnect()

      wc.removeListener(
        'accountsChanged',
        this.listeners[WalletEventListener.AccountChange],
      )
    }

    if (this.listeners[WalletEventListener.ChainIdChange]) {
      const wc = await this.getConnectedWalletConnect()

      wc.removeListener(
        'chainChanged',
        this.listeners[WalletEventListener.ChainIdChange],
      )
    }

    this.listeners = {}

    if (this.provider) {
      await this.provider.disconnect()
      this.provider = undefined
    }
  }

  async getAddresses(): Promise<string[]> {
    const wc = await this.getConnectedWalletConnect()

    try {
      return await wc.request({
        method: 'eth_requestAccounts',
      })
    } catch (e: unknown) {
      throw new WalletConnectException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  async getSessionOrConfirm(_address: AccountAddress): Promise<string> {
    const wc = await this.getConnectedWalletConnect()

    return wc.session?.topic || ''
  }

  async sendEvmTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; evmChainId: EvmChainId },
  ): Promise<string> {
    const wc = await this.getConnectedWalletConnect()

    try {
      return await wc.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      })
    } catch (e: unknown) {
      throw new WalletConnectException(new Error((e as any).message), {
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
    options: { txTimeout?: number } = {},
  ): Promise<string> {
    const wc = await this.getConnectedWalletConnect()

    // Ensure it's a number, within range [300, 604800]
    let txTimeout: number | undefined

    if (options?.txTimeout !== undefined) {
      const timeout = Number(options.txTimeout)

      txTimeout =
        isNaN(timeout) || timeout < 300 ? undefined : Math.min(timeout, 604800)
    }

    // todo: @thomas to improve this to emit an event instead of logging to the console
    console.log('signEip712TypedData', txTimeout)

    try {
      return await wc.request(
        {
          method: 'eth_signTypedData_v4',
          params: [address, eip712json],
        },
        txTimeout,
      )
    } catch (e: unknown) {
      throw new WalletConnectException(new Error((e as any).message), {
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
    const wc = await this.getConnectedWalletConnect()

    try {
      const signature = await wc.request<string>({
        method: 'personal_sign',
        params: [toUtf8(data), signer],
      })

      return signature
    } catch (e: unknown) {
      throw new WalletConnectException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignArbitrary,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    const wc = await this.getConnectedWalletConnect()

    try {
      return wc.request({ method: 'eth_chainId' })
    } catch (e: unknown) {
      throw new WalletConnectException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  async getEvmTransactionReceipt(_txHash: string): Promise<string> {
    throw new WalletException(
      new Error('This wallet does not support awaiting Evm transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetEvmTransactionReceipt,
      },
    )
  }

  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
    )
  }

  async onChainIdChanged(callback: (chain: string) => void): Promise<void> {
    const wc = await this.getConnectedWalletConnect()

    this.listeners = {
      [WalletEventListener.ChainIdChange]: callback,
    }

    wc.on('chainChanged', callback)
  }

  async onAccountChange(
    callback: (account: AccountAddress | string[]) => void,
  ): Promise<void> {
    const wc = await this.getConnectedWalletConnect()

    this.listeners = {
      [WalletEventListener.AccountChange]: callback,
    }

    wc.on('accountsChanged', (accounts: string[]) => callback(accounts[0]))
  }

  private async getWalletConnect() {
    if (this.provider) {
      return this.provider
    }

    if (!this.metadata?.walletConnect) {
      throw new WalletException(
        new Error('Please provide metadata for WalletConnect'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    if (!this.metadata.walletConnect.projectId) {
      throw new WalletException(
        new Error(
          'Please provide projectId alongside the metadata for WalletConnect',
        ),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    try {
      this.provider = await EthereumProvider.init({
        projectId: this.metadata.walletConnect.projectId as string,
        optionalChains: [
          ...new Set([this.evmChainId, 1, 11155111].filter(Boolean)),
        ] as [number, ...number[]],
        optionalMethods: [
          'eth_sendTransaction',
          'personal_sign',
          'eth_signTypedData_v4',
          'wallet_switchEthereumChain',
        ],
        optionalEvents: [
          'chainChanged',
          'accountsChanged',
          'connect',
          'disconnect',
        ],
        metadata: {
          name: 'Injective',
          description: 'Injective Protocol',
          url: 'https://injective.com',
          icons: [],
        },
        showQrModal: true,
        qrModalOptions: {
          explorerRecommendedWalletIds: [WalletConnectIds.FireBlocks],
          explorerExcludedWalletIds: 'ALL',
          desktopWallets: [
            {
              id: WalletConnectIds.FireBlocks,
              name: 'Fireblocks',
              links: {
                native: '',
                universal: 'https://console.fireblocks.io/v2/walletconnect',
              },
            },
          ],
        },
      })

      // Handle remote session deletion
      this.provider.on('session_delete', () => {
        this.provider = undefined
      })

      return this.provider
    } catch {
      throw new WalletException(
        new Error('WalletConnect not supported for this wallet'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }
  }

  async getEip1193Provider(): Promise<Eip1193Provider> {
    const provider = await this.getWalletConnect()

    return provider as unknown as Eip1193Provider
  }

  private async getConnectedWalletConnect(): Promise<
    InstanceType<typeof EthereumProvider>
  > {
    if (!this.provider) {
      await this.getWalletConnect()
    }

    if (!this.provider?.connected) {
      await this.enable()
    }

    if (!this.provider) {
      throw new WalletException(
        new Error('Failed to initialize WalletConnect provider'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    return this.provider
  }

  private async connectWalletConnect(topic?: string) {
    if (this.provider && this.provider.connected) {
      return
    }

    const wc = await this.getWalletConnect()

    await wc.connect({
      ...(topic && { pairingTopic: topic }),
    })
  }
}
