import { WalletErrorActionModule } from '@injectivelabs/exceptions'

export type BroadcastMode = 'block' | 'sync' | 'async'

export const BroadcastMode = {
  Block: 'block',
  Sync: 'sync',
  Async: 'async',
} as const

export type Wallet =
  | 'leap'
  | 'keplr'
  | 'ninji'
  | 'magic'
  | 'rabby'
  | 'ledger'
  | 'BitGet'
  | 'owallet'
  | 'phantom'
  | 'rainbow'
  | 'turnkey'
  | 'metamask'
  | 'okx-wallet'
  | 'private-key'
  | 'trust-wallet'
  | 'trezor-bip32'
  | 'trezor-bip44'
  | 'cosmostation'
  | 'ledger-cosmos'
  | 'ledger-legacy'
  | 'wallet-connect'
  | 'cosmostation-eth'

export const Wallet = {
  Leap: 'leap',
  Keplr: 'keplr',
  Ninji: 'ninji',
  Magic: 'magic',
  Rabby: 'rabby',
  Ledger: 'ledger',
  BitGet: 'BitGet',
  OWallet: 'owallet',
  Phantom: 'phantom',
  Rainbow: 'rainbow',
  Turnkey: 'turnkey',
  Metamask: 'metamask',
  OkxWallet: 'okx-wallet',
  PrivateKey: 'private-key',
  TrustWallet: 'trust-wallet',
  TrezorBip32: 'trezor-bip32',
  TrezorBip44: 'trezor-bip44',
  Cosmostation: 'cosmostation',
  LedgerCosmos: 'ledger-cosmos',
  LedgerLegacy: 'ledger-legacy',
  WalletConnect: 'wallet-connect',
  CosmostationEth: 'cosmostation-eth',
} as const

export type MagicProvider =
  | 'email'
  | 'apple'
  | 'github'
  | 'google'
  | 'discord'
  | 'twitter'
  | 'facebook'

export const MagicProvider = {
  Email: 'email',
  Apple: 'apple',
  Github: 'github',
  Google: 'google',
  Discord: 'discord',
  Twitter: 'twitter',
  Facebook: 'facebook',
} as const

export type WalletDeviceType = 'mobile' | 'other' | 'browser' | 'hardware'

export const WalletDeviceType = {
  Mobile: 'mobile',
  Other: 'other',
  Browser: 'browser',
  Hardware: 'hardware',
} as const

export type WalletEventListener = 'account-change' | 'chain-id-change'

export const WalletEventListener = {
  AccountChange: 'account-change',
  ChainIdChange: 'chain-id-change',
} as const

export const WalletAction = { ...WalletErrorActionModule }
