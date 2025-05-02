import { Turnkey, SessionType, TurnkeyIframeClient } from '@turnkey/sdk-browser'
import {
  ErrorType,
  WalletException,
  GeneralException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  WalletAction,
  TurnkeyStatus,
  TurnkeyMetadata,
} from '@injectivelabs/wallet-base'
import { getInjectiveAddress } from '@injectivelabs/sdk-ts'
import { HttpRestClient } from '@injectivelabs/utils'
import { createAccount } from '@turnkey/viem'
import { TurnkeyErrorCodes } from '../types.js'

export class TurnkeyWallet {
  protected iframeClient: TurnkeyIframeClient | undefined

  protected turnkey: Turnkey | undefined

  protected client: HttpRestClient

  private metadata: TurnkeyMetadata

  public status: TurnkeyStatus

  private accountMap: Record<
    string,
    Awaited<ReturnType<typeof createAccount>>
  > = {}

  private DOMIds: {
    turnkeyElementDOMId?: string
    turnkeyContainerDOMId?: string
  }

  constructor(metadata: TurnkeyMetadata) {
    this.metadata = metadata
    this.DOMIds = {
      turnkeyElementDOMId: metadata.iframeElementId,
      turnkeyContainerDOMId: metadata.iframeContainerId,
    }

    this.status = TurnkeyStatus.Initializing
    this.client = new HttpRestClient(metadata.apiBaseUrl)
  }

  public setStatus(status: TurnkeyStatus) {
    this.status = status
  }

  public async getTurnkey(): Promise<Turnkey> {
    if (!this.iframeClient) {
      await this.initFrame()
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

  public async getSession(existingCredentialBundle: string) {
    const { metadata } = this

    const iframeClient = await this.getIframeClient()
    const turnkey = await this.getTurnkey()

    const currentSession = await turnkey.getSession()
    const organizationId =
      currentSession?.organizationId || metadata.defaultOrganizationId
    const credentialBundle = existingCredentialBundle || currentSession?.token

    if (!credentialBundle) {
      return
    }

    try {
      const loginResult = await iframeClient.injectCredentialBundle(
        credentialBundle,
      )

      // If there is no session, we want to force a refresh to enable to browser SDK to handle key storage and proper session management.
      await iframeClient.refreshSession({
        sessionType: SessionType.READ_WRITE,
        targetPublicKey: iframeClient.iframePublicKey,
        expirationSeconds: '900',
      })

      const [session, user] = await Promise.all([
        turnkey.getSession(),
        iframeClient.getWhoami(),
      ])

      const actualOrganizationId =
        user?.organizationId || session?.organizationId || organizationId

      if (!loginResult) {
        return {
          session: '',
          organizationId: actualOrganizationId,
        }
      }

      return {
        session,
        organizationId: actualOrganizationId,
      }
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-wallet-get-session',
      })
    }
  }

  public async getAccounts(organizationId: string) {
    const iframeClient = await this.getIframeClient()

    try {
      const response = await iframeClient.getWallets({
        organizationId,
      })

      const accounts = await Promise.allSettled(
        response.wallets.map((wallet) =>
          iframeClient.getWalletAccounts({
            organizationId,
            walletId: wallet.walletId,
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
    } catch (e) {
      if ((e as any).code === TurnkeyErrorCodes.UserLoggedOut) {
        throw new WalletException(new Error('User is not logged in'), {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetAccounts,
          contextCode: TurnkeyErrorCodes.UserLoggedOut,
        })
      }

      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-wallet-get-accounts',
      })
    }
  }

  public async getOrCreateAndGetAccount(
    address: string,
    organizationId?: string,
  ) {
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

  private async initFrame(): Promise<void> {
    const { DOMIds, metadata } = this
    const turnkey = new Turnkey(metadata)

    const turnkeyAuthIframeElementId =
      DOMIds.turnkeyElementDOMId || 'turnkey-auth-iframe-element-id'

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

    this.iframeClient = iframeClient
  }
}
