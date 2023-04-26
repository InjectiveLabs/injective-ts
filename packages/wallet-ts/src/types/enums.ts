import { WalletErrorActionModule } from '@injectivelabs/exceptions'

export enum Wallet {
  Metamask = 'metamask',
  Ledger = 'ledger',
  LedgerLegacy = 'ledger-legacy',
  Trezor = 'trezor',
  Keplr = 'keplr',
  Torus = 'torus',
  WalletConnect = 'wallet-connect',
  Leap = 'leap',
  Cosmostation = 'cosmostation',
  CosmostationEth = 'cosmostation-eth',
  Welldone = 'welldone',
}

export enum WalletDeviceType {
  Browser = 'browser',
  Hardware = 'hardware',
  Mobile = 'mobile',
}

export const WalletAction = { ...WalletErrorActionModule }
