import type { Wallet } from '@injectivelabs/wallet-base'
import type { CosmosChainId } from "@injectivelabs/ts-types"

export interface CosmosWalletStrategyArguments {
  chainId: CosmosChainId
  wallet?: Wallet
}
