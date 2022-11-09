import { Msgs } from '@injectivelabs/sdk-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { WalletStrategy } from '../wallet-strategy'

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
  endpoints: {
    indexerApi: string
    sentryGrpcApi: string
    sentryHttpApi: string
  }
  chainId: ChainId
  ethereumChainId?: EthereumChainId
  feePayerPubKey?: string
  simulateTx?: boolean
  walletStrategy: WalletStrategy
}

export interface MsgBroadcasterOptionsLocal
  extends Omit<MsgBroadcasterOptions, 'feePayerPubKey' | 'walletStrategy'> {
  privateKey: string
}
