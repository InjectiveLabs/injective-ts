import { WalletErrorActionModule } from '@injectivelabs/exceptions'

export enum Wallet {
  Leap = 'leap',
  Keplr = 'keplr',
  Ninji = 'ninji',
  Torus = 'torus',
  Ledger = 'ledger',
  BitGet = 'BitGet',
  Trezor = 'trezor',
  Phantom = 'phantom',
  Metamask = 'metamask',
  OkxWallet = 'okx-wallet',
  TrustWallet = 'trust-wallet',
  PrivateKey = 'private-key',
  Cosmostation = 'cosmostation',
  LedgerCosmos = 'ledger-cosmos',
  LedgerLegacy = 'ledger-legacy',
  WalletConnect = 'wallet-connect',
  CosmostationEth = 'cosmostation-eth',
  FoxWallet = 'fox-wallet',
}

export enum WalletDeviceType {
  Mobile = 'mobile',
  Other = 'other',
  Browser = 'browser',
  Hardware = 'hardware',
}

export enum WalletEventListener {
  AccountChange = 'account-change',
  ChainIdChange = 'chain-id-change',
}

export const WalletAction = { ...WalletErrorActionModule }
