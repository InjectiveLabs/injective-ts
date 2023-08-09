import { Wallet } from '../../types/enums'

export const isEthWallet = (wallet: Wallet): boolean =>
  [
    Wallet.Trezor,
    Wallet.Torus,
    Wallet.Ledger,
    Wallet.Metamask,
    Wallet.TrustWallet,
    Wallet.CosmostationEth,
  ].includes(wallet)
