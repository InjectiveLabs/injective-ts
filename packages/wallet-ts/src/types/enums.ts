import { WalletErrorActionModule } from '@injectivelabs/exceptions'

export enum Wallet {
  Leap = 'leap',
  Keplr = 'keplr',
  Ninji = 'ninji',
  Torus = 'torus',
  Ledger = 'ledger',
  Trezor = 'trezor',
  Phantom = 'phantom',
  Metamask = 'metamask',
  TrustWallet = 'trust-wallet',
  Cosmostation = 'cosmostation',
  LedgerCosmos = 'ledger-cosmos',
  LedgerLegacy = 'ledger-legacy',
  WalletConnect = 'wallet-connect',
  CosmostationEth = 'cosmostation-eth',
  Welldone = 'welldone',
}

export enum WalletDeviceType {
  Mobile = 'mobile',
  Browser = 'browser',
  Hardware = 'hardware',
}

export const WalletAction = { ...WalletErrorActionModule }
