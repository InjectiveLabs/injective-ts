export const ContractErrorModule = {
  Erc20Contract: 'erc20-contract',
  Peggy: 'peggy-contract',
  PeggyOld: 'peggy-old-contract',
} as const

export type ContractErrorModule = typeof ContractErrorModule[keyof typeof ContractErrorModule]

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

export type ChainErrorModule = typeof ChainErrorModule[keyof typeof ChainErrorModule]

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

export type IndexerErrorModule = typeof IndexerErrorModule[keyof typeof IndexerErrorModule]

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

export type WalletErrorActionModule = typeof WalletErrorActionModule[keyof typeof WalletErrorActionModule]
