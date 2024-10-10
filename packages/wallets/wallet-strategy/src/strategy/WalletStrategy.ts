import {
  Wallet,
  isEthWallet,
  WalletStrategyOptions,
  ConcreteWalletStrategy,
  EthereumWalletStrategyArgs,
  WalletStrategyEthereumOptions,
} from '@injectivelabs/wallet-base'
import {
  WalletStrategyArguments,
  WalletStrategy as BaseWalletStrategy,
} from '@injectivelabs/wallet-core'
import { MetamaskStrategy } from '@injectivelabs/wallet-metamask'
import {
  LedgerLiveStrategy,
  LedgerLegacyStrategy,
} from '@injectivelabs/ledger-metamask'

const ethereumWalletsDisabled = (args: WalletStrategyArguments) => {
  const { ethereumOptions } = args

  if (!ethereumOptions) {
    return true
  }

  const { ethereumChainId } = ethereumOptions

  if (!ethereumChainId) {
    return true
  }

  return false
}

const createStrategy = ({
  args,
  wallet,
}: {
  args: WalletStrategyArguments
  wallet: Wallet
}): ConcreteWalletStrategy | undefined => {
  /**
   * If we only want to use Cosmos Native Wallets
   * We are not creating strategies for Ethereum Native Wallets
   */
  if (isEthWallet(wallet) && ethereumWalletsDisabled(args)) {
    return undefined
  }

  const ethWalletArgs = {
    chainId: args.chainId,
    ethereumOptions: args.ethereumOptions as WalletStrategyEthereumOptions,
  } as EthereumWalletStrategyArgs

  switch (wallet) {
    case Wallet.Metamask:
      return new MetamaskStrategy(ethWalletArgs)
    case Wallet.Ledger:
      return new LedgerLiveStrategy(ethWalletArgs)
    case Wallet.LedgerLegacy:
      return new LedgerLegacyStrategy(ethWalletArgs)
    // case Wallet.TrustWallet:
    //   return new TrustWallet(ethWalletArgs)
    // case Wallet.Trezor:
    //   return new Trezor(ethWalletArgs)
    // case Wallet.Torus:
    //   return new Torus(ethWalletArgs)
    // case Wallet.Phantom:
    //   return new Phantom(ethWalletArgs)
    // case Wallet.OkxWallet:
    //   return new Okx(ethWalletArgs)
    // case Wallet.BitGet:
    //   return new BitGet(ethWalletArgs)
    // case Wallet.WalletConnect:
    //   return new WalletConnect({
    //     ...ethWalletArgs,
    //     metadata: args.options?.metadata,
    //   })
    // case Wallet.PrivateKey:
    //   return new PrivateKey({
    //     ...ethWalletArgs,
    //     privateKey: args.options?.privateKey,
    //   })
    // case Wallet.Keplr:
    //   return new Keplr({ ...args })
    // case Wallet.Cosmostation:
    //   return new Cosmostation({ ...args })
    // case Wallet.Leap:
    //   return new Leap({ ...args })
    // case Wallet.Ninji:
    //   return new Ninji({ ...args })
    // case Wallet.Magic:
    //   if (
    //     !args.options?.metadata?.magic ||
    //     !(args.options?.metadata.magic as MagicMetadata)?.apiKey ||
    //     !(args.options?.metadata.magic as MagicMetadata)?.rpcEndpoint
    //   ) {
    //     return undefined
    //   }

    //   return new Magic({
    //     ...args,
    //     metadata: args.options.metadata.magic as MagicMetadata,
    //   })
    default:
      return undefined
  }
}

const createEnabledStrategies = (
  args: WalletStrategyArguments,
): Record<Wallet, ConcreteWalletStrategy | undefined> => {
  return args.walletStrategies.reduce(
    (strategies, wallet) => ({
      ...strategies,
      [wallet.wallet]: wallet.createStrategy(args),
    }),
    {} as Record<Wallet, ConcreteWalletStrategy | undefined>,
  )
}

export class WalletStrategy extends BaseWalletStrategy {
  /**
   * Case 1: Private Key is set dynamically
   * If we have a dynamically set private key,
   * we are creating a new PrivateKey strategy
   * with the specified private key
   *
   * Case 2: Wallet Connect Metadata set dynamically
   */
  public setOptions(options?: WalletStrategyOptions) {
    if (options?.privateKey) {
      this.strategies[Wallet.PrivateKey] = createStrategy({
        args: { ...this.args, options: { privateKey: options.privateKey } },
        wallet: Wallet.PrivateKey,
      })
    }

    if (options?.metadata) {
      this.strategies[Wallet.WalletConnect] = createStrategy({
        args: { ...this.args, options: { metadata: options.metadata } },
        wallet: Wallet.WalletConnect,
      })
    }
  }
}

export default (args: WalletStrategyArguments) => {
  return new WalletStrategy({
    strategies: createEnabledStrategies(args),
    ...args,
  })
}
