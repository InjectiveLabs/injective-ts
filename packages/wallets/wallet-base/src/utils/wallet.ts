import { Wallet } from './../types/enums.js'
import type { EIP712WrapperVersion } from '@injectivelabs/ts-types'
import type { Wallet as WalletType } from './../types/enums.js'

export const isEvmWallet = (wallet: Wallet): boolean =>
  (
    [
      Wallet.Magic,
      Wallet.Rabby,
      Wallet.Privy,
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

export const isEip712V3Wallet = (wallet: Wallet): boolean =>
  ([Wallet.Phantom] as WalletType[]).includes(wallet)

/** The wrapper to prepare a fee-delegated transaction with: an explicit choice wins over the wallet's capability */
export const resolveEip712Version = (
  wallet: Wallet,
  override?: EIP712WrapperVersion,
): EIP712WrapperVersion => override ?? (isEip712V3Wallet(wallet) ? 'v3' : 'v2')

export const isCosmosAminoOnlyWallet = (wallet: Wallet): boolean =>
  ([Wallet.LedgerCosmos] as WalletType[]).includes(wallet)
