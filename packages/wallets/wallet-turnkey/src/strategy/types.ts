export type TurnkeyErrorCodes = 7

export const TurnkeyErrorCodes = {
  UserLoggedOut: 7,
} as const

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

export type TurnkeyEnableArgs = TurnkeyOAuthArgs | TurnkeyEmailArgs

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
