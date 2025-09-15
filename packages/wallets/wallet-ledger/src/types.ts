import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import type HDNode from 'hdkey'

export enum LedgerDerivationPathType {
  LedgerLive = 'ledger-live',
  LedgerMew = 'ledger-mew',
}

export interface LedgerWalletInfo {
  address: string
  baseDerivationPath: string
  derivationPath: string
  hdKey?: HDNode
  publicKey?: string
}

export enum WalletLedger {
  Ledger = 'ledger',
  LedgerCosmos = 'ledger-cosmos',
  LedgerLegacy = 'ledger-legacy',
}

export type SignTransactionFunctionType = (
  txData: any,
  args: { address: string; evmChainId: any },
) => Promise<FeeMarketEIP1559Transaction>
