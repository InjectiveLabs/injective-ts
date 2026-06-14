import { sleep } from '@injectivelabs/utils'
import { toUtf8 } from '@injectivelabs/sdk-ts/utils'
import { EvmChainId } from '@injectivelabs/ts-types'
import { TxGrpcApi } from '@injectivelabs/sdk-ts/core/tx'
import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
  TransactionException,
  WalletConnectException,
} from '@injectivelabs/exceptions'
import {
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
  BaseConcreteStrategy,
  WalletConnectStrategyEventType,
} from '@injectivelabs/wallet-base'
import type { AppKit } from '@reown/appkit'
import type { AccountAddress } from '@injectivelabs/ts-types'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  StdSignDoc,
  Eip1193Provider,
  ConcreteWalletStrategy,
  SendTransactionOptions,
} from '@injectivelabs/wallet-base'

const FIREBLOCKS_WALLET_ID =
  '5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489'

const SESSION_RESTORE_TIMEOUT_MS = 3000

type Provider = Awaited<ReturnType<AppKit['getUniversalProvider']>>

export class WalletConnect
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private static appKit: AppKit | undefined
  private static appKitPromise: Promise<AppKit> | undefined
  private static sessionRestorePromise: Promise<void> | undefined

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  private async createAppKit(): Promise<AppKit> {
    const projectId = this.metadata?.walletConnect?.projectId as string

    if (!projectId) {
      throw new WalletException(
        new Error('Please provide projectId in metadata for WalletConnect'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    if (WalletConnect.appKit) {
      return WalletConnect.appKit
    }

    if (WalletConnect.appKitPromise) {
      return WalletConnect.appKitPromise
    }

    WalletConnect.appKitPromise = this.createAppKitInstance(projectId).catch(
      (e) => {
        WalletConnect.appKitPromise = undefined

        throw e
      },
    )

    return WalletConnect.appKitPromise
  }

  private async createAppKitInstance(projectId: string): Promise<AppKit> {
    const chainId = this.evmChainId || EvmChainId.Mainnet
    const [{ createAppKit }, { EthersAdapter }] = await Promise.all([
      import('@reown/appkit'),
      import('@reown/appkit-adapter-ethers'),
    ])

    WalletConnect.appKit = createAppKit({
      projectId,
      allWallets: 'HIDE',
      enableEIP6963: false,
      enableInjected: false,
      enableCoinbase: false,
      enableReconnect: true,
      adapters: [new EthersAdapter()],
      networks: [
        {
          id: chainId,
          name: 'Injective',
          chainNamespace: 'eip155',
          caipNetworkId: `eip155:${chainId}`,
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: {
            default: {
              http: [],
            },
          },
        },
      ],
      metadata: {
        name: 'Injective',
        description: 'Injective Protocol',
        url: 'https://injective.com',
        icons: [],
      },
      includeWalletIds: [FIREBLOCKS_WALLET_ID],
      featuredWalletIds: [FIREBLOCKS_WALLET_ID],
      features: {
        email: false,
        socials: false,
        allWallets: false,
        connectMethodsOrder: ['wallet'],
      },
    })

    WalletConnect.sessionRestorePromise = this.waitForSessionRestore(
      WalletConnect.appKit,
    )

    return WalletConnect.appKit
  }

  /**
   * Waits for AppKit to restore session from localStorage on page refresh.
   * Resolves immediately if already connected, otherwise waits for provider
   * subscription or times out.
   */
  private waitForSessionRestore(modal: AppKit): Promise<void> {
    if (modal.getIsConnectedState()) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      let resolved = false

      const done = () => {
        if (!resolved) {
          resolved = true
          clearTimeout(timeout)
          unsubscribe()
          resolve()
        }
      }

      const timeout = setTimeout(done, SESSION_RESTORE_TIMEOUT_MS)

      const unsubscribe = modal.subscribeProviders((state) => {
        if (state?.eip155 && modal.getIsConnectedState()) {
          done()
        }
      })
    })
  }

  async initStrategy(): Promise<void> {
    await this.createAppKit()

    if (WalletConnect.sessionRestorePromise) {
      await WalletConnect.sessionRestorePromise
    }
  }

  private async getProvider(): Promise<Provider> {
    const modal = await this.createAppKit()

    return modal.getUniversalProvider()
  }

  private async getWalletProvider(
    contextModule: string,
  ): Promise<Eip1193Provider> {
    const modal = await this.getAppKit()
    const provider = modal.getWalletProvider()

    if (!provider) {
      throw new WalletConnectException(new Error('No provider available'), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule,
      })
    }

    return provider as Eip1193Provider
  }

  private async getAppKit(): Promise<AppKit> {
    await this.initStrategy()
    const modal = await this.createAppKit()

    if (!modal.getIsConnectedState()) {
      throw new WalletException(
        new Error('Wallet not connected. Please call enable() first.'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    return modal
  }

  async enable(): Promise<boolean> {
    await this.initStrategy()
    const modal = await this.createAppKit()

    if (modal.getIsConnectedState()) {
      return true
    }

    await this.connect()

    return true
  }

  private async connect(): Promise<void> {
    const modal = await this.createAppKit()

    if (modal.getIsConnectedState()) {
      return
    }

    // Clear stale pairings for fresh QR
    try {
      const provider = await modal.getUniversalProvider()
      const pairing = provider?.client?.core?.pairing

      if (pairing) {
        const pairings = pairing.getPairings() || []

        await Promise.all(
          pairings.map((p) =>
            pairing.disconnect({ topic: p.topic }).catch(() => {}),
          ),
        )
      }
    } catch {
      // Silently fail
    }

    await modal.open({ view: 'Connect' })
    await sleep(100)

    modal.redirect('ConnectingWalletConnectBasic')

    // Wait for connection or cancellation
    await new Promise<void>((resolve, reject) => {
      const unsubscribe = modal.subscribeState((state: { open: boolean }) => {
        if (modal.getIsConnectedState()) {
          unsubscribe()
          modal.close()
          resolve()
        } else if (!state.open) {
          unsubscribe()
          reject(new Error('Connection cancelled'))
        }
      })
    })
  }

  async disconnect(): Promise<void> {
    try {
      const modal = await this.createAppKit()
      const provider = modal.getWalletProvider() as
        | (Eip1193Provider & {
            removeListener?: (e: string, h: unknown) => void
          })
        | undefined

      if (provider?.removeListener) {
        if (this.listeners[WalletEventListener.AccountChange]) {
          provider.removeListener(
            'accountsChanged',
            this.listeners[WalletEventListener.AccountChange],
          )
        }
        if (this.listeners[WalletEventListener.ChainIdChange]) {
          provider.removeListener(
            'chainChanged',
            this.listeners[WalletEventListener.ChainIdChange],
          )
        }
      }

      await modal.disconnect()
    } catch {
      // Silently fail
    }

    this.listeners = {}
  }

  async onDisconnect(callback: () => void): Promise<void> {
    try {
      const provider = await this.getProvider()

      provider?.on('session_delete', callback)
    } catch {
      // Silently fail
    }
  }

  async getAddresses(): Promise<string[]> {
    const modal = await this.getAppKit()

    const address = modal.getAddress()

    if (!address) {
      throw new WalletConnectException(new Error('No address available'), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }

    return [address]
  }

  async getSessionOrConfirm(): Promise<string> {
    try {
      const provider = await this.getProvider()

      return provider?.session?.topic || ''
    } catch {
      return ''
    }
  }

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
    options: { txTimeout?: number } = {},
  ): Promise<string> {
    await this.getAppKit()

    const provider = await this.getProvider()
    if (!provider) {
      throw new WalletConnectException(new Error('No provider available'), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }

    // Validate and clamp txTimeout (required for Fireblocks)
    let txTimeout: number | undefined

    if (options.txTimeout !== undefined) {
      const timeout = Number(options.txTimeout)

      txTimeout =
        isNaN(timeout) || timeout < 300 ? undefined : Math.min(timeout, 604800)
    }

    const caipChain = `eip155:${this.evmChainId || 1}`

    this.emit(
      WalletConnectStrategyEventType.WalletConnectSigningWithTxTimeout,
      {
        timeout: txTimeout,
      },
    )

    try {
      // Use 3-arg request to pass txTimeout to WalletConnect
      const signature = await provider.request(
        { method: 'eth_signTypedData_v4', params: [address, eip712json] },
        caipChain,
        txTimeout,
      )

      return signature as string
    } catch (e) {
      throw new WalletConnectException(new Error((e as Error).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    const { endpoints, txTimeout, txInclusion, onBroadcast } = options

    if (!endpoints) {
      throw new WalletException(
        new Error('You have to pass endpoints within the options'),
      )
    }

    const txApi = new TxGrpcApi(endpoints.grpc)
    const response = await txApi.broadcast(transaction, {
      txTimeout,
      ...txInclusion,
      onBroadcast,
    })

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
        contextCode: response.code,
        contextModule: response.codespace,
      })
    }

    return response
  }

  async sendEvmTransaction(
    transaction: unknown,
    _options: { address: AccountAddress; evmChainId: EvmChainId },
  ): Promise<string> {
    const modal = await this.getAppKit()
    const provider = modal.getWalletProvider() as Eip1193Provider

    if (!provider) {
      throw new WalletConnectException(new Error('No provider available'), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEvmTransaction,
      })
    }

    try {
      return await provider.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      })
    } catch (e) {
      throw new WalletConnectException(new Error((e as Error).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEvmTransaction,
      })
    }
  }

  async signArbitrary(
    signer: AccountAddress,
    data: string | Uint8Array,
  ): Promise<string> {
    const modal = await this.getAppKit()
    const provider = modal.getWalletProvider() as Eip1193Provider

    if (!provider) {
      throw new WalletConnectException(new Error('No provider available'), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignArbitrary,
      })
    }

    try {
      return (await provider.request({
        method: 'personal_sign',
        params: [toUtf8(data), signer],
      })) as string
    } catch (e) {
      throw new WalletConnectException(new Error((e as Error).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignArbitrary,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    const modal = await this.getAppKit()
    const provider = modal.getWalletProvider() as Eip1193Provider

    if (!provider) {
      throw new WalletConnectException(new Error('No provider available'), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }

    try {
      return await provider.request({ method: 'eth_chainId', params: [] })
    } catch (e) {
      throw new WalletConnectException(new Error((e as Error).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  async getEip1193Provider(): Promise<Eip1193Provider> {
    const modal = await this.getAppKit()
    const provider = modal.getWalletProvider()

    if (!provider) {
      throw new WalletException(new Error('No wallet provider available'), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }

    return provider as unknown as Eip1193Provider
  }

  async onChainIdChanged(callback: (chain: string) => void): Promise<void> {
    const modal = await this.getAppKit()
    const provider = modal.getWalletProvider() as Eip1193Provider & {
      on: (event: string, handler: (v: string) => void) => void
    }

    this.listeners[WalletEventListener.ChainIdChange] = callback
    provider?.on('chainChanged', callback)
  }

  async onAccountChange(
    callback: (account: AccountAddress | string[]) => void,
  ): Promise<void> {
    const modal = await this.getAppKit()
    const provider = modal.getWalletProvider() as Eip1193Provider & {
      on: (event: string, handler: (v: string[]) => void) => void
    }

    this.listeners[WalletEventListener.AccountChange] = callback
    provider?.on('accountsChanged', (accounts: string[]) =>
      callback(accounts[0]),
    )
  }

  // Unsupported methods
  async getAddressesInfo(): Promise<
    { address: string; derivationPath: string; baseDerivationPath: string }[]
  > {
    throw new WalletException(
      new Error('getAddressesInfo is not supported by WalletConnect'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      },
    )
  }

  async signAminoCosmosTransaction(_transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new WalletException(
      new Error('Cosmos transactions are not supported by WalletConnect'),
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
      new Error('Cosmos transactions are not supported by WalletConnect'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  async getEvmTransactionReceipt(_txHash: string): Promise<string> {
    throw new WalletException(
      new Error('getEvmTransactionReceipt is not supported by WalletConnect'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetEvmTransactionReceipt,
      },
    )
  }

  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('getPubKey is not supported by WalletConnect'),
    )
  }
}
