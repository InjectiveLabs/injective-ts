export const StrategyEventType = {
  ConnectionEnd: 'connection-end',
  ConnectionStart: 'connection-start',
  WalletSigningEnd: 'wallet-signing-end',
  WalletSigningStart: 'wallet-signing-start',
} as const

export const WalletConnectStrategyEventType = {
  WalletConnectSigningWithTxTimeout: 'signing-with-tx-timeout',
} as const

export const WalletStrategyEmitterEventType = {
  TransactionFail: 'transaction-fail',
  TransactionSigned: 'transaction-signed',
  TransactionSignStart: 'transaction-sign-start',
  TransactionBroadcastEnd: 'transaction-broadcast-end',
  TransactionBroadcastStart: 'transaction-broadcast-start',
  TransactionPreparationEnd: 'transaction-preparation-end',
  TransactionPreparationStart: 'transaction-preparation-start',
  WalletStrategyDisconnect: 'wallet-strategy-disconnect',
} as const

export type StrategyEventType =
  | (typeof StrategyEventType)[keyof typeof StrategyEventType]
  | (typeof WalletConnectStrategyEventType)[keyof typeof WalletConnectStrategyEventType]

export type WalletStrategyEmitterEventType =
  | (typeof WalletStrategyEmitterEventType)[keyof typeof WalletStrategyEmitterEventType]
  | StrategyEventType

export type WalletStrategyEmitterEvents = {
  [K in WalletStrategyEmitterEventType]: Record<string, any>
}

export interface WalletStrategyEmitter {
  on(
    event: WalletStrategyEmitterEventType,
    listener: (...args: any[]) => void,
  ): this
  off(
    event: WalletStrategyEmitterEventType,
    listener: (...args: any[]) => void,
  ): this
  emit(event: WalletStrategyEmitterEventType, ...args: any[]): boolean
}
