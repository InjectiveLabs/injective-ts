import { GeneralException } from '@injectivelabs/exceptions'
import { BaseWalletStrategy } from '@injectivelabs/wallet-core/strategy'
import { Wallet, isEvmWallet } from '@injectivelabs/wallet-base/runtime-light'
import {
  loadEvmStrategy,
  loadMagicStrategy,
  loadPrivyStrategy,
  loadCosmosStrategy,
  loadTurnkeyStrategy,
  loadLedgerStrategies,
  loadTrezorStrategies,
  loadPrivateKeyStrategy,
  loadWalletConnectStrategy,
  loadPrivateKeyCosmosStrategy,
} from './loaders.js'
import type { Wallet as WalletType } from '@injectivelabs/wallet-base/runtime-light'
import type {
  WalletMetadata,
  StrategyEmitter,
} from '@injectivelabs/wallet-base/runtime-light'
import type {
  ConcreteStrategiesArg,
  ConcreteWalletStrategy,
  WalletStrategyArguments,
  WalletStrategyEvmOptions,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base/runtime-light'

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// Merge one level deep so a Turnkey session update keeps its organization ID.
const mergeMetadata = (
  current: WalletMetadata = {},
  incoming: WalletMetadata = {},
): WalletMetadata => {
  const previous = new Map<string, unknown>(Object.entries(current))

  return {
    ...current,
    ...Object.fromEntries(
      Object.entries(incoming).map(([key, value]) => {
        const old = previous.get(key)

        return [
          key,
          isPlainObject(old) && isPlainObject(value)
            ? { ...old, ...value }
            : value,
        ]
      }),
    ),
  }
}

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

const createStrategy = async ({
  args,
  wallet,
  emitter,
}: {
  wallet: Wallet
  args: WalletStrategyArguments
  emitter?: StrategyEmitter
}): Promise<ConcreteWalletStrategy | undefined> => {
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
    emitter,
  } as ConcreteEvmWalletStrategyArgs

  const cosmosWalletArgs = {
    ...args,
    emitter,
  }

  switch (wallet) {
    case Wallet.Metamask:
    case Wallet.TrustWallet:
    case Wallet.Phantom:
    case Wallet.OkxWallet:
    case Wallet.BitGet:
    case Wallet.Rainbow:
    case Wallet.Rabby:
    case Wallet.KeplrEvm: {
      const EvmWalletStrategy = await loadEvmStrategy()

      return new EvmWalletStrategy({
        ...ethWalletArgs,
        wallet,
      })
    }

    case Wallet.Keplr:
    case Wallet.Leap:
    case Wallet.Ninji:
    case Wallet.OWallet:
    case Wallet.Cosmostation: {
      const CosmosWalletStrategy = await loadCosmosStrategy()

      return new CosmosWalletStrategy({ ...cosmosWalletArgs, wallet })
    }

    case Wallet.Ledger: {
      const { LedgerLiveStrategy } = await loadLedgerStrategies()

      return new LedgerLiveStrategy(ethWalletArgs)
    }

    case Wallet.LedgerLegacy: {
      const { LedgerLegacyStrategy } = await loadLedgerStrategies()

      return new LedgerLegacyStrategy(ethWalletArgs)
    }

    case Wallet.TrezorBip32: {
      const { TrezorBip32Strategy } = await loadTrezorStrategies()

      return new TrezorBip32Strategy(ethWalletArgs)
    }

    case Wallet.TrezorBip44: {
      const { TrezorBip44Strategy } = await loadTrezorStrategies()

      return new TrezorBip44Strategy(ethWalletArgs)
    }

    case Wallet.PrivateKey: {
      const PrivateKeyWalletStrategy = await loadPrivateKeyStrategy()

      return new PrivateKeyWalletStrategy(ethWalletArgs)
    }

    case Wallet.PrivateKeyCosmos: {
      const PrivateKeyCosmosStrategy = await loadPrivateKeyCosmosStrategy()

      return new PrivateKeyCosmosStrategy(cosmosWalletArgs)
    }

    case Wallet.Turnkey: {
      if (!args.metadata?.turnkey?.defaultOrganizationId) {
        return undefined
      }
      const TurnkeyWalletStrategy = await loadTurnkeyStrategy()

      return new TurnkeyWalletStrategy(ethWalletArgs)
    }

    case Wallet.Privy: {
      const PrivyWalletStrategy = await loadPrivyStrategy()

      return new PrivyWalletStrategy(ethWalletArgs)
    }

    case Wallet.Magic: {
      if (!args.metadata?.magic?.apiKey || !args.metadata?.magic?.rpcEndpoint) {
        return undefined
      }
      const MagicStrategy = await loadMagicStrategy()

      return new MagicStrategy(cosmosWalletArgs)
    }

    case Wallet.WalletConnect: {
      if (!args.metadata?.walletConnect?.projectId) {
        return undefined
      }
      const WalletConnectStrategy = await loadWalletConnectStrategy()

      return new WalletConnectStrategy(ethWalletArgs)
    }

    default:
      return undefined
  }
}

export class WalletStrategy extends BaseWalletStrategy {
  private loadingStrategies: Map<
    Wallet,
    Promise<ConcreteWalletStrategy | undefined>
  > = new Map()

  constructor(args: WalletStrategyArguments) {
    const strategies = {} as ConcreteStrategiesArg

    super({
      ...args,
      strategies,
    })
  }

  /**
   * Set the current wallet and load its strategy.
   * This method is async because strategies are lazy-loaded.
   *
   * @param wallet - The wallet to set as active
   * @throws GeneralException if the wallet strategy cannot be loaded
   */
  public async setWallet(wallet: Wallet): Promise<void> {
    this.wallet = wallet

    // Preload the strategy for the new wallet
    const strategy = await this.loadStrategy(wallet)
    await strategy?.initStrategy?.()
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
  public async setMetadata(metadata?: WalletMetadata): Promise<void> {
    // Kept for strategies loaded later. A private key passed here only goes to the
    // strategy built now; the constructor's stays
    const { privateKey: _privateKey, ...kept } = metadata ?? {}

    this.args = {
      ...this.args,
      metadata: mergeMetadata(this.args.metadata, kept),
    }

    const shouldRecreateStrategyOnMetadataChange = [
      Wallet.PrivateKey,
      Wallet.WalletConnect,
    ] as WalletType[]

    const strategiesWithPlaceholders = {
      ...this.strategies,
      [Wallet.PrivateKey]: undefined,
      [Wallet.WalletConnect]: undefined,
    }

    for (const wallet of Object.keys(strategiesWithPlaceholders)) {
      const walletEnum = wallet as Wallet

      if (shouldRecreateStrategyOnMetadataChange.includes(walletEnum)) {
        // Clear loading cache for this wallet
        this.loadingStrategies.delete(walletEnum)

        this.strategies[walletEnum] = await createStrategy({
          args: {
            ...this.args,
            metadata: mergeMetadata(this.args.metadata, metadata),
          },
          wallet: walletEnum,
          emitter: this.getEmitter(),
        })

        continue
      }

      this.strategies[walletEnum]?.setMetadata?.(metadata)
    }
  }

  public async disconnect(): Promise<void> {
    // Clear the cached wallet before disconnect listeners can start a new session.
    if (this.wallet === Wallet.Privy && this.args.metadata?.privy) {
      const { privy: _privy, ...metadata } = this.args.metadata

      this.args = { ...this.args, metadata }
    }

    await super.disconnect()
  }

  /**
   * Get the strategy for the current wallet.
   *
   * NOTE: Ensure the strategy is loaded first by calling setWallet() or loadStrategy().
   * This method throws if the strategy hasn't been loaded yet.
   *
   * @throws GeneralException if the strategy hasn't been loaded
   */
  public getStrategy(): ConcreteWalletStrategy {
    if (this.strategies[this.wallet]) {
      const strategy = this.strategies[this.wallet] as ConcreteWalletStrategy

      return strategy
    }

    throw new GeneralException(
      new Error(
        `Wallet ${this.wallet} strategy not loaded. Call setWallet() or loadStrategy() first.`,
      ),
    )
  }

  /**
   * Load a wallet strategy. Strategies are lazy-loaded to reduce initial bundle size.
   * Call this method before using getStrategy() for a wallet.
   *
   * @param wallet - The wallet strategy to load (defaults to current wallet)
   * @returns The loaded strategy
   */
  public async loadStrategy(
    wallet: Wallet = this.wallet,
  ): Promise<ConcreteWalletStrategy | undefined> {
    // Return cached strategy if available
    if (this.strategies[wallet]) {
      return this.strategies[wallet]
    }

    // Check if we're already loading this strategy (dedup concurrent calls)
    const existingLoad = this.loadingStrategies.get(wallet)
    if (existingLoad) {
      return existingLoad
    }

    // Start loading the strategy
    const { args } = this
    const loadPromise = createStrategy({
      args,
      wallet,
      emitter: this.getEmitter(),
    })

    this.loadingStrategies.set(wallet, loadPromise)

    try {
      const strategy = await loadPromise

      if (strategy) {
        // A setMetadata call during the load didn't reach this strategy
        if (this.args !== args) {
          strategy.setMetadata?.(this.args.metadata)
        }

        this.strategies[wallet] = strategy
      }

      return strategy
    } finally {
      // Clean up loading state
      this.loadingStrategies.delete(wallet)
    }
  }

  /**
   * Load multiple wallet strategies in parallel.
   * Useful for preloading commonly used wallets during app initialization.
   *
   * @param wallets - Array of wallets to preload
   */
  public async loadStrategies(wallets: Wallet[]): Promise<void> {
    await Promise.all(wallets.map((wallet) => this.loadStrategy(wallet)))
  }
}

export const createStrategyFactory = (args: WalletStrategyArguments) => {
  return new WalletStrategy(args)
}
