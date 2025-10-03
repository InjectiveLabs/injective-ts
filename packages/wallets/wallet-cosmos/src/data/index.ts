import { Wallet } from '@injectivelabs/wallet-base'
import type { Wallet as WalletType } from '@injectivelabs/wallet-base'

export const cosmosWallets = [
  Wallet.Leap,
  Wallet.Ninji,
  Wallet.Keplr,
  Wallet.OWallet,
] as WalletType[]
