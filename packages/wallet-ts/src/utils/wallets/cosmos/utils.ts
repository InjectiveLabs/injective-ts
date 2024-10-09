import { DEFAULT_TIMESTAMP_TIMEOUT_MS } from '@injectivelabs/utils'
import { Cosmos } from '@cosmostation/extension-client'
import type { Keplr } from '@keplr-wallet/types'
import { Wallet } from '../../../types/enums'

/**
 * Returns a timeout timestamp in milliseconds so its compatible
 * with the way Cosmos handles transactions
 */
export const makeTimeoutTimestamp = (
  timeoutInMs: number = DEFAULT_TIMESTAMP_TIMEOUT_MS,
) => {
  const now = new Date()
  const timestamp = new Date(now.getTime() + timeoutInMs)
  const actualTimestamp = timestamp.getTime()

  return actualTimestamp
}

/**
 * Returns a timeout timestamp in nanoseconds so its compatible
 * with the way Cosmos handles transactions
 */
export const makeTimeoutTimestampInNs = (
  timeoutInMs: number = DEFAULT_TIMESTAMP_TIMEOUT_MS,
) => makeTimeoutTimestamp(timeoutInMs) * 1e6

export const isCosmosBrowserWallet = (wallet: Wallet): boolean =>
  [Wallet.Leap, Wallet.Ninji, Wallet.Keplr,Wallet.OWallet, Wallet.Cosmostation].includes(
    wallet,
  )

export const isCosmosAminoOnlyWallet = (wallet: Wallet): boolean =>
  [Wallet.LedgerCosmos].includes(wallet)

export const isCosmosWalletInstalled = (wallet: Wallet) => {
  const $window = (typeof window !== 'undefined' ? window : {}) as Window & {
    leap?: Keplr
    keplr?: Keplr
    ninji?: Keplr
    owallet?: Keplr
    cosmostation?: Cosmos
  }

  switch (wallet) {
    case Wallet.Keplr:
      return $window.keplr !== undefined
    case Wallet.OWallet:
      return $window.owallet !== undefined
    case Wallet.Ninji:
      return $window.ninji !== undefined
    case Wallet.Cosmostation:
      return $window.cosmostation !== undefined
    case Wallet.Leap:
      return $window.leap !== undefined
    default:
      return false
  }
}
