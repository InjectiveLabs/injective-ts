import { Wallet } from './../types/enums.js'

export const isEthWallet = (wallet: Wallet): boolean =>
  [
    Wallet.Magic,
    Wallet.Torus,
    Wallet.BitGet,
    Wallet.Ledger,
    Wallet.Trezor,
    Wallet.Phantom,
    Wallet.Metamask,
    Wallet.OkxWallet,
    Wallet.PrivateKey,
    Wallet.TrustWallet,
    Wallet.LedgerLegacy,
    Wallet.WalletConnect,
    Wallet.CosmostationEth,
  ].includes(wallet)

export const isCosmosWallet = (wallet: Wallet): boolean => !isEthWallet(wallet)

export const isEip712V2OnlyWallet = (wallet: Wallet): boolean =>
  [
    Wallet.Magic,
    Wallet.Metamask,
    Wallet.Phantom,
    Wallet.WalletConnect,
  ].includes(wallet)

export const isCosmosAminoOnlyWallet = (wallet: Wallet): boolean =>
  [Wallet.LedgerCosmos].includes(wallet)

export const COSMOS_WALLETS = [
  Wallet.Keplr,
  Wallet.Leap,
  Wallet.Ninji,
  Wallet.Cosmostation,
  Wallet.OWallet,
]
