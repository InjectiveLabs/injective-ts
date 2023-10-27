import { WalletErrorActionModule } from '@injectivelabs/exceptions'

export enum Wallet {
  Leap = 'leap',
  Keplr = 'keplr',
  Torus = 'torus',
  Ledger = 'ledger',
  Trezor = 'trezor',
  Metamask = 'metamask',
  TrustWallet = 'trust-wallet',
  Cosmostation = 'cosmostation',
  LedgerCosmos = 'ledger-cosmos',
  LedgerLegacy = 'ledger-legacy',
  WalletConnect = 'wallet-connect',
  CosmostationEth = 'cosmostation-eth',
}

export enum WalletDeviceType {
  Mobile = 'mobile',
  Browser = 'browser',
  Hardware = 'hardware',
}

export const WalletAction = { ...WalletErrorActionModule }
