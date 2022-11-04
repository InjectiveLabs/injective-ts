import { Msgs } from '@injectivelabs/sdk-ts'
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'

export interface MsgBroadcastTxOptions {
  memo?: string
  address?: string /* Deprecated */
  ethereumAddress?: string
  injectiveAddress?: string
  msgs: Msgs | Msgs[]
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
}

export interface MsgBroadcastTxOptionsWithAddresses
  extends MsgBroadcastTxOptions {
  ethereumAddress: string
  injectiveAddress: string
}

export interface MsgBroadcastOptions {
  endpoints: {
    indexerApi: string
    sentryGrpcApi: string
    sentryHttpApi: string
  }
  chainId: ChainId
  ethereumChainId?: EthereumChainId
  feePayerPubKey?: string
  walletStrategy: WalletStrategy
}
