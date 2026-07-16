import { toHex, isHex, getAddress } from 'viem'
import { capitalize } from '@injectivelabs/utils'
import { TxGrpcApi } from '@injectivelabs/sdk-ts/core/tx'
import {
  isServerSide,
  uint8ArrayToHex,
  stringToUint8Array,
} from '@injectivelabs/sdk-ts/utils'
import {
  Wallet,
  WalletAction,
  WalletDeviceType,
  getEvmChainConfig,
  isEvmBrowserWallet,
  WalletEventListener,
  BaseConcreteStrategy,
  EvmWalletProviderErrorCode,
  getViemPublicClientFromEip1193Provider,
} from '@injectivelabs/wallet-base'
import {
  ErrorType,
  WalletException,
  BitGetException,
  KeplrEvmException,
  MetamaskException,
  OkxWalletException,
  UnspecifiedErrorCode,
  TransactionException,
  TrustWalletException,
  RabbyWalletException,
  RainbowWalletException,
} from '@injectivelabs/exceptions'
import {
  isUnrecognizedChainError,
  extractNormalizedErrorCode,
  switchEthereumChainWithTimeout,
} from '../utils/index.js'
import {
  requestEip6963Providers,
  listenForEip6963Providers,
  getEvmProviderWithFallback,
} from './utils/providerResolver.js'
import type { Hash, RpcTransactionRequest } from 'viem'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type { EvmChainId, AccountAddress } from '@injectivelabs/ts-types'
import type {
  ErrorCode,
  ErrorContext,
  ThrownException,
} from '@injectivelabs/exceptions'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  StdSignDoc,
  Eip1193Provider,
  SendTransactionOptions,
  BrowserEip1193Provider,
  ConcreteWalletStrategy,
  ConcreteWalletStrategyArgs,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'

export class EvmWallet
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public wallet?: Wallet
  public evmProviders: Partial<Record<Wallet, BrowserEip1193Provider>> = {}

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
      listenForEip6963Providers(this.evmProviders)
      requestEip6963Providers()
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

    if (this.wallet === Wallet.Rabby) {
      return new RabbyWalletException(error, context)
    }

    if (this.wallet === Wallet.Rainbow) {
      return new RainbowWalletException(error, context)
    }

    if (this.wallet === Wallet.KeplrEvm) {
      return new KeplrEvmException(error, context)
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

  async getAddressesInfo(): Promise<
    { address: string; derivationPath: string; baseDerivationPath: string }[]
  > {
    throw new WalletException(
      new Error('getAddressesInfo is not implemented'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      },
    )
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
        params: [transaction as RpcTransactionRequest],
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
    const { endpoints, txTimeout, txInclusion, onBroadcast } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints within the options for using Ethereum native wallets',
        ),
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

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const ethereum = await this.getEthereum()

    try {
      return (await ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [getAddress(address), eip712json],
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

      throw this.EvmWalletException(new Error((e as any).message), {
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
        params: [isHex(data) ? data : toHex(data), getAddress(signer)],
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
    const chainIdHex = (await ethereum.request({
      method: 'eth_chainId',
    })) as string
    const chainId = parseInt(chainIdHex, 16)

    const publicClient = getViemPublicClientFromEip1193Provider(
      chainId,
      ethereum,
    )

    try {
      await publicClient.waitForTransactionReceipt({
        hash: txHash as Hash,
        timeout: 30_000,
        pollingInterval: 3_000,
      })

      return txHash
    } catch {
      throw new Error(
        `Failed to retrieve transaction receipt for txHash: ${txHash}`,
      )
    }
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
    const chainIdHex = `0x${chainId.toString(16)}`
    const chain = getEvmChainConfig(chainId)

    const params = {
      chainId: chainIdHex,
      chainName: chain.name,
      rpcUrls: [...(chain.rpcUrls?.default?.http || [])],
      blockExplorerUrls: chain.blockExplorers?.default?.url
        ? [chain.blockExplorers.default.url]
        : [],
      nativeCurrency: chain.nativeCurrency,
    }

    const TIMEOUT_MS = 30_000

    try {
      await switchEthereumChainWithTimeout(ethereum, chainIdHex, TIMEOUT_MS)
    } catch (error) {
      const errorCode = extractNormalizedErrorCode(error)

      if (errorCode === EvmWalletProviderErrorCode.UserRejectedRequest) {
        throw this.EvmWalletException(
          new Error(
            `${capitalize(this.wallet || 'wallet')} chain switch was rejected`,
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
            contextModule: WalletAction.GetChainId,
          },
        )
      }

      if ((error as Error).message === 'Chain switch timed out') {
        throw this.EvmWalletException(new Error('Chain switch timed out'), {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetChainId,
        })
      }

      if (!isUnrecognizedChainError(error)) {
        throw this.EvmWalletException(
          new Error(
            `Something went wrong while switching ${capitalize(
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

      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [params],
        })
      } catch (addError) {
        const addErrorCode = extractNormalizedErrorCode(addError)

        if (addErrorCode === EvmWalletProviderErrorCode.UserRejectedRequest) {
          throw this.EvmWalletException(
            new Error(
              `${capitalize(this.wallet || 'wallet')} add chain was rejected`,
            ),
            {
              code: EvmWalletProviderErrorCode.UserRejectedRequest as ErrorCode,
              type: ErrorType.WalletError,
              contextModule: WalletAction.GetChainId,
            },
          )
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

      let currentChainId: unknown
      try {
        currentChainId = await ethereum.request({ method: 'eth_chainId' })
      } catch {
        throw this.EvmWalletException(
          new Error(
            `Failed to get current chain ID from ${capitalize(
              this.wallet || 'wallet',
            )}`,
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
            contextModule: WalletAction.GetChainId,
          },
        )
      }

      if (
        typeof currentChainId !== 'string' ||
        !currentChainId.startsWith('0x')
      ) {
        throw this.EvmWalletException(
          new Error(
            `Invalid chain ID response from ${capitalize(
              this.wallet || 'wallet',
            )}: ${String(currentChainId)}`,
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
            contextModule: WalletAction.GetChainId,
          },
        )
      }

      if (currentChainId.toLowerCase() !== chainIdHex.toLowerCase()) {
        try {
          await switchEthereumChainWithTimeout(ethereum, chainIdHex, TIMEOUT_MS)
        } catch (postAddError: any) {
          const postAddErrorCode = extractNormalizedErrorCode(postAddError)

          if (
            postAddErrorCode === EvmWalletProviderErrorCode.UserRejectedRequest
          ) {
            throw this.EvmWalletException(
              new Error(
                `${capitalize(
                  this.wallet || 'wallet',
                )} chain switch after add was rejected`,
              ),
              {
                code: UnspecifiedErrorCode,
                type: ErrorType.WalletError,
                contextModule: WalletAction.GetChainId,
              },
            )
          }

          throw this.EvmWalletException(
            new Error(
              `Failed to switch to ${chain.name} network after adding it: ${(postAddError as Error).message}`,
            ),
            {
              code: UnspecifiedErrorCode,
              type: ErrorType.WalletError,
              contextModule: WalletAction.GetChainId,
            },
          )
        }
      }
    }
  }

  private async getEthereum(): Promise<BrowserEip1193Provider> {
    const provider = await getEvmProviderWithFallback(this.wallet as Wallet, {
      eip6963Providers: this.evmProviders,
    })

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
