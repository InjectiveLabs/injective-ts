import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  TURNKEY_OTP_INIT_PATH,
  TURNKEY_OTP_VERIFY_PATH,
  DEFAULT_TURNKEY_REFRESH_SECONDS,
} from '../consts.js'
import type { HttpRestClient } from '@injectivelabs/utils'
import type { TurnkeyIndexedDbClient } from '@turnkey/sdk-browser'
import type {
  TurnkeyOTPCredentialsResponse,
  TurnkeyConfirmEmailOTPResponse,
} from './../types.js'

export class TurnkeyOtpWallet {
  static async initEmailOTP(args: {
    email: string
    subOrgId?: string
    otpInitPath?: string
    client: HttpRestClient
    indexedDbClient: TurnkeyIndexedDbClient
    invalidateExistingSessions?: boolean
    expirationSeconds?: number
  }) {
    const { client, indexedDbClient, expirationSeconds } = args

    try {
      await indexedDbClient.resetKeyPair()
      let publicKey = await indexedDbClient.getPublicKey()

      if (!publicKey) {
        throw new WalletException(new Error('Public key not found'))
      }

      // client.$post is undefined, resorting to this for now
      const response = await client.post<{
        data?: TurnkeyOTPCredentialsResponse
      }>(args.otpInitPath || TURNKEY_OTP_INIT_PATH, {
        targetPublicKey: publicKey,
        email: args.email,
        suborgId: args.subOrgId,
        invalidateExistingSessions: args.invalidateExistingSessions,
        isUsingIndexedDB: true,
        expirationSeconds: expirationSeconds || DEFAULT_TURNKEY_REFRESH_SECONDS,
      })

      return response?.data
    } catch (e: any) {
      throw new WalletException(new Error(e.message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-init-email-otp',
      })
    }
  }

  static async initSmsOTP(args: {
    phone: string
    subOrgId?: string
    otpInitPath?: string
    client: HttpRestClient
    expirationSeconds?: number
    invalidateExistingSessions?: boolean
    indexedDbClient: TurnkeyIndexedDbClient
  }) {
    const { client, indexedDbClient, expirationSeconds } = args

    try {
      await indexedDbClient.resetKeyPair()
      const publicKey = await indexedDbClient.getPublicKey()

      if (!publicKey) {
        throw new WalletException(new Error('Public key not found'))
      }

      const response = await client.post<{
        data?: TurnkeyOTPCredentialsResponse
      }>(args.otpInitPath || TURNKEY_OTP_INIT_PATH, {
        phone: args.phone,
        isUsingIndexedDB: true,
        suborgId: args.subOrgId,
        targetPublicKey: publicKey,
        invalidateExistingSessions: args.invalidateExistingSessions,
        expirationSeconds: expirationSeconds || DEFAULT_TURNKEY_REFRESH_SECONDS,
      })

      return response?.data
    } catch (e: any) {
      throw new WalletException(new Error(e.message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-init-sms-otp',
      })
    }
  }

  static async confirmEmailOTP(args: {
    otpCode: string
    emailOTPId: string
    client: HttpRestClient
    targetPublicKey: string
    organizationId: string
    otpVerifyPath?: string
    expirationSeconds?: number
  }) {
    const { client, expirationSeconds, targetPublicKey } = args

    try {
      const organizationId = args.organizationId
      const emailOTPId = args.emailOTPId
      const otpVerifyPath = args.otpVerifyPath || TURNKEY_OTP_VERIFY_PATH

      if (!emailOTPId) {
        throw new WalletException(new Error('Email OTP ID is required'))
      }

      if (!organizationId) {
        throw new WalletException(new Error('Organization ID is required'))
      }

      const response = await client.post<{
        data?: TurnkeyConfirmEmailOTPResponse
      }>(otpVerifyPath, {
        isUsingIndexedDB: true,
        targetPublicKey,
        otpId: emailOTPId,
        otpCode: args.otpCode,
        suborgID: organizationId,
        expirationSeconds: (
          expirationSeconds || DEFAULT_TURNKEY_REFRESH_SECONDS
        )?.toString(),
      })

      return response?.data
    } catch (e: any) {
      throw new WalletException(new Error(e.message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-confirm-email-otp',
      })
    }
  }
}
