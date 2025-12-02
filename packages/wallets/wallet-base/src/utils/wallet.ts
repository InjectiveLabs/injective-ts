import { Wallet } from './../types/enums.js'
import type { Wallet as WalletType } from './../types/enums.js'

export const isEvmWallet = (wallet: Wallet): boolean =>
  (
    [
      Wallet.Magic,
      Wallet.Rabby,
      Wallet.BitGet,
      Wallet.Ledger,
      Wallet.Phantom,
      Wallet.Rainbow,
      Wallet.Turnkey,
      Wallet.Metamask,
      Wallet.KeplrEvm,
      Wallet.OkxWallet,
      Wallet.PrivateKey,
      Wallet.TrezorBip32,
      Wallet.TrezorBip44,
      Wallet.TrustWallet,
      Wallet.LedgerLegacy,
      Wallet.WalletConnect,
      Wallet.CosmostationEth,
    ] as WalletType[]
  ).includes(wallet)

export const isCosmosWallet = (wallet: Wallet): boolean => !isEvmWallet(wallet)

export const isEvmBrowserWallet = (wallet: Wallet) =>
  (
    [
      Wallet.Rabby,
      Wallet.BitGet,
      Wallet.Phantom,
      Wallet.Rainbow,
      Wallet.Metamask,
      Wallet.KeplrEvm,
      Wallet.OkxWallet,
      Wallet.TrustWallet,
    ] as WalletType[]
  ).includes(wallet)

export const isCosmosBrowserWallet = (wallet: Wallet): boolean =>
  (
    [
      Wallet.Leap,
      Wallet.Keplr,
      Wallet.Ninji,
      Wallet.OWallet,
      Wallet.Cosmostation,
    ] as WalletType[]
  ).includes(wallet)

export const isEip712V2OnlyWallet = (wallet: Wallet): boolean =>
  (
    [
      Wallet.Magic,
      Wallet.Phantom,
      Wallet.Metamask,
      Wallet.WalletConnect,
    ] as WalletType[]
  ).includes(wallet)

export const isCosmosAminoOnlyWallet = (wallet: Wallet): boolean =>
  ([Wallet.LedgerCosmos] as WalletType[]).includes(wallet)
