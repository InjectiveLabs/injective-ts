import type { EventEmitter } from 'eventemitter3'
import type { Msgs } from '@injectivelabs/sdk-ts/core/modules'
import type { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import type { Network, NetworkEndpoints } from '@injectivelabs/networks'
import type BaseWalletStrategy from '../strategy/BaseWalletStrategy.js'

export interface MsgBroadcasterTxOptions {
  memo?: string
  ethereumAddress?: string
  injectiveAddress?: string
  msgs: Msgs | Msgs[]
  gas?: {
    gasPrice?: string
    gas?: number /** gas limit */
    feePayer?: string
    granter?: string
  }
}

export interface MsgBroadcasterTxOptionsWithAddresses extends MsgBroadcasterTxOptions {
  ethereumAddress: string
  injectiveAddress: string
}

export interface MsgBroadcasterOptions {
  network: Network
  endpoints?: NetworkEndpoints
  chainId?: ChainId
  evmChainId?: EvmChainId
  feePayerPubKey?: string
  simulateTx?: boolean
  txTimeoutOnFeeDelegation?: boolean
  txTimeout?: number // blocks to wait for tx to be included in a block
  walletStrategy: BaseWalletStrategy
  gasBufferCoefficient?: number
  httpHeaders?: Record<string, string>
}

export const WalletStrategyEmitterEventType = {
  TransactionFail: 'transaction-fail',
  TransactionSigned: 'transaction-signed',
  TransactionSignStart: 'transaction-sign-start',
  TransactionBroadcastEnd: 'transaction-broadcast-end',
  WalletStrategyDisconnect: 'wallet-strategy-disconnect',
  TransactionBroadcastStart: 'transaction-broadcast-start',
  TransactionPreparationEnd: 'transaction-preparation-end',
  TransactionPreparationStart: 'transaction-preparation-start',
} as const

export type WalletStrategyEmitterEventType =
  (typeof WalletStrategyEmitterEventType)[keyof typeof WalletStrategyEmitterEventType]

export type WalletStrategyEmitterEvents = {
  [WalletStrategyEmitterEventType.TransactionFail]: Record<string, any>
  [WalletStrategyEmitterEventType.TransactionSigned]: Record<string, any>
  [WalletStrategyEmitterEventType.TransactionSignStart]: Record<string, any>
  [WalletStrategyEmitterEventType.TransactionBroadcastEnd]: Record<string, any>
  [WalletStrategyEmitterEventType.WalletStrategyDisconnect]: Record<string, any>
  [WalletStrategyEmitterEventType.TransactionBroadcastStart]: Record<
    string,
    any
  >
  [WalletStrategyEmitterEventType.TransactionPreparationEnd]: Record<
    string,
    any
  >
  [WalletStrategyEmitterEventType.TransactionPreparationStart]: Record<
    string,
    any
  >
}

export type WalletStrategyEmitter = EventEmitter<WalletStrategyEmitterEvents>
