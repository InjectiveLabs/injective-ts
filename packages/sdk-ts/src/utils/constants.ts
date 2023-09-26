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
  [Network.MainnetSentry]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.Public]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.Staging]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.Internal]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.Testnet]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.TestnetK8s]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.TestnetSentry]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.TestnetOld]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.Devnet]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.Devnet1]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.Devnet2]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.Local]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
}

export const CW20_SWAP_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.MainnetLB]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.MainnetK8s]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.MainnetSentry]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.Public]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.Staging]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.Internal]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.Testnet]: 'inj14d7h5j6ddq6pqppl65z24w7xrtmpcrqjxj8d43',
  [Network.TestnetK8s]: 'inj14d7h5j6ddq6pqppl65z24w7xrtmpcrqjxj8d43',
  [Network.TestnetSentry]: 'inj14d7h5j6ddq6pqppl65z24w7xrtmpcrqjxj8d43',
  [Network.TestnetOld]: 'inj14d7h5j6ddq6pqppl65z24w7xrtmpcrqjxj8d43',
  [Network.Devnet]: 'inj177yh38g3ctu7cemxpa3c2kvwh2yslfxfmfa66h',
  [Network.Devnet1]: 'inj177yh38g3ctu7cemxpa3c2kvwh2yslfxfmfa66h',
  [Network.Devnet2]: 'inj177yh38g3ctu7cemxpa3c2kvwh2yslfxfmfa66h',
  [Network.Local]: 'inj177yh38g3ctu7cemxpa3c2kvwh2yslfxfmfa66h',
}

export const INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: 'inj1hm8vs8sr2h9nk0x66vctfs528wrp6k3gtgg275',
  [Network.MainnetLB]: 'inj1hm8vs8sr2h9nk0x66vctfs528wrp6k3gtgg275',
  [Network.MainnetK8s]: 'inj1hm8vs8sr2h9nk0x66vctfs528wrp6k3gtgg275',
  [Network.MainnetSentry]: 'inj1hm8vs8sr2h9nk0x66vctfs528wrp6k3gtgg275',
  [Network.Public]: 'inj1hm8vs8sr2h9nk0x66vctfs528wrp6k3gtgg275',
  [Network.Staging]: 'inj1hm8vs8sr2h9nk0x66vctfs528wrp6k3gtgg275',
  [Network.Internal]: 'inj1hm8vs8sr2h9nk0x66vctfs528wrp6k3gtgg275',
  [Network.Testnet]: 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa',
  [Network.TestnetK8s]: 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa',
  [Network.TestnetSentry]: 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa',
  [Network.TestnetOld]: 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa',
  [Network.Devnet]: 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa',
  [Network.Devnet1]: 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa',
  [Network.Devnet2]: 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa',
  [Network.Local]: 'inj1aw59rkpd9afp2ws6rx23nz5mrvq8dlckeslwfa',
}

export const INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: 'inj1x9m0hceug9qylcyrrtwqtytslv2jrph433thgu',
  [Network.MainnetLB]: 'inj1x9m0hceug9qylcyrrtwqtytslv2jrph433thgu',
  [Network.MainnetK8s]: 'inj1x9m0hceug9qylcyrrtwqtytslv2jrph433thgu',
  [Network.MainnetSentry]: 'inj1x9m0hceug9qylcyrrtwqtytslv2jrph433thgu',
  [Network.Public]: 'inj1x9m0hceug9qylcyrrtwqtytslv2jrph433thgu',
  [Network.Staging]: 'inj1x9m0hceug9qylcyrrtwqtytslv2jrph433thgu',
  [Network.Internal]: 'inj1x9m0hceug9qylcyrrtwqtytslv2jrph433thgu',
  [Network.Testnet]: 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v',
  [Network.TestnetK8s]: 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v',
  [Network.TestnetSentry]: 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v',
  [Network.TestnetOld]: 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v',
  [Network.Devnet]: 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v',
  [Network.Devnet1]: 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v',
  [Network.Devnet2]: 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v',
  [Network.Local]: 'inj1knf6puyscuuqqhgqglskfc0k99d4885qw5uv7v',
}

export { DEFAULT_STD_FEE, DEFAULT_STD_FEE_BY_DENOM }
