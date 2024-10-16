import {
  Wallet,
  isEthWallet,
  MagicMetadata,
  ConcreteWalletStrategy,
  WalletStrategyArguments,
  ConcreteWalletStrategyOptions,
  WalletStrategyEthereumOptions,
  ConcreteEthereumWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import {
  LedgerLiveStrategy,
  LedgerLegacyStrategy,
} from '@injectivelabs/wallet-ledger'
import { MagicStrategy } from '@injectivelabs/wallet-magic'
import { KeplrStrategy } from '@injectivelabs/wallet-keplr'
import { EvmWalletStrategy } from '@injectivelabs/wallet-evm'
import { BaseWalletStrategy } from '@injectivelabs/wallet-core'
import { TrezorWalletStrategy } from '@injectivelabs/wallet-trezor'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'

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
  } as ConcreteEthereumWalletStrategyArgs

  switch (wallet) {
    case Wallet.Metamask:
      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet: Wallet.Metamask,
      })
    case Wallet.Ledger:
      return new LedgerLiveStrategy(ethWalletArgs)
    case Wallet.LedgerLegacy:
      return new LedgerLegacyStrategy(ethWalletArgs)
    // case Wallet.TrustWallet:
    //   return new TrustWallet(ethWalletArgs)
    case Wallet.Trezor:
      return new TrezorWalletStrategy(ethWalletArgs)
    case Wallet.Phantom:
      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet: Wallet.Phantom,
      })
    case Wallet.OkxWallet:
      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet: Wallet.OkxWallet,
      })
    case Wallet.BitGet:
      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet: Wallet.BitGet,
      })
    // case Wallet.WalletConnect:
    //   return new WalletConnect({
    //     ...ethWalletArgs,
    //     metadata: args.options?.metadata,
    //   })
    case Wallet.PrivateKey:
      return new PrivateKeyWalletStrategy({
        ...ethWalletArgs,
        privateKey: args.options?.privateKey,
      })
    case Wallet.Keplr:
      return new KeplrStrategy({ ...args })
    // case Wallet.Cosmostation:
    //   return new Cosmostation({ ...args })
    // case Wallet.Leap:
    //   return new Leap({ ...args })
    // case Wallet.Ninji:
    //   return new Ninji({ ...args })
    case Wallet.Magic:
      if (
        !args.options?.metadata?.magic ||
        !(args.options?.metadata.magic as MagicMetadata)?.apiKey ||
        !(args.options?.metadata.magic as MagicMetadata)?.rpcEndpoint
      ) {
        return undefined
      }

      return new MagicStrategy({
        ...args,
        metadata: args.options.metadata.magic as MagicMetadata,
      })
    default:
      return undefined
  }
}

const createAllStrategies = (
  args: WalletStrategyArguments,
): Record<Wallet, ConcreteWalletStrategy | undefined> => {
  return Object.values(Wallet).reduce(
    (strategies, wallet) => ({
      ...strategies,
      [wallet]: createStrategy({ args, wallet: wallet as Wallet }),
    }),
    {} as Record<Wallet, ConcreteWalletStrategy | undefined>,
  )
}

export class WalletStrategy extends BaseWalletStrategy {
  constructor(args: WalletStrategyArguments) {
    const strategies = createAllStrategies(args)

    super({
      ...args,
      strategies,
    })
  }
  /**
   * Case 1: Private Key is set dynamically
   * If we have a dynamically set private key,
   * we are creating a new PrivateKey strategy
   * with the specified private key
   *
   * Case 2: Wallet Connect Metadata set dynamically
   */
  public setOptions(options?: ConcreteWalletStrategyOptions) {
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

export const createStrategyFactory = (args: WalletStrategyArguments) => {
  return new WalletStrategy(args)
}
