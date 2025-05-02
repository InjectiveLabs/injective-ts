import { type TurnkeyIframeClient } from '@turnkey/sdk-browser'
import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  type TurnkeyConfirmEmailOTPResponse,
  type TurnkeyOTPCredentialsResponse,
} from './../types.js'
import { type HttpRestClient } from '@injectivelabs/utils'
import { TURNKEY_OTP_INIT_PATH, TURNKEY_OTP_VERIFY_PATH } from '../consts.js'

export class TurnkeyOtpWallet {
  static async initEmailOTP(args: {
    email: string
    subOrgId?: string
    client: HttpRestClient
    iframeClient: TurnkeyIframeClient
    invalidateExistingSessions?: boolean
  }) {
    const { client, iframeClient } = args

    try {
      const targetPublicKey = iframeClient.iframePublicKey

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }

      const response = await client.$post<TurnkeyOTPCredentialsResponse>(
        TURNKEY_OTP_INIT_PATH,
        {
          targetPublicKey,
          email: args.email,
          suborgId: args.subOrgId,
          invalidateExistingSessions: args.invalidateExistingSessions,
        },
      )

      return response
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-init-email-otp',
      })
    }
  }

  static async confirmEmailOTP(args: {
    otpCode: string
    emailOTPId?: string
    client: HttpRestClient
    organizationId?: string
    iframeClient: TurnkeyIframeClient
  }) {
    const { client, iframeClient } = args

    try {
      const organizationId = args.organizationId
      const emailOTPId = args.emailOTPId
      const targetPublicKey = iframeClient.iframePublicKey

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }

      if (!emailOTPId) {
        throw new WalletException(new Error('Email OTP ID is required'))
      }

      if (!organizationId) {
        throw new WalletException(new Error('Organization ID is required'))
      }

      const response = await client.$post<TurnkeyConfirmEmailOTPResponse>(
        TURNKEY_OTP_VERIFY_PATH,
        {
          otpId: emailOTPId,
          otpCode: args.otpCode,
          suborgID: organizationId,
          targetPublicKey,
        },
      )

      return response
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: 'turnkey-confirm-email-otp',
      })
    }
  }
}
