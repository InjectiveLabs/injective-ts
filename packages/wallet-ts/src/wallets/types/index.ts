import { Msgs } from '@injectivelabs/sdk-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import { WalletStrategy } from '../../strategies/wallet'

export interface MsgBroadcasterTxOptions {
  memo?: string
  address?: string /* @deprecated */
  ethereumAddress?: string
  injectiveAddress?: string
  msgs: Msgs | Msgs[]
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
}

export interface MsgBroadcasterTxOptionsWithAddresses
  extends MsgBroadcasterTxOptions {
  ethereumAddress: string
  injectiveAddress: string
}

export interface MsgBroadcasterOptions {
  network: Network
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

export interface MsgBroadcasterOptionsLocal
  extends Omit<MsgBroadcasterOptions, 'feePayerPubKey' | 'walletStrategy'> {
  privateKey: string
}

export interface SendTransactionOptions {
  tx: {
    from: string
    to: string
    gas: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string | null
    data: any
  }
  address: string
}
