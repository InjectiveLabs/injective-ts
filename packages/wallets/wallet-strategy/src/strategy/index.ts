import { MagicStrategy } from '@injectivelabs/wallet-magic'
import { GeneralException } from '@injectivelabs/exceptions'
import { EvmWalletStrategy } from '@injectivelabs/wallet-evm'
import { BaseWalletStrategy } from '@injectivelabs/wallet-core'
import { CosmosWalletStrategy } from '@injectivelabs/wallet-cosmos'
import { TurnkeyWalletStrategy } from '@injectivelabs/wallet-turnkey'
import { WalletConnectStrategy } from '@injectivelabs/wallet-wallet-connect'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'
import { CosmostationWalletStrategy } from '@injectivelabs/wallet-cosmostation'
import {
  Wallet,
  isEvmWallet,
  type WalletMetadata,
<<<<<<< HEAD
=======
  ConcreteStrategiesArg,
  ConcreteWalletStrategy,
  WalletStrategyArguments,
  WalletStrategyEvmOptions,
  ConcreteEvmWalletStrategyArgs,
>>>>>>> dev
} from '@injectivelabs/wallet-base'
import {
  LedgerLiveStrategy,
  LedgerLegacyStrategy,
} from '@injectivelabs/wallet-ledger'
import {
  TrezorBip32Strategy,
  TrezorBip44Strategy,
} from '@injectivelabs/wallet-trezor'
<<<<<<< HEAD
import type {
  ConcreteStrategiesArg,
  ConcreteWalletStrategy,
  WalletStrategyArguments,
  WalletStrategyEvmOptions,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
=======
import { MagicStrategy } from '@injectivelabs/wallet-magic'
import { GeneralException } from '@injectivelabs/exceptions'
import { EvmWalletStrategy } from '@injectivelabs/wallet-evm'
import { BaseWalletStrategy } from '@injectivelabs/wallet-core'
import { CosmosWalletStrategy } from '@injectivelabs/wallet-cosmos'
import { TurnkeyWalletStrategy } from '@injectivelabs/wallet-turnkey'
import { WalletConnectStrategy } from '@injectivelabs/wallet-wallet-connect'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'
import { CosmostationWalletStrategy } from '@injectivelabs/wallet-cosmostation'
>>>>>>> dev

const ethereumWalletsDisabled = (args: WalletStrategyArguments) => {
  const { evmOptions } = args

  if (!evmOptions) {
    return true
  }

  const { evmChainId } = evmOptions

  if (!evmChainId) {
    return true
  }

  return false
}

const createStrategy = ({
  args,
  wallet,
}: {
  wallet: Wallet
  args: WalletStrategyArguments
}): ConcreteWalletStrategy | undefined => {
  console.log('creating strategy for wallet:', wallet)

  /**
   * If we only want to use Cosmos Native Wallets
   * We are not creating strategies for Ethereum Native Wallets
   */
  if (isEvmWallet(wallet) && ethereumWalletsDisabled(args)) {
    console.log(
      'Skipping EVM wallet strategy creation due to disabled EVM options',
    )

    return undefined
  }

  const ethWalletArgs = {
    ...args,
    chainId: args.chainId,
    evmOptions: args.evmOptions as WalletStrategyEvmOptions,
  } as ConcreteEvmWalletStrategyArgs

  switch (wallet) {
    case Wallet.Metamask:
      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet: Wallet.Metamask,
      })
    case Wallet.TrustWallet:
      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet: Wallet.TrustWallet,
      })
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
    case Wallet.Rainbow:
      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet: Wallet.Rainbow,
      })
    case Wallet.Rabby:
      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet: Wallet.Rabby,
      })

    case Wallet.Keplr:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Keplr })
    case Wallet.Leap:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Leap })
    case Wallet.Ninji:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.Ninji })
    case Wallet.OWallet:
      return new CosmosWalletStrategy({ ...args, wallet: Wallet.OWallet })

    case Wallet.Cosmostation:
      return new CosmostationWalletStrategy({ ...args })

    case Wallet.Ledger:
      return new LedgerLiveStrategy(ethWalletArgs)
    case Wallet.LedgerLegacy:
      return new LedgerLegacyStrategy(ethWalletArgs)

    case Wallet.TrezorBip32:
      return new TrezorBip32Strategy(ethWalletArgs)
    case Wallet.TrezorBip44:
      return new TrezorBip44Strategy(ethWalletArgs)
    case Wallet.PrivateKey:
      return new PrivateKeyWalletStrategy(ethWalletArgs)

    case Wallet.Turnkey:
      if (!args.metadata?.turnkey?.defaultOrganizationId) {
        return undefined
      }

      return new TurnkeyWalletStrategy(ethWalletArgs)

    case Wallet.Magic:
      if (!args.metadata?.magic?.apiKey || !args.metadata?.magic?.rpcEndpoint) {
        return undefined
      }

      return new MagicStrategy(args)

    case Wallet.WalletConnect:
      if (!args.metadata?.walletConnect?.projectId) {
        return undefined
      }

      return new WalletConnectStrategy(ethWalletArgs)

    default:
      return undefined
  }
}

export class WalletStrategy extends BaseWalletStrategy {
  constructor(args: WalletStrategyArguments) {
    const strategies = {} as ConcreteStrategiesArg

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

    const strategiesWithPlaceholders = {
      ...this.strategies,
      [Wallet.PrivateKey]: undefined,
      [Wallet.WalletConnect]: undefined,
    }

    for (const wallet of Object.keys(strategiesWithPlaceholders)) {
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

  public getStrategy(): ConcreteWalletStrategy {
<<<<<<< HEAD
    console.log('creating strategy for wallet via getStrategy:', this.wallet)

=======
>>>>>>> dev
    if (this.strategies[this.wallet]) {
      return this.strategies[this.wallet] as ConcreteWalletStrategy
    }

    const strategy = createStrategy({
      args: this.args,
      wallet: this.wallet,
    })

<<<<<<< HEAD
    console.log(strategy, {
      args: this.args,
      wallet: this.wallet,
    })

=======
>>>>>>> dev
    if (!strategy) {
      throw new GeneralException(
        new Error(`Wallet ${this.wallet} is not enabled/available!`),
      )
    }

    this.strategies[this.wallet] = strategy

    return strategy as ConcreteWalletStrategy
  }
}

export const createStrategyFactory = (args: WalletStrategyArguments) => {
  return new WalletStrategy(args)
}
