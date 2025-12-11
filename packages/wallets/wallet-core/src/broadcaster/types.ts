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
