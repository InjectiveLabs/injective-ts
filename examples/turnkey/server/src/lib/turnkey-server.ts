import {
  DEFAULT_ETHEREUM_ACCOUNTS,
  Turnkey as TurnkeySDKClient,
  type TurnkeyApiTypes,
} from '@turnkey/sdk-server'
import { decodeJwt } from './utils.js'

if (
  !process.env.TURNKEY_ORGANIZATION_ID ||
  !process.env.TURNKEY_API_PRIVATE_KEY ||
  !process.env.TURNKEY_API_PUBLIC_KEY
) {
  throw new Error(
    'TURNKEY_ORGANIZATION_ID, TURNKEY_API_PRIVATE_KEY, and TURNKEY_API_PUBLIC_KEY must be set',
  )
}

export const defaultOrganizationId = process.env.TURNKEY_ORGANIZATION_ID

export const turnkeyClient = new TurnkeySDKClient({
  defaultOrganizationId,
  apiBaseUrl: 'https://api.turnkey.com',
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
})

const apiClient = turnkeyClient.apiClient()

export type OAuthProviderParams = {
  providerName: string
  oidcToken: string
}
export type Attestation = TurnkeyApiTypes['v1Attestation']

type CreateSubOrgParams = {
  email?: string
  phone?: string
  passkey?: {
    name?: string
    challenge: string
    attestation: Attestation
  }
  oauth?: OAuthProviderParams
}

async function createSubOrg(params: CreateSubOrgParams) {
  const { email, phone, passkey, oauth } = params

  const authenticators = passkey
    ? [
        {
          authenticatorName: 'Passkey',
          challenge: passkey.challenge,
          attestation: passkey.attestation,
        },
      ]
    : []

  const oauthProviders = oauth
    ? [
        {
          providerName: oauth.providerName,
          oidcToken: oauth.oidcToken,
        },
      ]
    : []

  let userEmail = email

  if (oauth) {
    const decoded = decodeJwt(oauth.oidcToken)
    console.log('🪵 | createSubOrg | decoded:', decoded)
    if (decoded?.email) {
      userEmail = decoded.email
    }
  }

  const userPhoneNumber = phone
  const subOrganizationName = `Sub Org - ${userEmail || phone}`
  const userName = userEmail ? userEmail.split('@')[0] || userEmail : ''

  const result = await apiClient.createSubOrganization({
    organizationId: defaultOrganizationId,
    subOrganizationName,
    rootUsers: [
      {
        userName,
        userEmail,
        userPhoneNumber,
        oauthProviders,
        authenticators,
        apiKeys: [],
      },
    ],
    rootQuorumThreshold: 1,
    wallet: {
      walletName: 'Default Wallet',
      accounts: DEFAULT_ETHEREUM_ACCOUNTS,
    },
  })

  return { subOrganizationId: result.subOrganizationId }
}

export async function initEmailOtp(email: string) {
  try {
    let organizationId = defaultOrganizationId

    const { organizationIds } = await apiClient.getSubOrgIds({
      organizationId: defaultOrganizationId,
      filterType: 'EMAIL',
      filterValue: email,
    })

    if (organizationIds.length > 0) {
      organizationId = organizationIds[0]
    } else {
      const subOrgResponse = await createSubOrg({ email })
      organizationId = subOrgResponse.subOrganizationId
    }

    const response = await turnkeyClient.apiClient().initOtpAuth({
      contact: email,
      otpType: 'OTP_TYPE_EMAIL',
      organizationId,
    })

    if (!response.otpId) {
      throw new Error('Expected a non-null otpId.')
    }
    return { otpId: response.otpId, organizationId }
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function verifyEmailOtp({
  otpCode,
  otpId,
  targetPublicKey,
  suborgID,
  sessionLengthSeconds,
}: {
  otpId: string
  otpCode: string
  targetPublicKey: string
  suborgID: string
  sessionLengthSeconds?: number
}) {
  try {
    const response = await turnkeyClient.apiClient().otpAuth({
      otpId,
      otpCode,
      targetPublicKey,
      organizationId: suborgID,
      expirationSeconds: sessionLengthSeconds
        ? sessionLengthSeconds.toString()
        : undefined,
    })

    const { credentialBundle, apiKeyId, userId } = response
    if (!credentialBundle || !apiKeyId || !userId) {
      throw new Error(
        'Expected non-null values for credentialBundle, apiKeyId, and userId.',
      )
    }
    const session = {
      sessionType: 'SESSION_TYPE_READ_WRITE',
      userId: userId,
      organizationId: suborgID,
      expiry: Date.now() + (sessionLengthSeconds ?? 9000) * 1000, // 900 is the default expiry time if you don't pass in a sessionLengthSeconds to the request. Request should probably return the expiry time, instead of hardcoding it.
      token: credentialBundle,
    }
    return session
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function oauthLogin(params: {
  oidcToken: string
  providerName: string
  targetPublicKey: string
  expirationSeconds?: number
}) {
  const { oidcToken, providerName, targetPublicKey, expirationSeconds } = params
  let organizationId = defaultOrganizationId

  const decoded = decodeJwt(oidcToken)
  const userEmail = decoded?.email
  console.log('🪵 | userEmail:', userEmail)

  const { organizationIds: emailOrgs } = await apiClient.getSubOrgIds({
    organizationId: defaultOrganizationId,
    filterType: 'EMAIL',
    filterValue: userEmail,
  })

  const { organizationIds: oidcOrgs } = await apiClient.getSubOrgIds({
    organizationId: defaultOrganizationId,
    filterType: 'OIDC_TOKEN',
    filterValue: oidcToken,
  })

  // If oidcOrgs is empty, but emailOrgs is not then we need to tell the user to login with OTP
  if (oidcOrgs.length === 0 && emailOrgs.length > 0) {
    return {
      credentialBundle: null,
      message: 'Please login with email OTP',
    }
  }

  if (oidcOrgs.length > 0) {
    organizationId = oidcOrgs[0]
  } else {
    const subOrgResponse = await createSubOrg({
      oauth: { oidcToken, providerName },
    })
    organizationId = subOrgResponse.subOrganizationId
  }

  console.log('🪵 | organizationId:', organizationId)

  const oauthResponse = await apiClient.oauth({
    organizationId,
    oidcToken,
    targetPublicKey,
    expirationSeconds: expirationSeconds?.toString(),
  })

  return {
    credentialBundle: oauthResponse.credentialBundle as string,
    message: 'success',
  }
}
