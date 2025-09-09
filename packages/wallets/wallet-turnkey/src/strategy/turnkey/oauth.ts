import { sha256 } from '@injectivelabs/sdk-ts'
import { type HttpRestClient } from '@injectivelabs/utils'
import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  DEFAULT_TURNKEY_REFRESH_SECONDS,
  TURNKEY_OAUTH_PATH,
} from '../consts.js'
import type { TurnkeyOauthLoginResponse } from '../types.js'
import type { TurnkeyIndexedDbClient } from '@turnkey/sdk-browser'

export class TurnkeyOauthWallet {
  static async generateOAuthNonce(indexedDbClient: TurnkeyIndexedDbClient) {
    try {
      await indexedDbClient.resetKeyPair()
      const targetPublicKey = await indexedDbClient.getPublicKey()

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }

      return Array.from(sha256(new TextEncoder().encode(targetPublicKey)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    } catch (e: any) {
      throw new WalletException(new Error(e.message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-generate-oauth-nonce',
      })
    }
  }

  static async oauthLogin(args: {
    oidcToken: string
    client: HttpRestClient
    oauthLoginPath?: string
    providerName: 'google' | 'apple'
    indexedDbClient: TurnkeyIndexedDbClient
    expirationSeconds?: number
  }): Promise<
    { organizationId: string; credentialBundle: string } | undefined
  > {
    const { client, indexedDbClient, expirationSeconds } = args

    const path = args.oauthLoginPath || TURNKEY_OAUTH_PATH

    try {
      const targetPublicKey = await indexedDbClient.getPublicKey()

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }
      // client.$post is undefined, resorting to this for now
      const response = await client.post<{
        data: TurnkeyOauthLoginResponse
      }>(path, {
        targetPublicKey,
        oidcToken: args.oidcToken,
        providerName: args.providerName,
        expirationSeconds: (
          expirationSeconds || DEFAULT_TURNKEY_REFRESH_SECONDS
        )?.toString(),
      })

      return response.data
    } catch (e: any) {
      throw new WalletException(new Error(e.message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-oauth-login',
      })
    }
  }
}
