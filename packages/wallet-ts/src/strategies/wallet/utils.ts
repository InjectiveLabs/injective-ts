import { Wallet } from '../../types/enums'

export const isEthWallet = (wallet: Wallet): boolean =>
  [
    Wallet.Metamask,
    Wallet.Torus,
    Wallet.Ledger,
    Wallet.Trezor,
    Wallet.CosmostationEth,
  ].includes(wallet)
