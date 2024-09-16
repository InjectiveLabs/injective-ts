import { Wallet } from '../../types/enums'

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
