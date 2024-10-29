import {
  Wallet,
  ConcreteStrategiesArg,
  ConcreteWalletStrategy,
  WalletStrategyArguments,
  isCosmosWallet,
} from '@injectivelabs/wallet-base'
import { BaseWalletStrategy } from '@injectivelabs/wallet-core'
import { CosmosWalletStrategy, CosmostationWalletStrategy } from './strategies'
import { CosmosWalletStrategyArguments } from './types'

const createStrategy = ({
  args,
  wallet,
}: {
  args: CosmosWalletStrategyArguments
  wallet: Wallet
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
  return Object.values(Wallet).reduce(
    (strategies, wallet) => ({
      ...strategies,
      [wallet]: createStrategy({ args, wallet: wallet as Wallet }),
    }),
    {} as ConcreteStrategiesArg,
  )
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
