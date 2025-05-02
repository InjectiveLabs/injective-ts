/* eslint-disable class-methods-use-this */
import {
  ErrorType,
  WalletException,
  MetamaskException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  StdSignDoc,
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
  BaseConcreteStrategy,
  ConcreteWalletStrategy,
  SendTransactionOptions,
} from '@injectivelabs/wallet-base'
import {
  Provider,
  EthereumProvider,
  EthereumProviderOptions,
} from '@bangjelkoski/wc-ethereum-provider'
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import {
  TxRaw,
  toUtf8,
  TxGrpcApi,
  TxResponse,
  DirectSignResponse,
  AminoSignResponse,
} from '@injectivelabs/sdk-ts'

const WalletConnectIds = {
  FireBlocks:
    '5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489',
}

export class WalletConnect
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public provider: Provider | undefined

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
      throw new MetamaskException(new Error((e as any).message), {
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

  async sendEthereumTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    const wc = await this.getConnectedWalletConnect()

    try {
      return await wc.request({
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

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const wc = await this.getConnectedWalletConnect()

    try {
      return await wc.request({
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
    const wc = await this.getConnectedWalletConnect()

    try {
      const signature = await wc.request<string>({
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
    const wc = await this.getConnectedWalletConnect()

    try {
      return wc.request({ method: 'eth_chainId' })
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new WalletException(
      new Error('This wallet does not support awaiting Ethereum transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetEthereumTransactionReceipt,
      },
    )
  }

  // eslint-disable-next-line class-methods-use-this
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

    wc.on('accountsChanged', (accounts) => callback(accounts[0]))
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
        metadata: this
          .metadata as unknown as EthereumProviderOptions['metadata'],
        showQrModal: true,
        optionalChains: this.ethereumChainId
          ? [this.ethereumChainId]
          : [EthereumChainId.Mainnet, EthereumChainId.Sepolia],
        qrModalOptions: {
          explorerRecommendedWalletIds: [WalletConnectIds.FireBlocks],
          explorerExcludedWalletIds: 'ALL',
          mobileWallets: [],
          walletImages: {
            [WalletConnectIds.FireBlocks]: '/wallet-connect/fireblocks.webp',
          },
          desktopWallets: [
            {
              id: WalletConnectIds.FireBlocks,
              name: 'Fireblocks',
              links: {
                native: 'fireblocks-wc://',
                universal: 'https://console.fireblocks.io/v2/',
              },
            },
          ],
        },
      })

      return this.provider as Provider
    } catch (e) {
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

  private async getConnectedWalletConnect(): Promise<Provider> {
    if (!this.provider) {
      await this.getWalletConnect()
    }

    if (!this.provider?.connected) {
      await this.enable()
    }

    return this.provider as Provider
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
