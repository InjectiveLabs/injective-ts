import { Wallet } from './types'

export { default as WalletStrategy } from './WalletStrategy'
export * from './strategies'
export * from './types'

export const isCosmosWallet = (wallet: Wallet): boolean =>
  [Wallet.Cosmostation, Wallet.Leap, Wallet.Keplr].includes(wallet)
