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
  DirectSignResponse,
  AminoSignResponse,
  getInjectiveAddress,
  sha256,
} from '@injectivelabs/sdk-ts'
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import {
  StdSignDoc,
  WalletAction,
  WalletDeviceType,
  BaseConcreteStrategy,
  BrowserEip1993Provider,
  ConcreteWalletStrategy,
  SendTransactionOptions,
  ConcreteEthereumWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import { SessionType, Turnkey, TurnkeyIframeClient } from '@turnkey/sdk-browser'

import { createAccount } from '@turnkey/viem'

import { TurnkeySDKBrowserConfig } from '@turnkey/sdk-browser'
import { HttpClient } from '@injectivelabs/utils'

export enum TurnkeyStatus {
  Initializing = 'initializing',
  Ready = 'ready',
  WaitingOtp = 'waiting-otp',
  LoggedIn = 'logged-in',
  Error = 'error',
}

export enum TurnkeyProviders {
  Google = 'google',
  Email = 'email',
}

enum TurnkeyErrorCodes {
  UserLoggedOut = 7,
}

export type TurnkeyMetadata = TurnkeySDKBrowserConfig & {
  turnkeyAuthIframeContainerId: string
  turnkeyAuthIframeElementId?: string
  token?: string
  organizationId?: string
}

type OAuthArgs = {
  provider: 'google'
  oidcToken: string
  oauthLoginEndpoint: string
}

type EmailArgs = {
  provider: 'email'
  email: string
  initEmailOTPEndpoint: string
}
const REFRESH_INTERVAL_MS = 60 * 1000

type TurnkeyEnableArgs = OAuthArgs | EmailArgs

interface TurnkeyArgs extends ConcreteEthereumWalletStrategyArgs {
  metadata?: TurnkeyMetadata
  onStatusChange?: (status: TurnkeyStatus) => void
}

export class TurnkeyWallet
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public provider: BrowserEip1993Provider | undefined
  public metadata?: TurnkeyMetadata
  public organizationId?: string
  public turnkey: Turnkey
  public authIframeClient?: TurnkeyIframeClient
  public status: TurnkeyStatus = TurnkeyStatus.Initializing
  public expiry?: number
  private emailOTPId?: string
  private onStatusChangeCallback?: (status: TurnkeyStatus) => void
  private addresses: string[] = []

  private accountAddresses: string[] = []
  private accountMap: Record<
    AccountAddress,
    Awaited<ReturnType<typeof createAccount>>
  > = {}

  private setStatus(status: TurnkeyStatus) {
    this.status = status
    this.onStatusChangeCallback?.(status)
  }

  constructor(args: TurnkeyArgs) {
    if (!args.metadata?.apiBaseUrl) {
      throw new WalletException(
        new Error(
          'You have to pass the apiBaseUrl within metadata to use Turnkey wallet',
        ),
      )
    }

    if (!args.metadata.defaultOrganizationId) {
      throw new WalletException(
        new Error(
          'You have to pass the defaultOrganizationId within metadata to use Turnkey wallet',
        ),
      )
    }

    super(args)
    this.metadata = args.metadata
    this.turnkey = new Turnkey(this.metadata)
    this.onStatusChangeCallback = args.onStatusChange
    this.setStatus(TurnkeyStatus.Initializing)
    this.loadClient()
  }

  private async loadClient(args?: { token?: string }) {
    let { token } = args || {}

    if (!this.authIframeClient) {
      await this.initializeIframe()
    }

    if (!this.authIframeClient) {
      throw new WalletException(new Error('Auth iframe client not initialized'))
    }

    if (!token) {
      const currentSession = await this.turnkey.getSession()
      if (currentSession?.organizationId) {
        this.organizationId = currentSession.organizationId
      }
      token = currentSession?.token
    }

    if (!token) {
      this.setStatus(TurnkeyStatus.Ready)
      return
    }

    try {
      const loginResult = await this.authIframeClient.injectCredentialBundle(
        token,
      )

      // If there is no session, we want to force a refresh to enable to browser SDK to handle key storage and proper session management.
      await this.authIframeClient.refreshSession({
        sessionType: SessionType.READ_WRITE,
        targetPublicKey: this.authIframeClient.iframePublicKey,
        expirationSeconds: '900',
      })

      const [session, user] = await Promise.all([
        this.turnkey.getSession(),
        this.authIframeClient.getWhoami(),
      ])

      const organizationId =
        user?.organizationId || session?.organizationId || this.organizationId

      if (loginResult) {
        this.setStatus(TurnkeyStatus.LoggedIn)
        this.organizationId = organizationId
        // TODO: for some reason this is writing the incorrect organizationId
        if (session && session?.expiry) {
          this.expiry = session.expiry
        }

        setTimeout(() => {
          this.keepSessionAlive()
        }, REFRESH_INTERVAL_MS)

        return session
      } else {
        throw new WalletException(new Error('Login failed'), {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: 'turnkey-wallet-load-client-and-get-wallets',
        })
      }
    } catch (e) {
      throw new WalletException(
        new Error('loadCLientAndGetWallets: ' + (e as any).message),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: 'turnkey-wallet-load-client-and-get-wallets',
        },
      )
    }
  }

  private async initializeIframe(): Promise<void> {
    const turnkeyAuthIframeElementId =
      this.metadata?.turnkeyAuthIframeElementId ||
      'turnkey-auth-iframe-element-id'
    if (!this?.metadata?.turnkeyAuthIframeContainerId) {
      throw new Error('turnkeyAuthIframeContainerId is required')
    }

    const iframe = document.getElementById(
      this.metadata.turnkeyAuthIframeContainerId,
    ) as HTMLIFrameElement

    if (!iframe) {
      throw new Error('iframe is null')
    }

    const existingIframeClient = document.getElementById(
      turnkeyAuthIframeElementId,
    )

    if (existingIframeClient) {
      existingIframeClient.remove()
    }

    this.authIframeClient = await this.turnkey.iframeClient({
      iframeContainer: iframe,
      iframeUrl: this.metadata?.iframeUrl || 'https://auth.turnkey.com',
      iframeElementId: turnkeyAuthIframeElementId,
    })
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(args: TurnkeyEnableArgs): Promise<boolean> {
    try {
      await this.initializeIframe()
      if (args.provider === TurnkeyProviders.Email) {
        const result = await this.initEmailOTP({
          email: args.email,
          endpoint: args.initEmailOTPEndpoint,
        })

        if (result.organizationId) {
          this.organizationId = result.organizationId
        }

        if (result.otpId) {
          this.emailOTPId = result.otpId
        }

        return true
      }

      if (args.provider === TurnkeyProviders.Google) {
        if (!args.oidcToken) {
          throw new WalletException(new Error('Oidc token is required'))
        }
        const result = await this.oauthLogin({
          endpoint: args.oauthLoginEndpoint,
          oidcToken: args.oidcToken,
          providerName: 'google',
        })

        if (result) {
          return false
        }

        return true
      }

      return false
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  async initEmailOTP(args: {
    email: string
    endpoint: string
    suborgId?: string
    invalidateExistingSessions?: boolean
  }) {
    try {
      const bodyData = {
        email: args.email,
        suborgId: args.suborgId,
        invalidateExistingSessions: args.invalidateExistingSessions,
        targetPublicKey: this.authIframeClient?.iframePublicKey,
      }
      const client = new HttpClient(args.endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const response = (await client.post(args.endpoint, bodyData)) as {
        data?: {
          otpId: string
          organizationId: string
        }
      }

      const { otpId, organizationId } = response?.data || {}

      this.organizationId = organizationId
      this.emailOTPId = otpId
      this.setStatus(TurnkeyStatus.WaitingOtp)

      return {
        otpId,
        organizationId,
      }
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        // TODO: update after built
        contextModule: 'turnkey-init-email-otp',
      })
    }
  }

  async confirmEmailOTP(args: {
    otpCode: string
    endpoint: string
    organizationId?: string
    emailOTPId?: string
  }) {
    if (!this.authIframeClient) {
      throw new WalletException(new Error('Auth iframe client not initialized'))
    }

    try {
      const { otpCode, endpoint } = args
      const organizationId = args.organizationId || this.organizationId
      const emailOTPId = args.emailOTPId || this.emailOTPId

      if (!emailOTPId) {
        throw new WalletException(new Error('Email OTP ID is required'))
      }

      if (!organizationId) {
        throw new WalletException(new Error('Organization ID is required'))
      }

      const bodyData = {
        otpCode,
        otpId: emailOTPId,
        targetPublicKey: this.authIframeClient.iframePublicKey,
        suborgID: organizationId,
      }

      const client = new HttpClient(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = (await client.post(endpoint, bodyData)) as {
        data?: {
          token: string
        }
      }

      const { token } = response?.data || {}

      return this.loadClient({
        token,
      })
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-confirm-email-otp',
      })
    }
  }

  async generateOAuthNonce() {
    try {
      const targetPublicKey = this.authIframeClient?.iframePublicKey

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }

      return Array.from(sha256(new TextEncoder().encode(targetPublicKey)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    } catch (e) {
      throw new WalletException(new Error('turnkey-generate-oauth-nonce'))
    }
  }

  async oauthLogin(args: {
    endpoint: string
    oidcToken: string
    providerName: 'google' //TODO: apple
    expirationSeconds?: number
  }): Promise<string | void> {
    try {
      const targetPublicKey = this.authIframeClient?.iframePublicKey

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }

      const { endpoint, oidcToken, providerName } = args

      const client = new HttpClient(endpoint, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const response = (await client.post(endpoint, {
        oidcToken,
        providerName,
        targetPublicKey,
      })) as {
        data?: {
          credentialBundle: string | null
          message: string
        }
      }

      const { credentialBundle, message } = response?.data || {}

      if (!credentialBundle) {
        return message
      }

      await this.loadClient({
        token: credentialBundle,
      })
    } catch (e) {
      throw new WalletException(new Error('turnkey-oauth-login'))
    }
  }

  public async disconnect() {
    const isUserLoggedIn = await this.turnkey.getSession()

    if (!isUserLoggedIn) {
      return
    }

    await this.turnkey.logout()
    this.setStatus(TurnkeyStatus.Ready)
  }

  async getAddresses(): Promise<string[]> {
    try {
      if (this.status !== 'logged-in') {
        throw new WalletException(new Error('User is not logged in'), {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetAccounts,
        })
      }

      if (!this.authIframeClient) {
        throw new WalletException(
          new Error('Auth iframe client not initialized'),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
            contextModule: WalletAction.GetAccounts,
          },
        )
      }

      if (this.addresses.length > 0) {
        return this.addresses
      }

      const { wallets } = await this.authIframeClient
        .getWallets({
          organizationId: this.organizationId,
        })
        .catch((e) => {
          if (e.code === TurnkeyErrorCodes.UserLoggedOut) {
            this.setStatus(TurnkeyStatus.Ready)
            this.disconnect()
            throw new WalletException(new Error('User is not logged in'), {
              code: UnspecifiedErrorCode,
              type: ErrorType.WalletError,
              contextModule: WalletAction.GetAccounts,
            })
          } else {
            this.setStatus(TurnkeyStatus.Ready)
            throw e
          }
        })

      const allWalletAccounts = await Promise.allSettled(
        wallets.map((wallet) =>
          this.authIframeClient?.getWalletAccounts({
            organizationId: this.organizationId,
            walletId: wallet.walletId,
          }),
        ),
      ).then((results) => {
        return results
          .filter((result) => result.status === 'fulfilled')
          .flatMap((result) => result.value?.accounts)
          .filter(
            (wa): wa is NonNullable<typeof wa> =>
              !!wa &&
              wa.addressFormat === 'ADDRESS_FORMAT_ETHEREUM' &&
              !!wa.address,
          )
      })

      this.accountAddresses = allWalletAccounts.map((wa) => wa.address)
      this.addresses = this.accountAddresses.map((address) =>
        getInjectiveAddress(address),
      )

      return this.addresses
    } catch (e: unknown) {
      throw new WalletException(new Error((e as any).message), {
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
          'You have to pass endpoints.grpc within the options for using Magic wallet',
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
    _address: AccountAddress,
  ): Promise<string> {
    let account = this.accountMap[_address]

    if (!account) {
      if (!this.authIframeClient) {
        throw new WalletException(
          new Error('Auth iframe client not initialized'),
        )
      }

      if (!this.organizationId) {
        throw new WalletException(new Error('Organization ID is required'))
      }

      this.authIframeClient.config.organizationId = this.organizationId

      // The account address that's passed in here is case-insensitive, but turnkey needs a case sensitive one. We find the accountAddress that matches the _address and use that instead.

      const address = this.accountAddresses.find(
        (address) => address.toLowerCase() === _address.toLowerCase(),
      )

      if (!address) {
        throw new WalletException(new Error('Account address not found'))
      }

      const turnkeyAccount = await createAccount({
        client: this.authIframeClient,
        organizationId: this.organizationId,
        signWith: address,
      })

      this.accountMap[_address] = turnkeyAccount
      account = turnkeyAccount
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

  /**
   * @description This is intended to ensure that the user's session
   * stays active while they are actively on the page. We refresh the session
   * once per minute.
   */
  private async keepSessionAlive() {
    // TODO: change to 60 seconds

    while (this.status === 'logged-in') {
      if (!this.authIframeClient?.config.organizationId) {
        return
      }

      if (this.organizationId) {
        this.authIframeClient.config.organizationId = this.organizationId
      }

      this.authIframeClient?.refreshSession({
        sessionType: SessionType.READ_WRITE,
        targetPublicKey: this.authIframeClient.iframePublicKey,
        expirationSeconds: '900',
        organizationId: this.organizationId,
      })

      const session = await this.turnkey.getSession()

      this.expiry = session?.expiry

      await new Promise((resolve) => setTimeout(resolve, REFRESH_INTERVAL_MS))
    }
  }
}
