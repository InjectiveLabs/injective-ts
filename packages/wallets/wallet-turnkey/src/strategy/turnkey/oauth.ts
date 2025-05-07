import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { sha256 } from '@injectivelabs/sdk-ts'
import type { TurnkeyOauthLoginResponse } from '../types.js'
import type { TurnkeyIframeClient } from '@turnkey/sdk-browser'
import { type HttpRestClient } from '@injectivelabs/utils'
import { TURNKEY_OAUTH_PATH } from '../consts.js'

export class TurnkeyOauthWallet {
  static async generateOAuthNonce(iframeClient: TurnkeyIframeClient) {
    try {
      const targetPublicKey = iframeClient.iframePublicKey

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }

      return Array.from(sha256(new TextEncoder().encode(targetPublicKey)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-generate-oauth-nonce',
      })
    }
  }

  static async oauthLogin(args: {
    client: HttpRestClient
    oidcToken: string
    providerName: 'google' | 'apple'
    expirationSeconds?: number
    iframeClient: TurnkeyIframeClient
    oauthLoginPath?: string
  }): Promise<{ credentialBundle: string } | void> {
    const { client, iframeClient } = args

    const path = args.oauthLoginPath || TURNKEY_OAUTH_PATH

    try {
      const targetPublicKey = iframeClient.iframePublicKey

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }

      const response = await client.$post<TurnkeyOauthLoginResponse>(path, {
        targetPublicKey,
        oidcToken: args.oidcToken,
        providerName: args.providerName,
      })

      return response
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-oauth-login',
      })
    }
  }

  // TODO: should be able to remove this
  static async loginUser(args: {
    iframeClient: TurnkeyIframeClient
    client: HttpRestClient
    oidcToken: string
    providerName: 'google' | 'apple'
    setMetadata: (metadata: { turnkey: { credentialBundle: string } }) => void
  }) {
    const { client, iframeClient, oidcToken, providerName } = args
    const result = await TurnkeyOauthWallet.oauthLogin({
      client,
      iframeClient,
      oidcToken,
      providerName,
    })

    if (result?.credentialBundle) {
      args.setMetadata({
        turnkey: {
          credentialBundle: result.credentialBundle,
        },
      })
      iframeClient.injectCredentialBundle(result.credentialBundle)
    }
  }
}
