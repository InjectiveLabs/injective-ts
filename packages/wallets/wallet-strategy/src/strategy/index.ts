import {
  Wallet,
  isEvmWallet,
  type WalletMetadata,
  ConcreteStrategiesArg,
  ConcreteWalletStrategy,
  WalletStrategyArguments,
  WalletStrategyEthereumOptions,
  ConcreteEthereumWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import {
  LedgerLiveStrategy,
  LedgerLegacyStrategy,
} from '@injectivelabs/wallet-ledger'
import { MagicStrategy } from '@injectivelabs/wallet-magic'
import { EvmWalletStrategy } from '@injectivelabs/wallet-evm'
import { BaseWalletStrategy } from '@injectivelabs/wallet-core'
import { CosmosWalletStrategy } from '@injectivelabs/wallet-cosmos'
import {
  TurnkeyOtpWalletStrategy,
  TurnkeyOauthWalletStrategy,
} from '@injectivelabs/wallet-turnkey'
import {
  TrezorBip32Strategy,
  TrezorBip44Strategy,
} from '@injectivelabs/wallet-trezor'
import { WalletConnectStrategy } from '@injectivelabs/wallet-wallet-connect'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'
import { CosmostationWalletStrategy } from '@injectivelabs/wallet-cosmostation'

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
  if (isEvmWallet(wallet) && ethereumWalletsDisabled(args)) {
    return undefined
  }

  const ethWalletArgs = {
    ...args,
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
    case Wallet.TrustWallet:
      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet: Wallet.TrustWallet,
      })
    case Wallet.TrezorBip32:
      return new TrezorBip32Strategy(ethWalletArgs)
    case Wallet.TrezorBip44:
      return new TrezorBip44Strategy(ethWalletArgs)
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
    case Wallet.WalletConnect:
      if (!args.metadata?.walletConnect?.projectId) {
        return undefined
      }

      return new WalletConnectStrategy(ethWalletArgs)
    case Wallet.PrivateKey:
      return new PrivateKeyWalletStrategy(ethWalletArgs)
    case Wallet.Keplr:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Keplr })
    case Wallet.Cosmostation:
      return new CosmostationWalletStrategy({ ...args })
    case Wallet.Leap:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Leap })
    case Wallet.Ninji:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Ninji })
    case Wallet.OWallet:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.OWallet })
    case Wallet.Magic:
      if (!args.metadata?.magic?.apiKey || !args.metadata?.magic?.rpcEndpoint) {
        return undefined
      }

      return new MagicStrategy(args)
    case Wallet.TurnkeyOtp:
      if (
        !args.metadata?.turnkey?.defaultOrganizationId ||
        !args.metadata?.turnkey?.iframeContainerId
      ) {
        return undefined
      }
      return new TurnkeyOtpWalletStrategy(ethWalletArgs)
    case Wallet.TurnkeyOauth:
      if (
        !args.metadata?.turnkey?.defaultOrganizationId ||
        !args.metadata?.turnkey?.iframeContainerId
      ) {
        return undefined
      }
      return new TurnkeyOauthWalletStrategy(ethWalletArgs)
    default:
      return undefined
  }
}

const createAllStrategies = (
  args: WalletStrategyArguments,
): ConcreteStrategiesArg => {
  return Object.values(Wallet).reduce((strategies, wallet) => {
    if (strategies[wallet]) {
      return strategies
    }

    strategies[wallet] = createStrategy({ args, wallet: wallet as Wallet })

    return strategies
  }, {} as ConcreteStrategiesArg)
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
   * This method is used to set the metadata for the wallet strategies.
   * In some cases we are going to set the metadata dynamically on the fly, and in
   * some cases we are recreating the wallet strategies from scratch using the new
   * metadata
   *
   * Case 1: Private Key is set dynamically
   * If we have a dynamically set private key,
   * we are creating a new PrivateKey strategy
   * with the specified private key (passed as metadata)
   *
   * Case 2: Similar to Case 1, but for Wallet Connect Metadata
   *
   */
  public setMetadata(metadata?: WalletMetadata) {
    const shouldRecreateStrategyOnMetadataChange = [
      Wallet.PrivateKey,
      Wallet.WalletConnect,
    ]

    for (const wallet of Object.keys(this.strategies)) {
      const walletEnum = wallet as Wallet

      if (shouldRecreateStrategyOnMetadataChange.includes(walletEnum)) {
        this.strategies[walletEnum] = createStrategy({
          args: {
            ...this.args,
            metadata: { ...this.args.metadata, ...metadata },
          },
          wallet: walletEnum,
        })

        continue
      }

      this.strategies[walletEnum]?.setMetadata?.(metadata)
    }
  }
}

export const createStrategyFactory = (args: WalletStrategyArguments) => {
  return new WalletStrategy(args)
}
