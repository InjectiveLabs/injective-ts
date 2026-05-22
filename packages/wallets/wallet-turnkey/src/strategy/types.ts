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

export type TurnkeyOauthLoginResponse = {
  organizationId: string
  credentialBundle: string
  message: string
}
