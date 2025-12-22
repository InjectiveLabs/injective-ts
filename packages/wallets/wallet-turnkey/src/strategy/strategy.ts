import { getAddress } from 'viem'
import { HttpRestClient } from '@injectivelabs/utils'
import { TxGrpcApi } from '@injectivelabs/sdk-ts/core/tx'
import { getEthereumAddress } from '@injectivelabs/sdk-ts/utils'
import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
  TransactionException,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import {
  WalletAction,
  WalletDeviceType,
  getViemWalletClient,
  getViemPublicClient,
  BaseConcreteStrategy,
} from '@injectivelabs/wallet-base'
import { TurnkeyErrorCodes } from './types.js'
import { TurnkeyWallet } from './turnkey/turnkey.js'
import { getEip1193ProviderForTurnkey } from './Eip1193Provider.js'
import type { Hash } from 'viem'
import type { EvmChainId } from '@injectivelabs/ts-types'
import type { AccountAddress } from '@injectivelabs/ts-types'
import type { WalletMetadata } from '@injectivelabs/wallet-base'
import type { TurnkeyIndexedDbClient } from '@turnkey/sdk-browser'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  StdSignDoc,
  Eip1193Provider,
  TurnkeyMetadata,
  ConcreteWalletStrategy,
  SendTransactionOptions,
  WalletStrategyEvmOptions,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'

export class TurnkeyWalletStrategy
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public turnkeyWallet?: TurnkeyWallet
  public evmOptions: WalletStrategyEvmOptions

  public client: HttpRestClient

  constructor(
    args: ConcreteEvmWalletStrategyArgs & {
      apiServerEndpoint?: string
    },
  ) {
    super(args)

    const endpoint =
      args.apiServerEndpoint || this.metadata?.turnkey?.apiServerEndpoint

    if (!endpoint) {
      throw new WalletException(new Error('apiServerEndpoint is required'))
    }

    this.client = new HttpRestClient(endpoint)
    this.evmOptions = args.evmOptions
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  setMetadata(metadata?: { turnkey?: Partial<WalletMetadata['turnkey']> }) {
    if (metadata?.turnkey) {
      this.metadata = {
        ...this.metadata,
        turnkey: {
          ...this.metadata?.turnkey,
          ...metadata.turnkey,
        } as TurnkeyMetadata,
      }
      this.turnkeyWallet?.setMetadata(this.metadata?.turnkey as TurnkeyMetadata)
    }
  }

  async enable(): Promise<boolean> {
    const turnkeyWallet = await this.getTurnkeyWallet()

    try {
      const session = await turnkeyWallet.getSession()

      if (session.session) {
        // User is already logged in, we don't need to do anything in the next steps
        if (this.metadata?.turnkey) {
          this.metadata.turnkey.session = session.session
        }

        return true
      }

      return !!(await turnkeyWallet.getIndexedDbClient())
    } catch {
      return false
    }
  }

  public async disconnect() {
    const turnkeyWallet = await this.getTurnkeyWallet()
    const turnkey = await turnkeyWallet.getTurnkey()
    const indexedDbClient = await turnkeyWallet.getIndexedDbClient()

    const isUserLoggedIn = await turnkey.getSession()

    if (!isUserLoggedIn) {
      return
    }

    await Promise.allSettled([turnkey.logout(), indexedDbClient.clear()])
  }

  async getAddresses(): Promise<string[]> {
    const turnkeyWallet = await this.getTurnkeyWallet()

    try {
      return await turnkeyWallet.getAccounts()
    } catch (e: any) {
      if (e.contextCode === TurnkeyErrorCodes.UserLoggedOut) {
        await this.disconnect()

        throw e
      }

      throw new WalletException(new Error(e.message), {
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

  async getSessionOrConfirm(_address?: string): Promise<string> {
    const turnkeyWallet = await this.getTurnkeyWallet()

    return await turnkeyWallet.refreshSession()
  }

  async getWalletClient<TurnkeyWallet>(): Promise<TurnkeyWallet> {
    return (await this.getTurnkeyWallet()) as TurnkeyWallet
  }

  async sendEvmTransaction(
    transaction: unknown,
    args: { address: AccountAddress; evmChainId: EvmChainId },
  ): Promise<string> {
    try {
      const options = this.evmOptions
      const turnkeyWallet = await this.getTurnkeyWallet()

      const chainId = args.evmChainId || options.evmChainId
      const url = options.rpcUrl || options.rpcUrls?.[args.evmChainId]

      if (!url) {
        throw new WalletException(
          new Error('Please pass rpcUrl within the evmOptions'),
          {
            code: UnspecifiedErrorCode,
            context: WalletAction.SendEvmTransaction,
          },
        )
      }

      const account = await turnkeyWallet.getOrCreateAndGetAccount(
        getAddress(args.address),
      )

      const accountClient = getViemWalletClient({
        chainId,
        account,
        rpcUrl: url,
      })

      const parseHexValue = (value: string | number | bigint) => {
        if (typeof value === 'string') {
          const hexValue = value.startsWith('0x') ? value : `0x${value}`

          return BigInt(hexValue)
        }

        return BigInt(value)
      }

      const txData = transaction as any
      const processedTransaction = { ...txData }

      const hexFields = [
        'value',
        'gas',
        'gasLimit',
        'gasPrice',
        'maxFeePerGas',
        'maxPriorityFeePerGas',
      ]

      for (const field of hexFields) {
        if (processedTransaction[field] !== undefined) {
          processedTransaction[field] = parseHexValue(
            processedTransaction[field],
          )
        }
      }

      const preparedTransaction =
        await accountClient.prepareTransactionRequest(processedTransaction)

      // Remove account property as it's not needed for signing
      const { account: _, ...transactionToSign } = preparedTransaction

      const signedTransaction = await accountClient.signTransaction(
        transactionToSign as any,
      )

      const tx = await accountClient.sendRawTransaction({
        serializedTransaction: signedTransaction as Hash,
      })

      return tx
    } catch (e) {
      throw new WalletException(e as Error, {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendEvmTransaction,
      })
    }
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<any> {
    const { endpoints, txTimeout } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints.grpc within the options for using Turnkey wallet',
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
    const turnkeyWallet = await this.getTurnkeyWallet()

    //? Turnkey expects the case sensitive address and the current impl of getChecksumAddress from sdk-ts doesn't play nice with browser envs
    const checksumAddress = getAddress(address)

    const account =
      await turnkeyWallet.getOrCreateAndGetAccount(checksumAddress)

    if (!account) {
      throw new WalletException(new Error('Turnkey account not found'))
    }

    let parsedData
    try {
      parsedData = JSON.parse(eip712json)
    } catch {
      throw new WalletException(
        new Error('Failed to parse EIP-712 data: Invalid JSON format'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SignTransaction,
        },
      )
    }

    // Convert chainId from hex string to number for Turnkey EIP-712 compatibility
    if (
      parsedData.domain?.chainId &&
      typeof parsedData.domain.chainId === 'string'
    ) {
      parsedData.domain.chainId = Number(parsedData.domain.chainId)
    }

    const signature = await account.signTypedData(parsedData)

    return signature
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

  async signAminoCosmosTransaction(_transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new WalletException(
      new Error('This wallet does not support signAminoCosmosTransaction'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  async signArbitrary(
    _signer: AccountAddress,
    _data: string | Uint8Array,
  ): Promise<string> {
    throw new WalletException(
      new Error('This wallet does not support signArbitrary'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  async getEthereumChainId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumChainId is not supported on Turnkey wallet'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetChainId,
      },
    )
  }

  async getEvmTransactionReceipt(
    txHash: string,
    evmChainId?: EvmChainId,
  ): Promise<Record<string, any>> {
    const options = this.evmOptions

    const chainId = evmChainId || options.evmChainId
    const url = options.rpcUrl || options.rpcUrls?.[chainId]

    if (!url) {
      throw new WalletException(
        new Error('Please pass rpcUrl within the evmOptions'),
        {
          code: UnspecifiedErrorCode,
          context: WalletAction.GetEvmTransactionReceipt,
        },
      )
    }

    const publicClient = getViemPublicClient(chainId, url)

    try {
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash as Hash,
        timeout: 30_000,
        pollingInterval: 3_000,
      })

      return receipt
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

  async getIndexedDbClient(): Promise<TurnkeyIndexedDbClient> {
    const turnkeyWallet = await this.getTurnkeyWallet()
    const indexedDbClient = await turnkeyWallet.getIndexedDbClient()

    return indexedDbClient
  }

  private async getTurnkeyWallet(): Promise<TurnkeyWallet> {
    const { metadata } = this

    if (!this.turnkeyWallet) {
      if (!metadata?.turnkey) {
        throw new WalletException(new Error('Turnkey metadata is required'))
      }

      if (!metadata.turnkey.apiBaseUrl) {
        throw new WalletException(new Error('Turnkey apiBaseUrl is required'))
      }

      if (!metadata.turnkey.apiServerEndpoint) {
        throw new WalletException(
          new Error('Turnkey apiServerEndpoint is required'),
        )
      }

      this.turnkeyWallet = new TurnkeyWallet(
        metadata.turnkey as TurnkeyMetadata,
      )
    }

    return this.turnkeyWallet
  }

  public async getEip1193Provider(): Promise<Eip1193Provider> {
    const turnkeyWallet = await this.getTurnkeyWallet()
    const addresses = await turnkeyWallet.getAccounts()

    //? Turnkey expects the case sensitive address and the current impl of getChecksumAddress from sdk-ts doesn't play nice with browser envs
    const checksumAddress = getAddress(getEthereumAddress(addresses[0]))

    const account =
      await turnkeyWallet.getOrCreateAndGetAccount(checksumAddress)

    const eip1193Provider = await getEip1193ProviderForTurnkey(
      account,
      String(this.evmOptions.evmChainId),
    )

    return eip1193Provider
  }
}
