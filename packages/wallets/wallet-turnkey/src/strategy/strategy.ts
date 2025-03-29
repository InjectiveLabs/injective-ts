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

export type TurnkeyStatus =
  | 'init'
  | 'ready'
  | 'waiting-otp'
  | 'logged-in'
  | 'error'

export const TURNKEY_TOKEN_KEYS = {
  TOKEN: 'turnkey-token',
  ORGANIZATION_ID: 'turnkey-organization-id',
  TOKEN_EXPIRATION: 'turnkey-token-expiration',
} as const

export type TurnkeyTokenValue =
  (typeof TURNKEY_TOKEN_KEYS)[keyof typeof TURNKEY_TOKEN_KEYS]

export type TurnkeyMetadata = TurnkeySDKBrowserConfig & {
  turnkeyAuthIframeContainerId: string
  turnkeyAuthIframeElementId?: string
  token?: string
  organizationId?: string
}

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
  public status: TurnkeyStatus = 'init'
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

  private constructor(args: TurnkeyArgs) {
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
  }

  // TODO: require email for create, make a new connect function for token being passed in and rm localStorage
  public static async create(args: TurnkeyArgs): Promise<TurnkeyWallet> {
    const wallet = new TurnkeyWallet(args)
    await wallet.initializeIframe()

    const session = await wallet.turnkey.getSession()
    const token = session?.token || args.metadata?.token

    if (token) {
      await wallet
        .loadClientAndGetWallets({
          token,
        })
        .catch((e) => {
          if (e.code === 7) {
            wallet.setStatus('ready')
          } else {
            throw e
          }
        })
    }
    return wallet
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

    this.setStatus('ready')
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(): Promise<boolean> {
    try {
      await this.pollUserLoggedInState()

      return Promise.resolve(true)
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
      const responseData = await fetch(args.endpoint, {
        method: 'POST',
        body: JSON.stringify(bodyData),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((r) => r.json())

      const { otpId, organizationId } = responseData as {
        otpId: string
        organizationId: string
      }

      this.organizationId = organizationId
      this.emailOTPId = otpId
      this.setStatus('waiting-otp')

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

      const responseData = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(bodyData),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((r) => r.json())

      return this.loadClientAndGetWallets({
        token: responseData.token,
      })
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-confirm-email-otp',
      })
    }
  }

  private async loadClientAndGetWallets(args: { token: string }) {
    const { token } = args

    if (!this.authIframeClient) {
      throw new WalletException(new Error('Auth iframe client not initialized'))
    }

    try {
      const loginResult = await this.authIframeClient.injectCredentialBundle(
        token,
      )

      let session = await this.turnkey.getSession()

      // If there is no session, we want to force a refresh to enable to browser SDK to handle key storage and proper session management.
      if (!session) {
        await this.authIframeClient.refreshSession({
          sessionType: SessionType.READ_WRITE,
          targetPublicKey: this.authIframeClient.iframePublicKey,
          expirationSeconds: '900',
        })

        session = await this.turnkey.getSession()
      }

      const organizationId = session?.organizationId || this.organizationId

      if (loginResult) {
        this.setStatus('logged-in')
        this.organizationId = organizationId
        if (session?.expiry) {
          this.expiry = session.expiry
        }
        return session
      } else {
        throw new WalletException(new Error('Login failed'), {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: 'turnkey-wallet-load-client-and-get-wallets',
        })
      }
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-wallet-load-client-and-get-wallets',
      })
    }
  }

  public async disconnect() {
    const isUserLoggedIn = await this.turnkey.getSession()

    if (!isUserLoggedIn) {
      return
    }

    await this.turnkey.logout()
    this.setStatus('ready')
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
          if (e.code === 7) {
            this.setStatus('init')
            throw new WalletException(new Error('User is not logged in'), {
              code: UnspecifiedErrorCode,
              type: ErrorType.WalletError,
              contextModule: WalletAction.GetAccounts,
            })
          } else {
            this.setStatus('init')
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

  private async pollUserLoggedInState(timeout = 60 * 1000): Promise<any> {
    const POLL_INTERVAL = 3 * 1000

    for (let i = 0; i <= timeout / POLL_INTERVAL; i += 1) {
      try {
        const result = await this.turnkey.getCurrentUser()

        if (result) {
          return result
        }
      } catch (e: unknown) {
        // We throw only if the transaction failed on chain
        if (e instanceof TransactionException) {
          throw e
        }
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    }

    // Transaction was not included in the block in the desired timeout
    throw new WalletException(
      new Error(`User did not verify sign in - timeout of ${timeout}ms`),
      {
        context: 'Wallet',
        contextModule: 'Magic-Wallet-pollUserLoggedInState',
      },
    )
  }
}
