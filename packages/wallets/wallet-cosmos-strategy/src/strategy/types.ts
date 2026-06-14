import type { CosmosChainId } from '@injectivelabs/ts-types'
import type { Wallet } from '@injectivelabs/wallet-base/light'

export interface CosmosWalletStrategyArguments {
  chainId: CosmosChainId
  wallet?: Wallet
}
