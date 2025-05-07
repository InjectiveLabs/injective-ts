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
  TurnkeyProvider,
  WalletDeviceType,
  type WalletMetadata,
  BaseConcreteStrategy,
  ConcreteWalletStrategy,
  SendTransactionOptions,
  ConcreteEthereumWalletStrategyArgs,
  TurnkeyMetadata,
} from '@injectivelabs/wallet-base'
import { TurnkeyWallet } from '../turnkey/turnkey.js'
import { TurnkeyErrorCodes } from '../types.js'
import { TurnkeyOtpWallet } from '../turnkey/otp.js'
import { TurnkeyOauthWallet } from '../turnkey/oauth.js'
import { SessionType } from '@turnkey/sdk-browser'
import { TurnkeyIframeClient } from 'node_modules/@turnkey/sdk-browser/dist/sdk-client.js'
import { getAddress } from 'viem'

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
      apiServerEndpoint?: string
    },
  ) {
    super(args)

    this.turnkeyProvider = args.provider
    this.client = new HttpRestClient(
      args.apiServerEndpoint || DEFAULT_TURNKEY_API_ENDPOINT,
    )
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
  }

  async getAddresses(): Promise<string[]> {
    const turnkeyWallet = await this.getTurnkeyWallet()
    const organizationId = await this.getOrganizationId()

    // CHeck if the user is already connected

    const session = await turnkeyWallet.getSession()

    if (!session.session) {
      const iframeClient = await turnkeyWallet.getIframeClient()
      // Check the provider type and perform auth step accordingly
      if (this.turnkeyProvider === TurnkeyProvider.Email) {
        if (!this.metadata?.turnkey?.otpId) {
          throw new WalletException(new Error('OTP ID is required'))
        }

        if (!this.metadata?.turnkey?.otpCode) {
          throw new WalletException(new Error('OTP code is required'))
        }

        const result = await TurnkeyOtpWallet.confirmEmailOTP({
          client: this.client,
          iframeClient,
          otpCode: this.metadata?.turnkey?.otpCode,
          emailOTPId: this.metadata?.turnkey?.otpId,
          organizationId,
        })

        // TODO: abstract this logic into the TurnkeyWallet class
        if (result.credentialBundle) {
          this.metadata.turnkey.credentialBundle = result.credentialBundle
          await iframeClient.injectCredentialBundle(result.credentialBundle)

          await iframeClient.refreshSession({
            sessionType: SessionType.READ_WRITE,
            targetPublicKey: iframeClient.iframePublicKey,
            expirationSeconds: '900',
          })
        }
      } else {
        if (!this.metadata?.turnkey?.oidcToken) {
          throw new WalletException(new Error('Oidc token is required'))
        }

        const result = await TurnkeyOauthWallet.oauthLogin({
          client: this.client,
          iframeClient,
          oidcToken: this.metadata?.turnkey?.oidcToken,
          providerName: this.turnkeyProvider.toString() as 'google' | 'apple',
        })
        // TODO: abstract this logic into the TurnkeyWallet class
        if (result?.credentialBundle) {
          this.metadata.turnkey.credentialBundle = result.credentialBundle
          iframeClient.injectCredentialBundle(result.credentialBundle)
        }
      }
    }

    try {
      return await turnkeyWallet.getAccounts(organizationId)
    } catch (e: unknown) {
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

  async getSessionOrConfirm(): Promise<string> {
    const { turnkeyProvider, metadata, client } = this

    const turnkeyWallet = await this.getTurnkeyWallet()
    const iframeClient = await turnkeyWallet.getIframeClient()

    const session = await turnkeyWallet.getSession()

    if (
      // If either of these values exist on the metadata, then we want to proceed with the login flow
      !this.metadata?.turnkey?.email &&
      !this.metadata?.turnkey?.oidcToken &&
      session.session?.token
    ) {
      await iframeClient.injectCredentialBundle(session.session?.token)
      this.setMetadata({ turnkey: { organizationId: session.organizationId } })

      await iframeClient.refreshSession({
        sessionType: SessionType.READ_WRITE,
        targetPublicKey: iframeClient.iframePublicKey,
        expirationSeconds: '900',
      })

      return session.session.token
    }

    if (turnkeyProvider === TurnkeyProvider.Email) {
      if (!metadata?.turnkey?.email) {
        throw new WalletException(new Error('Email is required'))
      }

      const result = await TurnkeyOtpWallet.initEmailOTP({
        client,
        iframeClient,
        email: metadata.turnkey.email,
        otpInitPath: metadata.turnkey.otpInitPath,
      })

      if (result.organizationId && this.metadata?.turnkey) {
        this.metadata.turnkey.organizationId = result.organizationId
      }

      if (result.otpId && this.metadata?.turnkey) {
        this.metadata.turnkey.otpId = result.otpId
      }

      return result.otpId
    }

    if (
      [TurnkeyProvider.Google, TurnkeyProvider.Apple].includes(turnkeyProvider)
    ) {
      if (metadata?.turnkey?.oidcToken) {
        const oauthResult = await TurnkeyOauthWallet.oauthLogin({
          client,
          iframeClient,
          oidcToken: metadata.turnkey.oidcToken,
          providerName: turnkeyProvider.toString() as 'google' | 'apple',
          oauthLoginPath: metadata.turnkey.oauthLoginPath,
        })

        if (oauthResult?.credentialBundle)
          await iframeClient.injectCredentialBundle(
            oauthResult.credentialBundle,
          )
        await iframeClient.refreshSession({
          sessionType: SessionType.READ_WRITE,
          targetPublicKey: iframeClient.iframePublicKey,
          expirationSeconds: '900',
        })

        if (oauthResult?.credentialBundle) {
          const session = await turnkeyWallet.getSession()

          if (this.metadata?.turnkey && session.organizationId) {
            this.metadata.turnkey.organizationId = session.organizationId
          }
          return oauthResult.credentialBundle
        }

        throw new WalletException(new Error('Oauth result not found'))
      } else {
        return await TurnkeyOauthWallet.generateOAuthNonce(iframeClient)
      }
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

    //? Turnkey expects the case sensitive address and the current impl of getChecksumAddress from sdk-ts doesn't play nice with browser envs
    const checksumAddress = getAddress(address)

    const account = await turnkeyWallet.getOrCreateAndGetAccount(
      checksumAddress,
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

  async getIframeClient(): Promise<TurnkeyIframeClient> {
    const turnkeyWallet = await this.getTurnkeyWallet()
    return turnkeyWallet.getIframeClient()
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

      if (!metadata.turnkey.defaultOrganizationId) {
        throw new WalletException(
          new Error('Turnkey defaultOrganizationId is required'),
        )
      }

      this.turnkeyWallet = new TurnkeyWallet(metadata.turnkey)
    }

    return this.turnkeyWallet
  }

  private async getOrganizationId(): Promise<string> {
    const { metadata } = this
    const organizationId =
      metadata?.turnkey?.organizationId ||
      metadata?.turnkey?.defaultOrganizationId

    if (!organizationId) {
      throw new WalletException(new Error('Organization ID is required'))
    }

    return organizationId
  }
}
