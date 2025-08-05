import { WalletErrorActionModule } from '@injectivelabs/exceptions'

export enum BroadcastMode {
  /** Return after tx commit */
  Block = 'block',
  /** Return after CheckTx */
  Sync = 'sync',
  /** Return right away */
  Async = 'async',
}

export enum Wallet {
  Leap = 'leap',
  Keplr = 'keplr',
  Ninji = 'ninji',
  Magic = 'magic',
  Rabby = 'rabby',
  Ledger = 'ledger',
  BitGet = 'BitGet',
  OWallet = 'owallet',
  Phantom = 'phantom',
  Rainbow = 'rainbow',
  Turnkey = 'turnkey',
  Metamask = 'metamask',
  OkxWallet = 'okx-wallet',
  PrivateKey = 'private-key',
  TrustWallet = 'trust-wallet',
  TrezorBip32 = 'trezor-bip32',
  TrezorBip44 = 'trezor-bip44',
  Cosmostation = 'cosmostation',
  LedgerCosmos = 'ledger-cosmos',
  LedgerLegacy = 'ledger-legacy',
  WalletConnect = 'wallet-connect',
  CosmostationEth = 'cosmostation-eth',
}

export enum MagicProvider {
  Email = 'email',
  Apple = 'apple',
  Github = 'github',
  Google = 'google',
  Discord = 'discord',
  Twitter = 'twitter',
  Facebook = 'facebook',
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
