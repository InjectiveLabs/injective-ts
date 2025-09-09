import { BaseWalletStrategy } from '@injectivelabs/wallet-core'
import {
  Wallet,
  isCosmosWallet
} from '@injectivelabs/wallet-base'
import {
  CosmosWalletStrategy,
  CosmostationWalletStrategy,
} from './strategies/index.js'
import type { CosmosWalletStrategyArguments } from './types.js'
import type {
  ConcreteStrategiesArg,
  ConcreteWalletStrategy,
  WalletStrategyArguments} from '@injectivelabs/wallet-base';

const createStrategy = ({
  args,
  wallet,
}: {
  wallet: Wallet
  args: CosmosWalletStrategyArguments
}): ConcreteWalletStrategy | undefined => {
  switch (wallet) {
    case Wallet.Keplr:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Keplr })
    case Wallet.Cosmostation:
      return new CosmostationWalletStrategy({
        ...args,
        wallet: Wallet.Cosmostation,
      })
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

const createAllStrategies = (
  args: CosmosWalletStrategyArguments,
): ConcreteStrategiesArg => {
  return Object.values(Wallet).reduce((strategies, wallet) => {
    if (strategies[wallet]) {
      return strategies
    }

    strategies[wallet] = createStrategy({ args, wallet: wallet as Wallet })

    return strategies
  }, {} as ConcreteStrategiesArg)
}

export class BaseCosmosWalletStrategy extends BaseWalletStrategy {
  constructor(args: CosmosWalletStrategyArguments) {
    const strategies = createAllStrategies(args)

    super({
      ...args,
      strategies,
    } as unknown as WalletStrategyArguments)
  }

  public setWallet(wallet: Wallet) {
    this.wallet = isCosmosWallet(wallet) ? wallet : Wallet.Keplr
  }
}

export const createCosmosStrategyFactory = (
  args: CosmosWalletStrategyArguments,
) => {
  return new BaseCosmosWalletStrategy(args)
}
