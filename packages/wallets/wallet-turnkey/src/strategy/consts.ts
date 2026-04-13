export const TURNKEY_OAUTH_PATH = 'turnkey/oauth'
export const TURNKEY_OTP_PATH = 'turnkey/otp'
export const TURNKEY_OTP_INIT_PATH = `${TURNKEY_OTP_PATH}/init`
export const TURNKEY_OTP_VERIFY_PATH = `${TURNKEY_OTP_PATH}/verify`

export const DEFAULT_TURNKEY_REFRESH_SECONDS = '86400'

export const DEFAULT_EVM_CHAIN_CONFIG = {
  name: 'Injective',
  nativeCurrency: {
    name: 'Injective',
    symbol: 'INJ',
    decimals: 18,
  },
}
