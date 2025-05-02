export enum TurnkeyErrorCodes {
  UserLoggedOut = 7,
}

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
  credentialBundle: string
}

export type TurnkeyOauthLoginResponse = {
  credentialBundle: string
  message: string
}
