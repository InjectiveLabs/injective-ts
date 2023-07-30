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
  [Network.Internal]: 'inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk',
  [Network.Testnet]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
  [Network.TestnetK8s]: 'inj1hdvy6tl89llqy3ze8lv6mz5qh66sx9enn0jxg6',
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
  [Network.Public]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.Staging]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.Internal]: 'inj1psk3468yr9teahgz73amwvpfjehnhczvkrhhqx',
  [Network.Testnet]: 'inj14d7h5j6ddq6pqppl65z24w7xrtmpcrqjxj8d43',
  [Network.TestnetK8s]: 'inj14d7h5j6ddq6pqppl65z24w7xrtmpcrqjxj8d43',
  [Network.TestnetOld]: 'inj14d7h5j6ddq6pqppl65z24w7xrtmpcrqjxj8d43',
  [Network.Devnet]: 'inj177yh38g3ctu7cemxpa3c2kvwh2yslfxfmfa66h',
  [Network.Devnet1]: 'inj177yh38g3ctu7cemxpa3c2kvwh2yslfxfmfa66h',
  [Network.Devnet2]: 'inj177yh38g3ctu7cemxpa3c2kvwh2yslfxfmfa66h',
  [Network.Local]: 'inj177yh38g3ctu7cemxpa3c2kvwh2yslfxfmfa66h',
}

export const CW20_STAKING_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: '',
  [Network.MainnetLB]: '',
  [Network.MainnetK8s]: '',
  [Network.Public]: '',
  [Network.Staging]: '',
  [Network.Testnet]: 'inj1pxzykc8qry3ytxwxr3ua72tn6e4wvusj40yy2w',
  [Network.TestnetK8s]: 'inj1pxzykc8qry3ytxwxr3ua72tn6e4wvusj40yy2w',
  [Network.TestnetOld]: 'inj1pxzykc8qry3ytxwxr3ua72tn6e4wvusj40yy2w',
  [Network.Devnet]: 'inj15r735cjk9m6ujxtqn9zgxtdhd2lfzslde6c0s5',
  [Network.Devnet1]: 'inj15r735cjk9m6ujxtqn9zgxtdhd2lfzslde6c0s5',
  [Network.Devnet2]: 'inj15r735cjk9m6ujxtqn9zgxtdhd2lfzslde6c0s5',
  [Network.Local]: 'inj15r735cjk9m6ujxtqn9zgxtdhd2lfzslde6c0s5',
}

export const CW20_ALLOCATOR_CONTRACT_BY_NETWORK = {
  [Network.Mainnet]: '',
  [Network.MainnetLB]: '',
  [Network.MainnetK8s]: '',
  [Network.Public]: '',
  [Network.Staging]: '',
  [Network.Testnet]: 'inj1qsft9ptmywulv5hjzufl77j784sr9hf5yj6fwx',
  [Network.TestnetK8s]: 'inj1qsft9ptmywulv5hjzufl77j784sr9hf5yj6fwx',
  [Network.TestnetOld]: 'inj1qsft9ptmywulv5hjzufl77j784sr9hf5yj6fwx',
  [Network.Devnet]: 'inj1nu9wf9dw384attnpu0pwfet5fajn05w2xp99u3',
  [Network.Devnet1]: 'inj1nu9wf9dw384attnpu0pwfet5fajn05w2xp99u3',
  [Network.Devnet2]: 'inj1nu9wf9dw384attnpu0pwfet5fajn05w2xp99u3',
  [Network.Local]: 'inj1nu9wf9dw384attnpu0pwfet5fajn05w2xp99u3',
}

export const CW20_MITO_MASTER_CONTRACT_CODE_ID = 1573

export { DEFAULT_STD_FEE, DEFAULT_STD_FEE_BY_DENOM }
