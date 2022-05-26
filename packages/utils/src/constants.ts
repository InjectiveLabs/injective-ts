import BigNumberInBase from './classes/BigNumberInBase'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const DEFAULT_GAS_LIMIT = 400000
export const DEFAULT_GAS_PRICE = 500000000
export const DEFAULT_EXCHANGE_LIMIT = 200000
export const DEFAULT_BRIDGE_FEE_DENOM = 'inj'
export const DEFAULT_BRIDGE_FEE_PRICE = '500000000'
export const DEFAULT_BRIDGE_FEE_AMOUNT = '200000000000000'
export const DEFAULT_TIMEOUT_HEIGHT = 40

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
