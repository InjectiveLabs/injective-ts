import { Msgs } from '@injectivelabs/sdk-ts'
import { MetricsProvider } from '../../classes/MetricsProvider'
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'

export interface MsgBroadcastTxOptions {
  bucket?: string
  memo?: string
  address: string /* Deprecated */
  ethereumAddress: string
  injectiveAddress: string
  msgs: Msgs | Msgs[]
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
}

export interface MsgBroadcastOptions {
  endpoints: {
    indexerApi: string
    sentryGrpcApi: string
    sentryHttpApi: string
  }
  chainId: ChainId
  ethereumChainId: EthereumChainId
  walletStrategy: WalletStrategy
  metricsProvider?: MetricsProvider
}
