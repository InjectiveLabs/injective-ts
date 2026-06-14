import { GeneralException } from '@injectivelabs/exceptions'
import { BaseWalletStrategy } from '@injectivelabs/wallet-core/strategy'
import { Wallet, isCosmosWallet } from '@injectivelabs/wallet-base/light'
import { loadCosmosWalletStrategy } from './lib.js'
import type {
  ConcreteStrategiesArg,
  ConcreteWalletStrategy,
  WalletStrategyArguments,
} from '@injectivelabs/wallet-base/light'
import type { CosmosWalletStrategyArguments } from './types.js'

const createStrategy = async ({
  args,
  wallet,
}: {
  wallet: Wallet
  args: CosmosWalletStrategyArguments
}): Promise<ConcreteWalletStrategy | undefined> => {
  if (!isCosmosWallet(wallet)) {
    return undefined
  }

  const CosmosWalletStrategy = await loadCosmosWalletStrategy()

  switch (wallet) {
    case Wallet.Keplr:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Keplr })
    case Wallet.Cosmostation:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Cosmostation })
    case Wallet.Leap:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Leap })
    case Wallet.Ninji:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Ninji })
    case Wallet.OWallet:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.OWallet })
    default:
      return undefined
  }
}

export class BaseCosmosWalletStrategy extends BaseWalletStrategy {
  private loadingStrategies: Map<
    Wallet,
    Promise<ConcreteWalletStrategy | undefined>
  > = new Map()

  constructor(args: CosmosWalletStrategyArguments) {
    // Start with empty strategies - they'll be loaded lazily
    const strategies = {} as ConcreteStrategiesArg

    super({
      ...args,
      strategies,
    } as unknown as WalletStrategyArguments)
  }

  public async setWallet(wallet: Wallet): Promise<void> {
    this.wallet = isCosmosWallet(wallet) ? wallet : Wallet.Keplr

    await this.loadStrategy(this.wallet)
  }

  public getStrategy(): ConcreteWalletStrategy {
    if (this.strategies[this.wallet]) {
      return this.strategies[this.wallet] as ConcreteWalletStrategy
    }

    throw new GeneralException(
      new Error(
        `Wallet ${this.wallet} strategy not loaded. Call setWallet() or loadStrategy() first.`,
      ),
    )
  }

  public async loadStrategy(
    wallet: Wallet = this.wallet,
  ): Promise<ConcreteWalletStrategy | undefined> {
    if (this.strategies[wallet]) {
      return this.strategies[wallet]
    }

    const existingLoad = this.loadingStrategies.get(wallet)
    if (existingLoad) {
      return existingLoad
    }

    const loadPromise = createStrategy({
      args: this.args as unknown as CosmosWalletStrategyArguments,
      wallet,
    })

    this.loadingStrategies.set(wallet, loadPromise)

    try {
      const strategy = await loadPromise

      if (strategy) {
        this.strategies[wallet] = strategy
      }

      return strategy
    } finally {
      this.loadingStrategies.delete(wallet)
    }
  }

  public async loadStrategies(wallets: Wallet[]): Promise<void> {
    await Promise.all(wallets.map((wallet) => this.loadStrategy(wallet)))
  }
}

export const createCosmosStrategyFactory = (
  args: CosmosWalletStrategyArguments,
) => {
  return new BaseCosmosWalletStrategy(args)
}
