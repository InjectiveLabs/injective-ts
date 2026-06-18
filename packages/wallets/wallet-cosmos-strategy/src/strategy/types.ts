import type { CosmosChainId } from '@injectivelabs/ts-types'
import type { Wallet } from '@injectivelabs/wallet-base/runtime-light'

export interface CosmosWalletStrategyArguments {
  chainId: CosmosChainId
  wallet?: Wallet
}
