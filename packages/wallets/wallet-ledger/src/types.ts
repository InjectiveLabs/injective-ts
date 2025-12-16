// Browser-compatible HDNode-like interface (replaces hdkey dependency)
export interface HDNodeLike {
  publicKey: Uint8Array
  chainCode: Uint8Array
}

export const LedgerDerivationPathType = {
  LedgerLive: 'ledger-live',
  LedgerMew: 'ledger-mew',
} as const

export type LedgerDerivationPathType =
  (typeof LedgerDerivationPathType)[keyof typeof LedgerDerivationPathType]

export interface LedgerWalletInfo {
  address: string
  baseDerivationPath: string
  derivationPath: string
  hdKey?: HDNodeLike
  publicKey?: string
}

export const WalletLedger = {
  Ledger: 'ledger',
  LedgerCosmos: 'ledger-cosmos',
  LedgerLegacy: 'ledger-legacy',
} as const

export type WalletLedger = (typeof WalletLedger)[keyof typeof WalletLedger]
