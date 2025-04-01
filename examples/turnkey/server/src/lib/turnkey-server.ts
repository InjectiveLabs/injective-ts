import {
  DEFAULT_ETHEREUM_ACCOUNTS,
  Turnkey as TurnkeySDKClient,
} from "@turnkey/sdk-server";

if (
  !process.env.TURNKEY_ORGANIZATION_ID ||
  !process.env.TURNKEY_API_PRIVATE_KEY ||
  !process.env.TURNKEY_API_PUBLIC_KEY
) {
  throw new Error(
    "TURNKEY_ORGANIZATION_ID, TURNKEY_API_PRIVATE_KEY, and TURNKEY_API_PUBLIC_KEY must be set"
  );
}

export const defaultOrganizationId = process.env.TURNKEY_ORGANIZATION_ID;

export const turnkeyClient = new TurnkeySDKClient({
  defaultOrganizationId: process.env.TURNKEY_ORGANIZATION_ID!,
  apiBaseUrl: "https://api.turnkey.com",
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY!,
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY!,
});

export async function getOrCreateSubOrgIdsForEmail(email: string) {
  const apiClient = turnkeyClient.apiClient();

  const verifiedSubOrgResponse = await apiClient.getVerifiedSubOrgIds({
    organizationId: defaultOrganizationId,
    filterType: "EMAIL",
    filterValue: email,
  });

  if (
    verifiedSubOrgResponse &&
    verifiedSubOrgResponse.organizationIds &&
    verifiedSubOrgResponse.organizationIds.length > 0
  ) {
    return verifiedSubOrgResponse;
  }

  const createResponse = await apiClient.createSubOrganization({
    subOrganizationName: `suborg-${String(Date.now())}`,
    rootQuorumThreshold: 1,
    rootUsers: [
      {
        userName: email ?? "",
        userEmail: email ?? "",
        apiKeys: [],
        authenticators: [],
        oauthProviders: [],
      },
    ],
    wallet: {
      walletName: `Wallet 1`,
      accounts: [...DEFAULT_ETHEREUM_ACCOUNTS],
    },
  });

  return {
    organizationIds: [createResponse.subOrganizationId],
  };
}

export async function sendEmailOtp(email: string, organizationId: string) {
  try {
    const response = await turnkeyClient.apiClient().initOtpAuth({
      contact: email,
      otpType: "OTP_TYPE_EMAIL",
      organizationId,
    });
    if (!response.otpId) {
      throw new Error("Expected a non-null otpId.");
    }
    return { otpId: response.otpId, organizationId };
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function verifyEmailOtp({
  otpCode,
  otpId,
  targetPublicKey,
  suborgID,
  sessionLengthSeconds,
}: {
  otpId: string;
  otpCode: string;
  targetPublicKey: string;
  suborgID: string;
  sessionLengthSeconds?: number;
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
    });

    const { credentialBundle, apiKeyId, userId } = response;
    if (!credentialBundle || !apiKeyId || !userId) {
      throw new Error(
        "Expected non-null values for credentialBundle, apiKeyId, and userId."
      );
    }
    const session = {
      sessionType: "SESSION_TYPE_READ_WRITE",
      userId: userId,
      organizationId: suborgID,
      expiry: Date.now() + (sessionLengthSeconds ?? 9000) * 1000, // 900 is the default expiry time if you don't pass in a sessionLengthSeconds to the request. Request should probably return the expiry time, instead of hardcoding it.
      token: credentialBundle,
    };
    return session;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
