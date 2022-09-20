export enum Wallet {
  // PrivateKey = 'private-key',
  Metamask = 'metamask',
  Ledger = 'ledger',
  LedgerLegacy = 'ledger-legacy',
  Trezor = 'trezor',
  Keplr = 'keplr',
  Torus = 'torus',
  WalletConnect = 'wallet-connect',
  Leap = 'leap',
}

export enum WalletAction {
  SignTransaction = 'sign-transaction',
  SignEthereumTransaction = 'sign-ethereum-transaction',
  SendTransaction = 'send-transaction',
  SendEthereumTransaction = 'send-ethereum-transaction',
  GetAccounts = 'get-accounts',
  GetNetworkId = 'get-network-id',
  GetChainId = 'get-chain-id',
  GetEthereumTransactionReceipt = 'get-ethereum-transaction-receipt',
}
