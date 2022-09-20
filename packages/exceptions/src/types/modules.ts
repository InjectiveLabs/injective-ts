export enum ContractErrorModule {
  Erc20Contract = 'erc20-contract',
  Peggy = 'peggy-contract',
  PeggyOld = 'peggy-old-contract',
}

export enum ChainErrorModule {
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
  Tendermint = 'chain-tendermint',
}

export enum IndexerErrorModule {
  Account = 'indexer-account',
  Auction = 'indexer-auction',
  Derivatives = 'indexer-derivatives',
  Explorer = 'indexer-explorer',
  InsuranceFund = 'indexer-insurance-fund',
  Meta = 'indexer-meta',
  Oracle = 'indexer-oracle',
  Spot = 'indexer-spot',
  Transaction = 'indexer-transaction',
  ChronosDerivative = 'indexer-chronos-derivative',
  ChronosSpot = 'indexer-chronos-spot',
  ChronosMarkets = 'indexer-chronos-markets',
}

export enum WalletErrorActionModule {
  SignTransaction = 'sign-transaction',
  SignEthereumTransaction = 'sign-ethereum-transaction',
  SendTransaction = 'send-transaction',
  SendEthereumTransaction = 'send-ethereum-transaction',
  GetAccounts = 'get-accounts',
  GetNetworkId = 'get-network-id',
  GetChainId = 'get-chain-id',
  GetEthereumTransactionReceipt = 'get-ethereum-transaction-receipt',
}
