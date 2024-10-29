import { CosmosChainId } from "@injectivelabs/ts-types"
import { Wallet } from '@injectivelabs/wallet-base'

export interface CosmosWalletStrategyArguments {
  chainId: CosmosChainId
  wallet?: Wallet
}
