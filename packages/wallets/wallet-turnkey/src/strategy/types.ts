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
  organizationId: string
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

export type TurnkeyOAuth2AuthenticatedResponse = {
  email?: string
  session?: string
  userName?: string
  profileImageUrl?: string
  organizationId: string
  credentialBundle?: string
}

export type TurnkeyOAuth2ConfirmResponse = {
  email?: string
  session: string
  userName?: string
  profileImageUrl?: string
}

export type TurnkeyOauthProvider = {
  issuer: string
  subject: string
  audience: string
  providerId: string
  providerName: string
}
