import { Msgs } from '@injectivelabs/sdk-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { Network, NetworkEndpoints } from '@injectivelabs/networks'
import type { WalletStrategy } from '../strategies'

export interface MsgBroadcasterTxOptions {
  memo?: string
  address?: string /* @deprecated */
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

export interface MsgBroadcasterTxOptionsWithAddresses
  extends MsgBroadcasterTxOptions {
  ethereumAddress: string
  injectiveAddress: string
}

export interface MsgBroadcasterOptions {
  network: Network
  networkEndpoints?: NetworkEndpoints

  /**
   * Only used if we want to override the default
   * endpoints taken from the network param
   *
   * @deprecated - taken from the network parameter
   * */
  endpoints?: {
    indexerApi: string
    sentryGrpcApi: string
    sentryHttpApi: string
  }
  /** @deprecated - taken from the network parameter  */
  chainId?: ChainId
  /** @deprecated - taken from the network parameter  */
  ethereumChainId?: EthereumChainId
  feePayerPubKey?: string
  simulateTx?: boolean
  walletStrategy: WalletStrategy
}
