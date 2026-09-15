export const BECH32_PUBKEY_ACC_PREFIX = 'injpub'
export const BECH32_PUBKEY_VAL_PREFIX = 'injvaloperpub'
export const BECH32_PUBKEY_CONS_PREFIX = 'injvalconspub'

export const BECH32_ADDR_ACC_PREFIX = 'inj'
export const BECH32_ADDR_VAL_PREFIX = 'injvaloper'
export const BECH32_ADDR_CONS_PREFIX = 'injvalcons'

export const DEFAULT_DERIVATION_PATH = "m/44'/60'/0'/0/0"

/**
 * gRPC-web metadata key used to carry a client-reported IP address on outgoing
 * requests. Note: unlike a proxy-set X-Forwarded-For header, this value is
 * self-reported by the caller (e.g. resolved client-side via a third-party IP
 * lookup) and should be treated as a best-effort, spoofable signal.
 */
export const GRPC_METADATA_FORWARDED_FOR_HEADER = 'x-forwarded-for'
