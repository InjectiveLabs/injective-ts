import { WalletErrorActionModule } from '@injectivelabs/exceptions'

export * from './events.js'

export const BroadcastMode = {
  Block: 'block',
  Sync: 'sync',
  Async: 'async',
} as const

export type BroadcastMode = (typeof BroadcastMode)[keyof typeof BroadcastMode]

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
  KeplrEvm: 'keplr-evm',
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

export type Wallet = (typeof Wallet)[keyof typeof Wallet]

export const MagicProvider = {
  Email: 'email',
  Apple: 'apple',
  Github: 'github',
  Google: 'google',
  Discord: 'discord',
  Twitter: 'twitter',
  Facebook: 'facebook',
} as const

export type MagicProvider = (typeof MagicProvider)[keyof typeof MagicProvider]

export const WalletDeviceType = {
  Mobile: 'mobile',
  Other: 'other',
  Browser: 'browser',
  Hardware: 'hardware',
} as const

export type WalletDeviceType =
  (typeof WalletDeviceType)[keyof typeof WalletDeviceType]

export const WalletEventListener = {
  AccountChange: 'account-change',
  ChainIdChange: 'chain-id-change',
} as const

export type WalletEventListener =
  (typeof WalletEventListener)[keyof typeof WalletEventListener]

export const EvmWalletProviderErrorCode = {
  InternalError: -32603,
  UserRejectedRequest: 4001,
  UnrecognizedChain: 4902,
} as const

export type EvmWalletProviderErrorCode =
  (typeof EvmWalletProviderErrorCode)[keyof typeof EvmWalletProviderErrorCode]

export const WalletAction = { ...WalletErrorActionModule }
