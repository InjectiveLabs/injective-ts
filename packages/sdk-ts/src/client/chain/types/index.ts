export * from './auction'
export * from './auth-rest'
export * from './bank-rest'
export * from './tendermint-rest'
export * from './bank'
export * from './derivatives'
export * from './distribution'
export * from './exchange'
export * from './gov'
export * from './insurance'
export * from './mint'
export * from './oracle'
export * from './peggy'
export * from './spot'
export * from './staking'
export * from './wasm'

export interface RestApiResponse<T> {
  data: T
}

export enum ChainModule {
  Auction = 'chain-auction',
  Auth = 'chain-auth',
  Bank = 'chain-bank',
  Distribution = 'chain-distribution',
  Exchange = 'chain-exchange',
  Gov = 'chain-gov',
  Ibc = 'chain-ibc',
  InsuranceFund = 'chain-insurance',
  Mint = 'chain-mint',
  Oracle = 'chain-oracle',
  Peggy = 'chain-peggy',
  Staking = 'chain-staking',
  Wasm = 'chain-wasm',
  WasmX = 'chain-wasmx',
}
