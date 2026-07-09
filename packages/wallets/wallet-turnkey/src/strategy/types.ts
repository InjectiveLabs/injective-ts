import type { TurnkeyOAuthProvider } from '@injectivelabs/wallet-base'

export const TurnkeyErrorCodes = {
  UserLoggedOut: 7,
} as const

export type TurnkeyErrorCodes =
  (typeof TurnkeyErrorCodes)[keyof typeof TurnkeyErrorCodes]

export type TurnkeyOAuthArgs = {
  provider: 'google'
  oidcToken: string
  oauthLoginEndpoint: string
}

export type TurnkeyEmailArgs = {
  provider: 'email'
  email: string
  initEmailOTPEndpoint: string
}

export type TurnkeySmsArgs = {
  provider: 'sms'
  phone: string
  initSmsOTPEndpoint: string
}

export type TurnkeyEnableArgs =
  | TurnkeyOAuthArgs
  | TurnkeyEmailArgs
  | TurnkeySmsArgs

export type TurnkeyOTPCredentialsResponse = {
  otpId: string
  email?: string
  userName?: string
  organizationId: string
  status?: 'existing_account_detected'
}

export type TurnkeyConfirmEmailOTPResponse = {
  session: string
  organizationId: string
}

export type TurnkeyOauthAuthenticatedResponse = {
  message?: string
  organizationId: string
  credentialBundle: string
}

export type TurnkeyExistingAccountDetectedResponse = {
  email?: string
  message?: string
  userName?: string
  organizationId: string
  credentialBundle: string
  status: 'existing_account_detected'
}

export type TurnkeyOAuth2AuthenticatedResponse = {
  email?: string
  organizationId: string
  status?: 'authenticated'
  credentialBundle: string
}

export type TurnkeyOAuth2LinkRequiredResponse = {
  email: string
  oidcToken: string
  expiresAt?: number
  organizationId: string
  status: 'link_required'
  providerName: TurnkeyOAuthProvider
}

export type TurnkeyOAuthLinkRequiredResponse = TurnkeyOAuth2LinkRequiredResponse

export type TurnkeyOAuth2Response =
  | TurnkeyOAuth2AuthenticatedResponse
  | TurnkeyOAuth2LinkRequiredResponse
  | TurnkeyExistingAccountDetectedResponse

export type TurnkeyOauthLoginResponse =
  | TurnkeyOauthAuthenticatedResponse
  | TurnkeyOAuth2LinkRequiredResponse
  | TurnkeyExistingAccountDetectedResponse

export type TurnkeyOAuthConfirmResponse =
  | string
  | TurnkeyOAuthLinkRequiredResponse
  | TurnkeyExistingAccountDetectedResponse

export type TurnkeyOAuth2ConfirmResponse =
  | {
      email?: string
      session: string
    }
  | TurnkeyOAuthLinkRequiredResponse

export type TurnkeyLinkOAuthProviderResponse = {
  organizationId: string
}

export type TurnkeyOauthProvider = {
  issuer: string
  subject: string
  audience: string
  providerId: string
  providerName: string
}
