// Browser-compatible HDNode-like interface (replaces hdkey dependency)
export interface HDNodeLike {
  publicKey: Buffer
  chainCode: Buffer
}

export type LedgerDerivationPathType = 'ledger-live' | 'ledger-mew'

export const LedgerDerivationPathType = {
  LedgerLive: 'ledger-live',
  LedgerMew: 'ledger-mew',
} as const

export interface LedgerWalletInfo {
  address: string
  baseDerivationPath: string
  derivationPath: string
  hdKey?: HDNodeLike
  publicKey?: string
}

export type WalletLedger = 'ledger' | 'ledger-cosmos' | 'ledger-legacy'

export const WalletLedger = {
  Ledger: 'ledger',
  LedgerCosmos: 'ledger-cosmos',
  LedgerLegacy: 'ledger-legacy',
} as const
