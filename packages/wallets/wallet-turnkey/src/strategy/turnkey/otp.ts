import { SessionType, type TurnkeyIframeClient } from '@turnkey/sdk-browser'
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
    otpInitPath?: string
  }) {
    const { client, iframeClient } = args

    try {
      const targetPublicKey = iframeClient.iframePublicKey

      if (!targetPublicKey) {
        throw new WalletException(new Error('Target public key not found'))
      }

      const response = await client.$post<TurnkeyOTPCredentialsResponse>(
        args.otpInitPath || TURNKEY_OTP_INIT_PATH,
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
    otpVerifyPath?: string
  }) {
    const { client, iframeClient } = args

    try {
      const organizationId = args.organizationId
      const emailOTPId = args.emailOTPId
      const targetPublicKey = iframeClient.iframePublicKey
      const otpVerifyPath = args.otpVerifyPath || TURNKEY_OTP_VERIFY_PATH

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
        otpVerifyPath,
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

  // TODO: should be able to remove this

  static async loginUser(args: {
    client: HttpRestClient
    iframeClient: TurnkeyIframeClient
    organizationId: string
    otpCode: string
    emailOTPId: string
    setMetadata: (metadata: { turnkey: { credentialBundle: string } }) => void
  }) {
    const {
      client,
      iframeClient,
      organizationId,
      otpCode,
      emailOTPId,
      setMetadata,
    } = args

    const result = await TurnkeyOtpWallet.confirmEmailOTP({
      client,
      iframeClient,
      otpCode,
      emailOTPId,
      organizationId,
    })

    console.log('🪵 | TurnkeyOtpWallet | result:', result)

    if (result.credentialBundle) {
      setMetadata({
        turnkey: {
          credentialBundle: result.credentialBundle,
        },
      })

      await iframeClient.injectCredentialBundle(result.credentialBundle)

      await iframeClient.refreshSession({
        sessionType: SessionType.READ_WRITE,
        targetPublicKey: iframeClient.iframePublicKey,
        expirationSeconds: '900',
      })
    }
  }
}
