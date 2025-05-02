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
    providerName: 'google' //TODO: apple
    expirationSeconds?: number
    iframeClient: TurnkeyIframeClient
  }): Promise<string | void> {
    const { client, iframeClient } = args

    try {
      const targetPublicKey = iframeClient.iframePublicKey

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }

      const response = await client.$post<TurnkeyOauthLoginResponse>(
        TURNKEY_OAUTH_PATH,
        {
          targetPublicKey,
          oidcToken: args.oidcToken,
          providerName: args.providerName,
        },
      )

      return response.credentialBundle
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-oauth-login',
      })
    }
  }
}
