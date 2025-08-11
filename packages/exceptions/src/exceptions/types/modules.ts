export type ContractErrorModule =
  | 'erc20-contract'
  | 'peggy-contract'
  | 'peggy-old-contract'

export const ContractErrorModule = {
  Erc20Contract: 'erc20-contract',
  Peggy: 'peggy-contract',
  PeggyOld: 'peggy-old-contract',
} as const

export type ChainErrorModule =
  | 'chain-auction'
  | 'chain-auth'
  | 'chain-authz'
  | 'chain-bank'
  | 'chain-distribution'
  | 'chain-exchange'
  | 'chain-gov'
  | 'chain-ibc'
  | 'chain-insurance'
  | 'chain-mint'
  | 'chain-oracle'
  | 'chain-peggy'
  | 'chain-staking'
  | 'chain-wasm'
  | 'chain-wasmx'
  | 'chain-tendermint'
  | 'chain-permissions'
  | 'chain-tx-fees'

export const ChainErrorModule = {
  Auction: 'chain-auction',
  Auth: 'chain-auth',
  Authz: 'chain-authz',
  Bank: 'chain-bank',
  Distribution: 'chain-distribution',
  Exchange: 'chain-exchange',
  Gov: 'chain-gov',
  Ibc: 'chain-ibc',
  InsuranceFund: 'chain-insurance',
  Mint: 'chain-mint',
  Oracle: 'chain-oracle',
  Peggy: 'chain-peggy',
  Staking: 'chain-staking',
  Wasm: 'chain-wasm',
  WasmX: 'chain-wasmx',
  Tendermint: 'chain-tendermint',
  Permissions: 'chain-permissions',
  TxFees: 'chain-tx-fees',
} as const

export type IndexerErrorModule =
  | 'indexer-account'
  | 'indexer-auction'
  | 'indexer-archiver'
  | 'indexer-derivatives'
  | 'indexer-explorer'
  | 'indexer-insurance-fund'
  | 'indexer-meta'
  | 'indexer-mito'
  | 'dmm'
  | 'olp'
  | 'referral'
  | 'indexer-oracle'
  | 'indexer-portfolio'
  | 'indexer-spot'
  | 'indexer-transaction'
  | 'indexer-trading'
  | 'indexer-chronos-derivative'
  | 'indexer-chronos-spot'
  | 'indexer-chronos-markets'
  | 'indexer-campaign'
  | 'web3-gateway'
  | 'abacus'

export const IndexerErrorModule = {
  Account: 'indexer-account',
  Auction: 'indexer-auction',
  Archiver: 'indexer-archiver',
  Derivatives: 'indexer-derivatives',
  Explorer: 'indexer-explorer',
  InsuranceFund: 'indexer-insurance-fund',
  Meta: 'indexer-meta',
  Mito: 'indexer-mito',
  Dmm: 'dmm',
  OLP: 'olp',
  Referral: 'referral',
  Oracle: 'indexer-oracle',
  Portfolio: 'indexer-portfolio',
  Spot: 'indexer-spot',
  Transaction: 'indexer-transaction',
  Trading: 'indexer-trading',
  ChronosDerivative: 'indexer-chronos-derivative',
  ChronosSpot: 'indexer-chronos-spot',
  ChronosMarkets: 'indexer-chronos-markets',
  Campaign: 'indexer-campaign',
  Web3Gw: 'web3-gateway',
  Abacus: 'abacus',
} as const

export type WalletErrorActionModule =
  | 'get-chain-id'
  | 'get-accounts'
  | 'get-network-id'
  | 'sign-arbitrary'
  | 'sign-transaction'
  | 'send-transaction'
  | 'send-evm-transaction'
  | 'sign-evm-transaction'
  | 'get-evm-transaction-receipt'

export const WalletErrorActionModule = {
  GetChainId: 'get-chain-id',
  GetAccounts: 'get-accounts',
  GetNetworkId: 'get-network-id',
  SignArbitrary: 'sign-arbitrary',
  SignTransaction: 'sign-transaction',
  SendTransaction: 'send-transaction',
  SendEvmTransaction: 'send-evm-transaction',
  SignEvmTransaction: 'sign-evm-transaction',
  GetEvmTransactionReceipt: 'get-evm-transaction-receipt',
} as const
