import type { Msgs } from '@injectivelabs/sdk-ts/core/modules'
import type { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import type { Network, NetworkEndpoints } from '@injectivelabs/networks'
import type { AuthBaseAccount } from '@injectivelabs/sdk-ts/client/chain'
import type { TxClientInclusionOptions } from '@injectivelabs/sdk-ts/core/tx'
import type BaseWalletStrategy from '../strategy/BaseWalletStrategy.js'

export interface MsgBroadcasterTxOptions {
  memo?: string
  msgs: Msgs | Msgs[]
  ethereumAddress?: string
  injectiveAddress?: string
  accountDetails?: AuthBaseAccount
  latestHeight?: number | string
  timeoutHeight?: number | string
  txTimeoutInBlocks?: number // blocks to wait for tx to be included in a block
  txInclusion?: TxClientInclusionOptions
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
  chainId?: ChainId
  txTimeout?: number // blocks to wait for tx to be included in a block
  simulateTx?: boolean
  evmChainId?: EvmChainId
  feePayerPubKey?: string
  endpoints?: NetworkEndpoints
  txInclusion?: TxClientInclusionOptions
  walletStrategy: BaseWalletStrategy
  useDynamicBaseFee?: boolean
  txTimeoutOnFeeDelegation?: boolean
  gasBufferCoefficient?: number
  httpHeaders?: Record<string, string>
}
