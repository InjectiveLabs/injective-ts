import { createAccount } from '@turnkey/viem'
import { Turnkey, SessionType } from '@turnkey/sdk-browser'
import { getInjectiveAddress } from '@injectivelabs/sdk-ts/utils'
import { WalletAction, TurnkeyProvider } from '@injectivelabs/wallet-base'
import {
  HttpRestClient,
  DEFAULT_TWITTER_OAUTH_EXPIRY,
} from '@injectivelabs/utils'
import {
  ErrorType,
  WalletException,
  GeneralException,
  UnspecifiedErrorCode,
  TurnkeyWalletSessionException,
} from '@injectivelabs/exceptions'
import { TurnkeyOtpWallet } from './otp.js'
import { TurnkeyErrorCodes } from '../types.js'
import { TurnkeyOauthWallet } from './oauth.js'
import {
  generateGoogleUrl,
  generateTwitterUrl,
  generateTwitterPkce,
} from '../../utils.js'
import {
  TURNKEY_OAUTH_PATH,
  TURNKEY_OTP_INIT_PATH,
  TURNKEY_OTP_VERIFY_PATH,
  DEFAULT_TURNKEY_REFRESH_SECONDS,
} from '../consts.js'
import type { TurnkeyMetadata } from '@injectivelabs/wallet-base'
import type { TurnkeyIndexedDbClient } from '@turnkey/sdk-browser'

export class TurnkeyWallet {
  private otpId?: string

  protected turnkey?: Turnkey

  public userOrganizationId?: string

  protected client: HttpRestClient

  private metadata: TurnkeyMetadata

  protected indexedDbClient?: TurnkeyIndexedDbClient

  private accountMap: Record<
    string,
    Awaited<ReturnType<typeof createAccount>>
  > = {}

  public setMetadata(metadata: Partial<TurnkeyMetadata>) {
    this.metadata = { ...this.metadata, ...metadata }
  }

  constructor(metadata: TurnkeyMetadata) {
    this.metadata = metadata
    this.client = new HttpRestClient(metadata.apiServerEndpoint)
  }

  public static async getTurnkeyInstance(metadata: TurnkeyMetadata) {
    const { turnkey, indexedDbClient } = await createTurnkeyClient(metadata)

    return {
      turnkey,
      indexedDbClient,
    }
  }

  public async getTurnkey(): Promise<Turnkey> {
    if (!this.indexedDbClient) {
      await this.initClient()
    }

    if (!this.turnkey) {
      this.turnkey = new Turnkey(this.metadata)
    }

    return this.turnkey as Turnkey
  }

  public async getIndexedDbClient(): Promise<TurnkeyIndexedDbClient> {
    if (!this.indexedDbClient) {
      await this.initClient()
    }

    if (!this.indexedDbClient) {
      throw new WalletException(new Error('Indexed DB client not initialized'))
    }

    return this.indexedDbClient as TurnkeyIndexedDbClient
  }

  public async getSession(existingCredentialBundle?: string) {
    try {
      const { metadata } = this

      const indexedDbClient = await this.getIndexedDbClient()
      const turnkey = await this.getTurnkey()
      const session = await turnkey.getSession()

      const organizationId =
        session?.organizationId || metadata.defaultOrganizationId
      const credentialBundle = existingCredentialBundle || session?.token

      if (!credentialBundle) {
        return {
          session: undefined,
          organizationId,
        }
      }

      const user = await indexedDbClient.getWhoami()

      const actualOrganizationId =
        user?.organizationId || session?.organizationId || organizationId

      if (!user) {
        return {
          session: undefined,
          organizationId: actualOrganizationId,
        }
      }

      this.userOrganizationId = actualOrganizationId
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
    const indexedDbClient = await this.getIndexedDbClient()

    if (!this.userOrganizationId) {
      return []
    }

    try {
      const response = await indexedDbClient.getWallets({
        organizationId: this.userOrganizationId,
      })

      const accounts = await Promise.allSettled(
        response.wallets.map((wallet) =>
          indexedDbClient.getWalletAccounts({
            walletId: wallet.walletId,
            organizationId: this.userOrganizationId,
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
  ): Promise<ReturnType<typeof createAccount>> {
    const { accountMap } = this
    const indexedDbClient = await this.getIndexedDbClient()
    const organizationId = this.userOrganizationId

    if (accountMap[address] || accountMap[address.toLowerCase()]) {
      return accountMap[address] || accountMap[address.toLowerCase()]
    }

    if (!organizationId) {
      throw new WalletException(new Error('Organization ID is required'))
    }

    indexedDbClient.config.organizationId = organizationId

    if (!address) {
      throw new WalletException(new Error('Account address not found'))
    }

    const turnkeyAccount = await createAccount({
      organizationId,
      signWith: address,
      client: indexedDbClient as unknown as any,
    })

    this.accountMap[address] = turnkeyAccount

    return turnkeyAccount
  }

  public async initOTP(email: string) {
    const indexedDbClient = await this.getIndexedDbClient()

    const result = await TurnkeyOtpWallet.initEmailOTP({
      client: this.client,
      indexedDbClient,
      email,
      otpInitPath: this.metadata.otpInitPath || TURNKEY_OTP_INIT_PATH,
    })

    if (!result || !result.otpId) {
      throw new WalletException(new Error('Failed to initialize OTP'))
    }

    if (result?.organizationId) {
      this.userOrganizationId = result.organizationId
    }

    if (result?.otpId) {
      this.otpId = result.otpId
    }

    return result
  }

  public async confirmOTP(otpCode: string) {
    const indexedDbClient = await this.getIndexedDbClient()
    const targetPublicKey = await indexedDbClient.getPublicKey()

    if (!this.otpId) {
      throw new WalletException(new Error('OTP ID is required'))
    }

    if (!targetPublicKey) {
      throw new WalletException(new Error('Target public key not found'))
    }

    if (!this.userOrganizationId) {
      throw new WalletException(new Error('Organization ID is required'))
    }

    const result = await TurnkeyOtpWallet.confirmEmailOTP({
      otpCode,
      client: this.client,
      emailOTPId: this.otpId,
      organizationId: this.userOrganizationId,
      targetPublicKey,
      otpVerifyPath: this.metadata.otpVerifyPath || TURNKEY_OTP_VERIFY_PATH,
    })

    if (!result || !result.session) {
      throw new WalletException(new Error('Failed to confirm OTP'))
    }

    await indexedDbClient.loginWithSession(result.session)
    this.userOrganizationId = result.organizationId

    return result
  }

  public async initOAuth(provider: TurnkeyProvider) {
    if (provider === TurnkeyProvider.Apple) {
      throw new WalletException(
        new Error('Apple sign in option is currently not supported'),
      )
    }

    const indexedDbClient = await this.getIndexedDbClient()
    const nonce = await TurnkeyOauthWallet.generateOAuthNonce(indexedDbClient)
    const targetPublicKey = await indexedDbClient.getPublicKey()

    if (provider === TurnkeyProvider.Twitter) {
      if (!this.metadata.twitterClientId || !this.metadata.twitterRedirectUri) {
        throw new WalletException(
          new Error('twitterClientId and twitterRedirectUri are required'),
        )
      }

      const { state, codeVerifier, codeChallenge } = generateTwitterPkce()

      const expiresAt = String(Date.now() + DEFAULT_TWITTER_OAUTH_EXPIRY)

      localStorage.setItem('twitter_oauth_state', state)
      localStorage.setItem('twitter_oauth_expires_at', expiresAt)
      localStorage.setItem('twitter_oauth_code_verifier', codeVerifier)
      localStorage.setItem('twitter_oauth_target_public_key', targetPublicKey!)

      return generateTwitterUrl({
        state,
        codeChallenge,
        clientId: this.metadata.twitterClientId,
        redirectUri: this.metadata.twitterRedirectUri,
      })
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

  public async confirmOAuth(provider: TurnkeyProvider, oidcToken: string) {
    if (provider === TurnkeyProvider.Apple) {
      throw new WalletException(
        new Error('Apple sign in option is currently not supported'),
      )
    }

    const indexedDbClient = await this.getIndexedDbClient()

    const oauthResult = await TurnkeyOauthWallet.oauthLogin({
      oidcToken,
      indexedDbClient,
      client: this.client,
      providerName: provider.toString() as 'google' | 'apple' | 'twitter',
      oauthLoginPath: this.metadata.oauthLoginPath || TURNKEY_OAUTH_PATH,
    })

    if (!oauthResult || !oauthResult.credentialBundle) {
      throw new WalletException(new Error('Unexpected OAuth result'))
    }

    await indexedDbClient.loginWithSession(oauthResult.credentialBundle)
    this.userOrganizationId = oauthResult.organizationId

    return oauthResult.credentialBundle
  }

  public async confirmOAuth2({
    authCode,
    codeVerifier,
    targetPublicKey,
    providerName,
  }: {
    authCode: string
    codeVerifier: string
    targetPublicKey: string
    providerName: TurnkeyProvider
  }) {
    const indexedDbClient = await this.getIndexedDbClient()
    const path = this.metadata.oauth2ExchangePath || 'turnkey/oauth2'

    const response = await this.client.post<{
      data: { credentialBundle: string; organizationId: string }
    }>(path, { authCode, codeVerifier, targetPublicKey, providerName })

    const { credentialBundle, organizationId } = response.data

    if (!credentialBundle || !organizationId) {
      throw new WalletException(
        new Error(`${providerName} OAuth2 exchange failed`),
      )
    }

    await indexedDbClient.loginWithSession(credentialBundle)

    this.userOrganizationId = organizationId

    return credentialBundle
  }

  public async refreshSession() {
    const session = await this.getSession()
    const indexedDbClient = await this.getIndexedDbClient()

    if (session.session?.token) {
      await indexedDbClient.refreshSession({
        sessionType: SessionType.READ_WRITE,
        expirationSeconds:
          this.metadata.expirationSeconds || DEFAULT_TURNKEY_REFRESH_SECONDS,
      })
      this.userOrganizationId = session.organizationId
      return session.session.token
    }

    throw new TurnkeyWalletSessionException(
      new Error('Session expired. Please login again.'),
    )
  }

  private async initClient(): Promise<{
    turnkey: Turnkey
    indexedDbClient: TurnkeyIndexedDbClient
  }> {
    const { metadata } = this
    const { turnkey, indexedDbClient } = await createTurnkeyClient(metadata)

    this.turnkey = turnkey
    this.indexedDbClient = indexedDbClient

    return { turnkey, indexedDbClient }
  }
}

async function createTurnkeyClient(metadata: TurnkeyMetadata) {
  const turnkey = new Turnkey(metadata)
  const indexedDbClient = await turnkey.indexedDbClient()
  await indexedDbClient.init()

  if (!turnkey) {
    throw new GeneralException(new Error('Turnkey is not initialized'))
  }

  return {
    turnkey,
    indexedDbClient,
  }
}
