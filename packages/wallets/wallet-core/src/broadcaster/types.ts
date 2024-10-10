import { Msgs } from '@injectivelabs/sdk-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { Network, NetworkEndpoints } from '@injectivelabs/networks'
import BaseWalletStrategy from '../strategy/BaseWalletStrategy'

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
  endpoints?: NetworkEndpoints

  /**
   * Only used if we want to override the default
   * endpoints taken from the network param
   *
   * @deprecated - taken from the network parameter or use the endpoints
   * */
  networkEndpoints?: {
    indexerApi: string
    sentryGrpcApi: string
    sentryHttpApi: string
  }
  chainId?: ChainId
  ethereumChainId?: EthereumChainId
  feePayerPubKey?: string
  simulateTx?: boolean
  txTimeoutOnFeeDelegation?: boolean
  txTimeout?: number // blocks to wait for tx to be included in a block
  walletStrategy: BaseWalletStrategy
  gasBufferCoefficient?: number
}
