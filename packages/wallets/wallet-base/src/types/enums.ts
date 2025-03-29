import { WalletErrorActionModule } from '@injectivelabs/exceptions'

export enum Wallet {
  Leap = 'leap',
  Keplr = 'keplr',
  Ninji = 'ninji',
  Magic = 'magic',
  Ledger = 'ledger',
  BitGet = 'BitGet',
  OWallet = 'owallet',
  Phantom = 'phantom',
  Metamask = 'metamask',
  OkxWallet = 'okx-wallet',
  TrustWallet = 'trust-wallet',
  PrivateKey = 'private-key',
  TrezorBip32 = 'trezor-bip32',
  TrezorBip44 = 'trezor-bip44',
  Cosmostation = 'cosmostation',
  LedgerCosmos = 'ledger-cosmos',
  LedgerLegacy = 'ledger-legacy',
  WalletConnect = 'wallet-connect',
  CosmostationEth = 'cosmostation-eth',
  Turnkey = 'turnkey',
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
