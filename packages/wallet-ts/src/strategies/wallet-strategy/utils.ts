import { Wallet } from '../../types/enums'

export const isEthWallet = (wallet: Wallet): boolean =>
  [
    Wallet.Trezor,
    Wallet.Torus,
    Wallet.Ledger,
    Wallet.Metamask,
    Wallet.LedgerLegacy,
    Wallet.TrustWallet,
    Wallet.CosmostationEth,
  ].includes(wallet)

export const isCosmosWallet = (wallet: Wallet): boolean => !isEthWallet(wallet)
