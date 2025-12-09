type EvmStrategy = typeof import('@injectivelabs/wallet-evm').EvmWalletStrategy
type CosmosStrategy =
  typeof import('@injectivelabs/wallet-cosmos').CosmosWalletStrategy
type LedgerStrategies = {
  LedgerLiveStrategy: typeof import('@injectivelabs/wallet-ledger').LedgerLiveStrategy
  LedgerLegacyStrategy: typeof import('@injectivelabs/wallet-ledger').LedgerLegacyStrategy
}
type TrezorStrategies = {
  TrezorBip32Strategy: typeof import('@injectivelabs/wallet-trezor').TrezorBip32Strategy
  TrezorBip44Strategy: typeof import('@injectivelabs/wallet-trezor').TrezorBip44Strategy
}
type PrivateKeyStrategy =
  typeof import('@injectivelabs/wallet-private-key').PrivateKeyWalletStrategy
type TurnkeyStrategy =
  typeof import('@injectivelabs/wallet-turnkey').TurnkeyWalletStrategy
type MagicStrategy = typeof import('@injectivelabs/wallet-magic').MagicStrategy
type WalletConnectStrategy =
  typeof import('@injectivelabs/wallet-wallet-connect').WalletConnectStrategy

let cachedEvmStrategy: EvmStrategy | null = null
let cachedCosmosStrategy: CosmosStrategy | null = null
let cachedLedgerStrategies: LedgerStrategies | null = null
let cachedTrezorStrategies: TrezorStrategies | null = null
let cachedPrivateKeyStrategy: PrivateKeyStrategy | null = null
let cachedTurnkeyStrategy: TurnkeyStrategy | null = null
let cachedMagicStrategy: MagicStrategy | null = null
let cachedWalletConnectStrategy: WalletConnectStrategy | null = null

export const loadEvmStrategy = async (): Promise<EvmStrategy> => {
  if (!cachedEvmStrategy) {
    cachedEvmStrategy = (await import('@injectivelabs/wallet-evm'))
      .EvmWalletStrategy
  }
  return cachedEvmStrategy
}

export const loadCosmosStrategy = async (): Promise<CosmosStrategy> => {
  if (!cachedCosmosStrategy) {
    cachedCosmosStrategy = (await import('@injectivelabs/wallet-cosmos'))
      .CosmosWalletStrategy
  }
  return cachedCosmosStrategy
}

export const loadLedgerStrategies = async (): Promise<LedgerStrategies> => {
  if (!cachedLedgerStrategies) {
    const m = await import('@injectivelabs/wallet-ledger')
    cachedLedgerStrategies = {
      LedgerLiveStrategy: m.LedgerLiveStrategy,
      LedgerLegacyStrategy: m.LedgerLegacyStrategy,
    }
  }
  return cachedLedgerStrategies
}

export const loadTrezorStrategies = async (): Promise<TrezorStrategies> => {
  if (!cachedTrezorStrategies) {
    const m = await import('@injectivelabs/wallet-trezor')
    cachedTrezorStrategies = {
      TrezorBip32Strategy: m.TrezorBip32Strategy,
      TrezorBip44Strategy: m.TrezorBip44Strategy,
    }
  }
  return cachedTrezorStrategies
}

export const loadPrivateKeyStrategy = async (): Promise<PrivateKeyStrategy> => {
  if (!cachedPrivateKeyStrategy) {
    cachedPrivateKeyStrategy = (
      await import('@injectivelabs/wallet-private-key')
    ).PrivateKeyWalletStrategy
  }
  return cachedPrivateKeyStrategy
}

export const loadTurnkeyStrategy = async (): Promise<TurnkeyStrategy> => {
  if (!cachedTurnkeyStrategy) {
    cachedTurnkeyStrategy = (await import('@injectivelabs/wallet-turnkey'))
      .TurnkeyWalletStrategy
  }
  return cachedTurnkeyStrategy
}

export const loadMagicStrategy = async (): Promise<MagicStrategy> => {
  if (!cachedMagicStrategy) {
    cachedMagicStrategy = (await import('@injectivelabs/wallet-magic'))
      .MagicStrategy
  }
  return cachedMagicStrategy
}

export const loadWalletConnectStrategy =
  async (): Promise<WalletConnectStrategy> => {
    if (!cachedWalletConnectStrategy) {
      cachedWalletConnectStrategy = (
        await import('@injectivelabs/wallet-wallet-connect')
      ).WalletConnectStrategy
    }

    return cachedWalletConnectStrategy
  }
