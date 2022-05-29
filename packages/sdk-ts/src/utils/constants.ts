import { BigNumberInBase } from '@injectivelabs/utils'

export const INJ_DENOM = 'inj'

export const BECH32_PUBKEY_ACC_PREFIX = 'injpub'
export const BECH32_PUBKEY_VAL_PREFIX = 'injvaloperpub'
export const BECH32_PUBKEY_CONS_PREFIX = 'injvalconspub'

export const BECH32_ADDR_ACC_PREFIX = 'inj'
export const BECH32_ADDR_VAL_PREFIX = 'injvaloper'
export const BECH32_ADDR_CONS_PREFIX = 'injvalcons'

export const DEFAULT_DERIVATION_PATH = "m/44'/60'/0'/0/0"

export const DEFAULT_BRIDGE_FEE_DENOM = 'inj'
export const DEFAULT_BRIDGE_FEE_PRICE = '500000000'
export const DEFAULT_BRIDGE_FEE_AMOUNT = '200000000000000'
export const DEFAULT_TIMEOUT_HEIGHT = 40

export const DEFAULT_FEE_DENOM = 'inj'
export const DEFAULT_GAS_LIMIT = 400000
export const DEFAULT_EXCHANGE_GAS_LIMIT = 200000
export const DEFAULT_GAS_PRICE = 500000000

export const DUST_AMOUNT = 0.0001
export const PAGINATION_TOTAL_PAGE_LIMIT: number = 10000
export const DEFAULT_PAGINATION_TOTAL_COUNT: number = 1000000

export const DEFAULT_STD_FEE = {
  amount: [
    {
      amount: new BigNumberInBase(DEFAULT_GAS_LIMIT)
        .times(DEFAULT_GAS_PRICE)
        .toString(),
      denom: 'inj',
    },
  ],
  gas: DEFAULT_GAS_LIMIT.toString(),
}
