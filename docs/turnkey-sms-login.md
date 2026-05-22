# Turnkey SMS Login Integration

Reference implementation: [`injective-true-current-mobile` — `broadcast.ts`](https://github.com/InjectiveLabs/injective-true-current-mobile/blob/139309f76c6b9c7a4e34c19332f0b14078dcba86/mobile/src/lib/transactions/broadcast.ts)

---

## Overview

SMS OTP login is functionally identical to the existing email OTP login — it hits the same two BFF
endpoints (`turnkey/otp/init` and `turnkey/otp/verify`) with the same response shapes. The only
difference is the request body key: `{ phone }` instead of `{ email }`.

**No new endpoints are needed on the BFF.** The BFF already dispatches to the correct Turnkey
activity based on whether it sees `email` or `phone` in the body.

---

## Flow Comparison

| Step | Email OTP (existing) | SMS OTP (new) |
|------|---------------------|---------------|
| 1. Init | `POST turnkey/otp/init` `{ email }` | `POST turnkey/otp/init` `{ phone }` |
| 2. User receives code | via email | via SMS |
| 3. Verify | `POST turnkey/otp/verify` `{ otpCode, otpId, suborgID, targetPublicKey }` | identical |
| 4. Create session | `indexedDbClient.loginWithSession(session)` | identical |

---

## Files to Change

All changes are inside `packages/wallets/wallet-turnkey/src/`.

| File | Change |
|------|--------|
| `strategy/types.ts` | Add `TurnkeySmsArgs` type and extend response type |
| `strategy/turnkey/otp.ts` | Add `initSmsOTP` static method to `TurnkeyOtpWallet` |
| `strategy/turnkey/turnkey.ts` | Add `initSms` method to `TurnkeyWallet` |
| `strategy/strategy.ts` | Add `initSmsOTP` method to `TurnkeyWalletStrategy` |

`confirmOTP` requires **no new code** — the verify call is identical for both channels.
The existing `TurnkeyWallet.confirmOTP()` and `TurnkeyWalletStrategy.confirmOTP()` methods
are reused directly for SMS OTP.

---

## Step-by-Step Implementation

### 1 — `strategy/types.ts`

Add a phone args type alongside the existing `TurnkeyEmailArgs`:

```typescript
export type TurnkeySmsArgs = {
  provider: 'sms'
  phone: string
  initSmsOTPEndpoint: string
}

export type TurnkeyEnableArgs = TurnkeyOAuthArgs | TurnkeyEmailArgs | TurnkeySmsArgs
```

Extend `TurnkeyOTPCredentialsResponse` if the BFF returns a phone-specific field (usually not
needed — same shape as email):

```typescript
// No change required — existing shape is sufficient:
export type TurnkeyOTPCredentialsResponse = {
  otpId: string
  organizationId: string
}
```

---

### 2 — `strategy/turnkey/otp.ts`

Add a `initSmsOTP` static method to `TurnkeyOtpWallet`, parallel to `initEmailOTP`.
The implementation is identical except the POST body uses `phone` instead of `email`.

```typescript
static async initSmsOTP(args: {
  phone: string
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
    const publicKey = await indexedDbClient.getPublicKey()

    if (!publicKey) {
      throw new WalletException(new Error('Public key not found'))
    }

    const response = await client.post<{
      data?: TurnkeyOTPCredentialsResponse
    }>(args.otpInitPath || TURNKEY_OTP_INIT_PATH, {
      targetPublicKey: publicKey,
      phone: args.phone,
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
      contextModule: 'turnkey-init-sms-otp',
    })
  }
}
```

> `confirmEmailOTP` is reused unchanged — it only handles the `otpCode` verification step which is
> channel-agnostic.

---

### 3 — `strategy/turnkey/turnkey.ts`

Add `initSms` to `TurnkeyWallet`, parallel to the existing `initOTP(email)`:

```typescript
public async initSms(phone: string) {
  const indexedDbClient = await this.getIndexedDbClient()

  const result = await TurnkeyOtpWallet.initSmsOTP({
    client: this.client,
    indexedDbClient,
    phone,
    otpInitPath: this.metadata.otpInitPath || TURNKEY_OTP_INIT_PATH,
  })

  if (!result || !result.otpId) {
    throw new WalletException(new Error('Failed to initialize SMS OTP'))
  }

  if (result?.organizationId) {
    this.userOrganizationId = result.organizationId
  }

  if (result?.otpId) {
    this.otpId = result.otpId
  }

  return result
}
```

The existing `confirmOTP(otpCode)` method is reused without modification — it calls
`TurnkeyOtpWallet.confirmEmailOTP` which only sends `otpCode + otpId + suborgID + targetPublicKey`
and those are identical for both channels.

---

### 4 — `strategy/strategy.ts`

Add `initSmsOTP` to `TurnkeyWalletStrategy`, parallel to `initOTP`:

```typescript
async initSmsOTP(phone: string) {
  const turnkeyWallet = await this.getTurnkeyWallet()
  return await turnkeyWallet.initSms(phone)
}
```

`confirmOTP` on the strategy does not change.

---

## Complete Auth Flow (SMS)

```
1. consumer calls:  strategy.initSmsOTP('+12345678901')
                        ↓
2. TurnkeyWallet.initSms(phone)
                        ↓
3. TurnkeyOtpWallet.initSmsOTP({ phone, ... })
                        ↓
4. POST turnkey/otp/init  { phone, targetPublicKey, isUsingIndexedDB, ... }
                        ↓
5. BFF sends SMS → user gets 6-digit code

6. consumer calls:  strategy.confirmOTP('123456')   ← existing, unchanged
                        ↓
7. TurnkeyWallet.confirmOTP(otpCode)
                        ↓
8. TurnkeyOtpWallet.confirmEmailOTP({ otpCode, otpId, organizationId, targetPublicKey })
                        ↓
9. POST turnkey/otp/verify  { otpCode, otpId, suborgID, targetPublicKey }
                        ↓
10. indexedDbClient.loginWithSession(result.session)
                        ↓
11. Session active — user can sign transactions
```

---

## Phone Number Format

Pass E.164 format to `initSmsOTP`: `+<country_code><number>` (e.g. `+12345678901`).
Formatting/validation (country picker, digit count) is a UI concern — not part of this package.

---

## What Does NOT Change

- `TURNKEY_OTP_INIT_PATH` / `TURNKEY_OTP_VERIFY_PATH` constants — same endpoints
- `TurnkeyOtpWallet.confirmEmailOTP` — verify step is channel-agnostic, reused as-is
- `TurnkeyWallet.confirmOTP` — no change
- `TurnkeyWalletStrategy.confirmOTP` — no change
- `TurnkeyOTPCredentialsResponse` / `TurnkeyConfirmEmailOTPResponse` types — same shapes
- All signing code — completely unrelated to auth channel

---

## Verification

1. `pnpm type-check` passes in `packages/wallets/wallet-turnkey`
2. Call `strategy.initSmsOTP('+<number>')` → BFF sends SMS, returns `{ otpId, organizationId }`
3. Call `strategy.confirmOTP('<6-digit-code>')` → session created, `getAddresses()` returns wallet addresses
4. Call `strategy.signEip712TypedData(...)` → transaction signs successfully
