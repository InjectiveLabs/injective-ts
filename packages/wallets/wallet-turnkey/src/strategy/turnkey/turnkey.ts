import {
  ErrorType,
  WalletException,
  GeneralException,
  UnspecifiedErrorCode,
  TurnkeyWalletSessionException,
} from '@injectivelabs/exceptions'
import {
  WalletAction,
  TurnkeyMetadata,
  TurnkeyProvider,
} from '@injectivelabs/wallet-base'
import { createAccount } from '@turnkey/viem'
import { HttpRestClient } from '@injectivelabs/utils'
import { getInjectiveAddress } from '@injectivelabs/sdk-ts'
import { SessionType, Turnkey, TurnkeyIframeClient } from '@turnkey/sdk-browser'
import {
  TURNKEY_OAUTH_PATH,
  TURNKEY_OTP_INIT_PATH,
  TURNKEY_OTP_VERIFY_PATH,
  DEFAULT_TURNKEY_REFRESH_SECONDS,
} from '../consts.js'
import { TurnkeyOtpWallet } from './otp.js'
import { TurnkeyErrorCodes } from '../types.js'
import { TurnkeyOauthWallet } from './oauth.js'
import { generateGoogleUrl } from '../../utils.js'

export class TurnkeyWallet {
  private otpId?: string

  protected turnkey?: Turnkey

  public organizationId: string

  protected client: HttpRestClient

  private metadata: TurnkeyMetadata

  protected iframeClient?: TurnkeyIframeClient

  private accountMap: Record<
    string,
    Awaited<ReturnType<typeof createAccount>>
  > = {}

  public setMetadata(metadata: Partial<TurnkeyMetadata>) {
    this.metadata = { ...this.metadata, ...metadata }
  }

  constructor(metadata: TurnkeyMetadata) {
    this.metadata = metadata
    this.organizationId = metadata.organizationId
    this.client = new HttpRestClient(metadata.apiServerEndpoint)
  }

  public static async getTurnkeyInstance(metadata: TurnkeyMetadata) {
    const { turnkey, iframeClient } = await createTurnkeyIFrame(metadata)

    return {
      turnkey,
      iframeClient,
    }
  }

  public async getTurnkey(): Promise<Turnkey> {
    if (!this.iframeClient) {
      await this.initFrame()
    }

    if (!this.turnkey) {
      this.turnkey = new Turnkey(this.metadata)
    }

    return this.turnkey as Turnkey
  }

  public async getIframeClient(): Promise<TurnkeyIframeClient> {
    if (!this.iframeClient) {
      await this.initFrame()
    }

    if (!this.iframeClient) {
      throw new WalletException(new Error('Iframe client not initialized'))
    }

    return this.iframeClient as TurnkeyIframeClient
  }

  public async getSession(existingCredentialBundle?: string) {
    const { metadata } = this

    const iframeClient = await this.getIframeClient()
    const turnkey = await this.getTurnkey()

    const currentSession = await turnkey.getSession()
    const organizationId =
      currentSession?.organizationId || metadata.defaultOrganizationId
    const credentialBundle = existingCredentialBundle || currentSession?.token

    if (!credentialBundle) {
      return {
        session: undefined,
        organizationId,
      }
    }

    try {
      const loginResult = await iframeClient.injectCredentialBundle(
        credentialBundle,
      )

      // If there is no session, we want to force a refresh to enable to browser SDK to handle key storage and proper session management.
      await iframeClient.refreshSession({
        sessionType: SessionType.READ_WRITE,
        targetPublicKey: iframeClient.iframePublicKey,
        expirationSeconds: this.metadata.expirationSeconds,
      })

      const [session, user] = await Promise.all([
        turnkey.getSession(),
        iframeClient.getWhoami(),
      ])

      const actualOrganizationId =
        user?.organizationId || session?.organizationId || organizationId

      if (!loginResult) {
        return {
          session: undefined,
          organizationId: actualOrganizationId,
        }
      }

      return {
        session,
        organizationId: actualOrganizationId,
      }
    } catch {
      throw new TurnkeyWalletSessionException(
        new Error('Session expired. Please login again.'),
      )
    }
  }

  public async getAccounts() {
    const iframeClient = await this.getIframeClient()

    if (!this.organizationId) {
      return []
    }

    try {
      const response = await iframeClient.getWallets({
        organizationId: this.organizationId,
      })

      const accounts = await Promise.allSettled(
        response.wallets.map((wallet) =>
          iframeClient.getWalletAccounts({
            walletId: wallet.walletId,
            organizationId: this.organizationId,
          }),
        ),
      )

      const filteredAccounts = accounts
        .filter((account) => account.status === 'fulfilled')
        .flatMap((result) => result.value?.accounts)
        .filter(
          (wa): wa is NonNullable<typeof wa> =>
            !!wa &&
            wa.addressFormat === 'ADDRESS_FORMAT_ETHEREUM' &&
            !!wa.address,
        )

      return filteredAccounts.map((account) =>
        getInjectiveAddress(account.address),
      )
    } catch (e: any) {
      if (e.code === TurnkeyErrorCodes.UserLoggedOut) {
        throw new WalletException(new Error('User is not logged in'), {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetAccounts,
          contextCode: TurnkeyErrorCodes.UserLoggedOut,
        })
      }

      throw new WalletException(new Error(e.message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-wallet-get-accounts',
      })
    }
  }

  public async getOrCreateAndGetAccount(
    address: string,
    organizationId: string,
  ): Promise<ReturnType<typeof createAccount>> {
    const { accountMap } = this
    const iframeClient = await this.getIframeClient()

    if (accountMap[address] || accountMap[address.toLowerCase()]) {
      return accountMap[address] || accountMap[address.toLowerCase()]
    }

    if (!organizationId) {
      throw new WalletException(new Error('Organization ID is required'))
    }

    iframeClient.config.organizationId = organizationId

    if (!address) {
      throw new WalletException(new Error('Account address not found'))
    }

    const turnkeyAccount = await createAccount({
      organizationId,
      signWith: address,
      client: iframeClient,
    })

    this.accountMap[address] = turnkeyAccount

    return turnkeyAccount
  }

  public async injectAndRefresh(
    credentialBundle: string,
    options: { expirationSeconds?: string; organizationId?: string },
  ) {
    const expirationSeconds =
      options.expirationSeconds || DEFAULT_TURNKEY_REFRESH_SECONDS
    const iframeClient = await this.getIframeClient()
    await iframeClient.injectCredentialBundle(credentialBundle)
    await iframeClient.loginWithBundle({
      bundle: credentialBundle,
      expirationSeconds,
    })

    await iframeClient.refreshSession({
      sessionType: SessionType.READ_WRITE,
      targetPublicKey: iframeClient.iframePublicKey,
      expirationSeconds,
    })

    const session = await this.turnkey?.getSession()
    if (!session) {
      throw new TurnkeyWalletSessionException(
        new Error('Session expired. Please login again.'),
      )
    }

    this.organizationId = session.organizationId
    this.metadata.organizationId = session.organizationId

    // Refresh the session 2 minutes before it expires
    setTimeout(() => {
      iframeClient.refreshSession({
        expirationSeconds: session?.expiry,
        sessionType: SessionType.READ_WRITE,
        targetPublicKey: iframeClient.iframePublicKey,
      })
    }, (parseInt(expirationSeconds) - 120) * 1000)

    return
  }

  public async initOTP(email: string) {
    const iframeClient = await this.getIframeClient()

    const result = await TurnkeyOtpWallet.initEmailOTP({
      client: this.client,
      iframeClient,
      email,
      otpInitPath: this.metadata.otpInitPath || TURNKEY_OTP_INIT_PATH,
    })

    if (!result || !result.otpId) {
      throw new WalletException(new Error('Failed to initialize OTP'))
    }

    if (result?.organizationId) {
      this.organizationId = result.organizationId
    }

    if (result?.otpId) {
      this.otpId = result.otpId
    }

    return result
  }

  public async confirmOTP(otpCode: string) {
    const iframeClient = await this.getIframeClient()

    if (!this.otpId) {
      throw new WalletException(new Error('OTP ID is required'))
    }

    const result = await TurnkeyOtpWallet.confirmEmailOTP({
      otpCode,
      iframeClient,
      client: this.client,
      emailOTPId: this.otpId,
      organizationId: this.organizationId,
      otpVerifyPath: this.metadata.otpVerifyPath || TURNKEY_OTP_VERIFY_PATH,
    })

    if (!result || !result.credentialBundle) {
      throw new WalletException(new Error('Failed to confirm OTP'))
    }

    await this.injectAndRefresh(result.credentialBundle, {
      organizationId: result.organizationId,
      expirationSeconds: this.metadata.expirationSeconds,
    })

    return result
  }

  public async initOAuth(
    provider: TurnkeyProvider.Google | TurnkeyProvider.Apple,
  ) {
    const iframeClient = await this.getIframeClient()
    const nonce = await TurnkeyOauthWallet.generateOAuthNonce(iframeClient)

    if (provider === TurnkeyProvider.Apple) {
      // TODO: implement the ability to generate Apple OAuth URL
      return nonce
    }

    if (!this.metadata?.googleClientId || !this.metadata?.googleRedirectUri) {
      throw new WalletException(
        new Error('googleClientId and googleRedirectUri are required'),
      )
    }
    return generateGoogleUrl({
      nonce,
      clientId: this.metadata.googleClientId,
      redirectUri: this.metadata.googleRedirectUri,
    })
  }

  public async confirmOAuth(
    provider: TurnkeyProvider.Google | TurnkeyProvider.Apple,
    oidcToken: string,
  ) {
    const iframeClient = await this.getIframeClient()

    const oauthResult = await TurnkeyOauthWallet.oauthLogin({
      oidcToken,
      iframeClient,
      client: this.client,
      providerName: provider.toString() as 'google' | 'apple',
      oauthLoginPath: this.metadata.oauthLoginPath || TURNKEY_OAUTH_PATH,
    })

    if (!oauthResult || !oauthResult.credentialBundle) {
      throw new WalletException(new Error('Unexpected OAuth result'))
    }

    await this.injectAndRefresh(oauthResult.credentialBundle, {
      organizationId: oauthResult.organizationId,
      expirationSeconds: this.metadata.expirationSeconds,
    })

    return oauthResult.credentialBundle
  }

  public async refreshSession() {
    const session = await this.getSession()

    if (session.session?.token) {
      await this.injectAndRefresh(session.session.token, {
        expirationSeconds:
          this.metadata.expirationSeconds || DEFAULT_TURNKEY_REFRESH_SECONDS,
      })

      return session.session.token
    }

    throw new TurnkeyWalletSessionException(
      new Error('Session expired. Please login again.'),
    )
  }

  private async initFrame(): Promise<void> {
    const { metadata } = this
    const { turnkey, iframeClient } = await createTurnkeyIFrame(metadata)

    this.turnkey = turnkey
    this.iframeClient = iframeClient
  }
}

async function createTurnkeyIFrame(metadata: TurnkeyMetadata) {
  const turnkey = new Turnkey(metadata)

  const turnkeyAuthIframeElementId =
    metadata.iframeElementId || 'turnkey-auth-iframe-element-id'

  if (!metadata.iframeContainerId) {
    throw new GeneralException(new Error('iframeContainerId is required'))
  }

  if (!turnkey) {
    throw new GeneralException(new Error('Turnkey is not initialized'))
  }

  const iframe = document.getElementById(
    metadata.iframeContainerId,
  ) as HTMLIFrameElement

  if (!iframe) {
    throw new GeneralException(new Error('iframe is null'))
  }

  const existingIframeClient = document.getElementById(
    turnkeyAuthIframeElementId,
  )

  if (existingIframeClient) {
    existingIframeClient.remove()
  }

  const iframeClient = await turnkey.iframeClient({
    iframeContainer: iframe,
    iframeElementId: turnkeyAuthIframeElementId,
    iframeUrl: metadata?.iframeUrl || 'https://auth.turnkey.com',
  })

  return {
    turnkey,
    iframeClient,
  }
}
