import { CosmostationWalletStrategy as BaseCosmostationWalletStrategy } from '@injectivelabs/wallet-cosmostation'
import type { Wallet } from '@injectivelabs/wallet-base'
import type { ChainId, CosmosChainId } from '@injectivelabs/ts-types'

export class CosmostationWalletStrategy extends BaseCosmostationWalletStrategy {
  constructor(
    args: {
      chainId: CosmosChainId
      endpoints?: { rest: string; rpc: string }
    } & { wallet: Wallet },
  ) {
    super(
      args as unknown as {
        chainId: ChainId
        endpoints?: { rest: string; rpc: string }
        wallet: Wallet
      },
    )
  }
}
