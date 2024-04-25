import { Wallet } from '../../types/enums'

export const isEthWallet = (wallet: Wallet): boolean =>
  [
    Wallet.Trezor,
    Wallet.Torus,
    Wallet.Ledger,
    Wallet.BitGet,
    Wallet.Phantom,
    Wallet.Metamask,
    Wallet.OkxWallet,
    Wallet.PrivateKey,
    Wallet.TrustWallet,
    Wallet.LedgerLegacy,
    Wallet.CosmostationEth,
  ].includes(wallet)

export const isCosmosWallet = (wallet: Wallet): boolean => !isEthWallet(wallet)

export const isEip712V2OnlyWallet = (wallet: Wallet): boolean =>
  [Wallet.Phantom].includes(wallet)
