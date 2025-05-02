/* eslint-disable class-methods-use-this */
import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
  TransactionException,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import {
  TxRaw,
  TxGrpcApi,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts'
import { HttpRestClient } from '@injectivelabs/utils'
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import {
  StdSignDoc,
  WalletAction,
  TurnkeyStatus,
  TurnkeyProvider,
  WalletDeviceType,
  type WalletMetadata,
  BaseConcreteStrategy,
  ConcreteWalletStrategy,
  SendTransactionOptions,
  ConcreteEthereumWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import { TurnkeyWallet } from '../turnkey/turnkey.js'
import { TurnkeyErrorCodes } from '../types.js'
import { TurnkeyOtpWallet } from '../turnkey/otp.js'
import { TurnkeyOauthWallet } from '../turnkey/oauth.js'

const DEFAULT_TURNKEY_API_ENDPOINT = 'https://api.ui.injective.network/api/v1'

export class BaseTurnkeyWalletStrategy
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public turnkeyWallet: TurnkeyWallet | undefined

  public turnkeyProvider: TurnkeyProvider

  public client: HttpRestClient

  constructor(
    args: ConcreteEthereumWalletStrategyArgs & {
      provider: TurnkeyProvider
      apiEndpoint?: string
    },
  ) {
    super(args)
    this.turnkeyProvider = args.provider
    this.client = new HttpRestClient(
      args.apiEndpoint || DEFAULT_TURNKEY_API_ENDPOINT,
    )
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  private async getOrganizationId(): Promise<string> {
    const { metadata } = this
    const organizationId =
      metadata?.turnkey?.defaultOrganizationId ||
      metadata?.turnkey?.organizationId

    if (!organizationId) {
      throw new WalletException(new Error('Organization ID is required'))
    }

    return organizationId
  }

  async setMetadata(metadata: WalletMetadata) {
    if (metadata?.turnkey) {
      this.metadata = { ...this.metadata, ...metadata.turnkey }
    }
  }

  async enable(): Promise<boolean> {
    const turnkeyWallet = await this.getTurnkeyWallet()

    this.setStatus(TurnkeyStatus.Initializing)

    try {
      return !!(await turnkeyWallet.getIframeClient())
    } catch (e) {
      return false
    }
  }

  public async disconnect() {
    const turnkeyWallet = await this.getTurnkeyWallet()
    const turnkey = await turnkeyWallet.getTurnkey()

    const isUserLoggedIn = await turnkey.getSession()

    if (!isUserLoggedIn) {
      return
    }

    await turnkey.logout()

    this.setStatus(TurnkeyStatus.Ready)
  }

  async getAddresses(): Promise<string[]> {
    const turnkeyWallet = await this.getTurnkeyWallet()
    const organizationId = await this.getOrganizationId()

    try {
      return await turnkeyWallet.getAccounts(organizationId)
    } catch (e: unknown) {
      this.setStatus(TurnkeyStatus.Ready) // Why are we doing this?

      if ((e as any).contextCode === TurnkeyErrorCodes.UserLoggedOut) {
        await this.disconnect()

        throw e
      }

      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getSessionOrConfirm(_address: AccountAddress): Promise<string> {
    const { turnkeyProvider, metadata, client } = this
    const turnkeyWallet = await this.getTurnkeyWallet()
    const iframeClient = await turnkeyWallet.getIframeClient()

    if (turnkeyProvider === TurnkeyProvider.Email) {
      if (!metadata?.turnkey?.email) {
        throw new WalletException(new Error('Email is required'))
      }

      const result = await TurnkeyOtpWallet.fetchOTPCredentials({
        client,
        iframeClient,
        email: metadata.turnkey.email,
      })

      if (result.organizationId && this.metadata?.turnkey) {
        this.metadata.turnkey.organizationId = result.organizationId
      }

      if (result.otpId && this.metadata?.turnkey) {
        this.metadata.turnkey.otpId = result.otpId
      }

      return result.otpId
    }

    if (turnkeyProvider === TurnkeyProvider.Google) {
      if (!metadata?.turnkey?.oidcToken) {
        throw new WalletException(new Error('Oidc token is required'))
      }

      const result = await TurnkeyOauthWallet.oauthLogin({
        client,
        iframeClient,
        oidcToken: metadata.turnkey.oidcToken,
        providerName: 'google',
      })

      return result || ''
    }

    return ''
  }

  async sendEthereumTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    throw new WalletException(
      new Error(
        'sendEthereumTransaction is not supported. Turnkey only supports sending cosmos transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendEthereumTransaction,
      },
    )
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
    const organizationId = await this.getOrganizationId()

    const account = await turnkeyWallet.getOrCreateAndGetAccount(
      address,
      organizationId,
    )

    if (!account) {
      throw new WalletException(new Error('Turnkey account not found'))
    }

    const signature = await account.signTypedData(JSON.parse(eip712json))

    return signature
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

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumTransactionReceipt is not supported on Turnkey'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        context: WalletAction.GetEthereumTransactionReceipt,
      },
    )
  }

  // eslint-disable-next-line class-methods-use-this
  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
    )
  }

  private async setStatus(status: TurnkeyStatus) {
    const { metadata } = this
    const turnkeyWallet = await this.getTurnkeyWallet()

    turnkeyWallet.setStatus(status)
    metadata?.turnkey?.onStatusChange?.(status)
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

      if (!metadata.turnkey.defaultOrganizationId) {
        throw new WalletException(
          new Error('Turnkey defaultOrganizationId is required'),
        )
      }

      this.turnkeyWallet = new TurnkeyWallet(metadata.turnkey)
    }

    return this.turnkeyWallet
  }
}
