import { Network } from '@injectivelabs/networks'
import { DEFAULT_STD_FEE, DEFAULT_STD_FEE_BY_DENOM } from '@injectivelabs/utils'

export const BECH32_PUBKEY_ACC_PREFIX = 'injpub'
export const BECH32_PUBKEY_VAL_PREFIX = 'injvaloperpub'
export const BECH32_PUBKEY_CONS_PREFIX = 'injvalconspub'

export const BECH32_ADDR_ACC_PREFIX = 'inj'
export const BECH32_ADDR_VAL_PREFIX = 'injvaloper'
export const BECH32_ADDR_CONS_PREFIX = 'injvalcons'

export const DEFAULT_DERIVATION_PATH = "m/44'/60'/0'/0/0"

export const DUST_AMOUNT = 0.0001
export const PAGINATION_TOTAL_PAGE_LIMIT: number = 10000
export const DEFAULT_PAGINATION_TOTAL_COUNT: number = 1000000

export const CW20_ADAPTER_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.MainnetLB]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.MainnetK8s]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.Public]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.Staging]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.Testnet]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.TestnetK8s]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.TestnetOld]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.Devnet]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.Devnet1]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.Devnet2]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.Local]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
}

export { DEFAULT_STD_FEE, DEFAULT_STD_FEE_BY_DENOM }
