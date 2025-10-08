export const ContractErrorModule = {
  Peggy: 'peggy-contract',
  PeggyOld: 'peggy-old-contract',
  Erc20Contract: 'erc20-contract',
} as const

export type ContractErrorModule =
  (typeof ContractErrorModule)[keyof typeof ContractErrorModule]

export const ChainErrorModule = {
  Gov: 'chain-gov',
  Ibc: 'chain-ibc',
  Evm: 'chain-evm',
  Auth: 'chain-auth',
  Bank: 'chain-bank',
  Mint: 'chain-mint',
  Wasm: 'chain-wasm',
  Authz: 'chain-authz',
  Peggy: 'chain-peggy',
  WasmX: 'chain-wasmx',
  Erc20: 'chain-erc20',
  Oracle: 'chain-oracle',
  TxFees: 'chain-tx-fees',
  Auction: 'chain-auction',
  Staking: 'chain-staking',
  Exchange: 'chain-exchange',
  Tendermint: 'chain-tendermint',
  InsuranceFund: 'chain-insurance',
  Permissions: 'chain-permissions',
  Distribution: 'chain-distribution',
} as const

export type ChainErrorModule =
  (typeof ChainErrorModule)[keyof typeof ChainErrorModule]

export const IndexerErrorModule = {
  Dmm: 'dmm',
  OLP: 'olp',
  Abacus: 'abacus',
  Meta: 'indexer-meta',
  Mito: 'indexer-mito',
  Referral: 'referral',
  Spot: 'indexer-spot',
  Web3Gw: 'web3-gateway',
  Oracle: 'indexer-oracle',
  Account: 'indexer-account',
  Auction: 'indexer-auction',
  Trading: 'indexer-trading',
  Archiver: 'indexer-archiver',
  Explorer: 'indexer-explorer',
  Campaign: 'indexer-campaign',
  Portfolio: 'indexer-portfolio',
  MegaVault: 'indexer-mega-vault',
  Derivatives: 'indexer-derivatives',
  Transaction: 'indexer-transaction',
  ChronosSpot: 'indexer-chronos-spot',
  InsuranceFund: 'indexer-insurance-fund',
  ChronosMarkets: 'indexer-chronos-markets',
  ChronosDerivative: 'indexer-chronos-derivative',
} as const

export type IndexerErrorModule =
  (typeof IndexerErrorModule)[keyof typeof IndexerErrorModule]

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

export type WalletErrorActionModule =
  (typeof WalletErrorActionModule)[keyof typeof WalletErrorActionModule]
