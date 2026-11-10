import { vi } from 'vitest'
import {
  Wallet,
  WalletStrategyEmitterEventType,
} from '@injectivelabs/wallet-base/runtime-light'
import { WalletStrategy } from './index.js'
import type { ChainId, EvmChainId } from '@injectivelabs/ts-types'

// Each fake strategy keeps the arguments it was created with
const { FakeStrategy } = vi.hoisted(() => ({
  FakeStrategy: class {
    setMetadata = vi.fn()
    disconnect = vi.fn()

    constructor(public args: Record<string, any>) {}
  },
}))

vi.mock('./loaders.js', () => ({
  loadPrivyStrategy: async () => FakeStrategy,
  loadTurnkeyStrategy: async () => FakeStrategy,
  loadPrivateKeyStrategy: async () => FakeStrategy,
  loadWalletConnectStrategy: async () => FakeStrategy,
}))

const createWalletStrategy = () =>
  new WalletStrategy({
    chainId: 'injective-888' as ChainId,
    evmOptions: {
      evmChainId: 1439 as EvmChainId,
      rpcUrl: 'http://127.0.0.1:1',
    },
    metadata: { turnkey: { defaultOrganizationId: 'org', apiBaseUrl: 'url' } },
    strategies: {},
  })

const createdArgs = async (walletStrategy: WalletStrategy, wallet: Wallet) =>
  (
    (await walletStrategy.loadStrategy(wallet)) as unknown as InstanceType<
      typeof FakeStrategy
    >
  ).args

describe('WalletStrategy.setMetadata', () => {
  it('keeps metadata for strategies loaded later, merged one level deep', async () => {
    const walletStrategy = createWalletStrategy()

    await walletStrategy.setMetadata({ turnkey: { session: 'session' } } as any)

    expect(
      (await createdArgs(walletStrategy, Wallet.Turnkey)).metadata.turnkey,
    ).toEqual({
      defaultOrganizationId: 'org',
      apiBaseUrl: 'url',
      session: 'session',
    })
  })

  it('gives a private key only to the strategy it rebuilds now', async () => {
    const walletStrategy = createWalletStrategy()

    await walletStrategy.setMetadata({ privateKey: { privateKey: '0x01' } })

    expect(
      (await createdArgs(walletStrategy, Wallet.PrivateKey)).metadata
        .privateKey,
    ).toEqual({ privateKey: '0x01' })

    // e.g. the store's disconnect, which passes no key
    await walletStrategy.setMetadata({ derivationPath: undefined } as any)

    expect(
      (await createdArgs(walletStrategy, Wallet.PrivateKey)).metadata
        .privateKey,
    ).toBeUndefined()
  })

  it("keeps the constructor's private key", async () => {
    const walletStrategy = new WalletStrategy({
      chainId: 'injective-888' as ChainId,
      evmOptions: {
        evmChainId: 1439 as EvmChainId,
        rpcUrl: 'http://127.0.0.1:1',
      },
      metadata: { privateKey: { privateKey: '0x01' } },
      strategies: {},
    })

    await walletStrategy.setMetadata({ privateKey: { privateKey: '0x02' } })
    await walletStrategy.setMetadata({ derivationPath: undefined } as any)

    expect(
      (await createdArgs(walletStrategy, Wallet.PrivateKey)).metadata
        .privateKey,
    ).toEqual({ privateKey: '0x01' })
  })

  it('passes metadata set during a load to the loaded strategy', async () => {
    const walletStrategy = createWalletStrategy()
    const loading = walletStrategy.loadStrategy(Wallet.Privy)

    await walletStrategy.setMetadata({ privy: { address: '0x02' } } as any)
    const strategy = (await loading) as unknown as InstanceType<
      typeof FakeStrategy
    >

    expect(strategy.setMetadata).toHaveBeenCalledWith(
      expect.objectContaining({ privy: { address: '0x02' } }),
    )
  })

  it('keeps WalletConnect metadata when it rebuilds for an unrelated update', async () => {
    const walletStrategy = createWalletStrategy()

    await walletStrategy.setMetadata({
      walletConnect: { projectId: 'project' },
    })
    await walletStrategy.setMetadata({ derivationPath: 'path' })

    expect(
      (await createdArgs(walletStrategy, Wallet.WalletConnect)).metadata,
    ).toMatchObject({
      walletConnect: { projectId: 'project' },
      derivationPath: 'path',
    })
  })

  it('clears explicitly undefined metadata without clearing other wallets', async () => {
    const walletStrategy = createWalletStrategy()
    const privy = { address: '0x02', getProvider: vi.fn() }

    await walletStrategy.setMetadata({ privy })
    await walletStrategy.setMetadata({ turnkey: undefined })

    expect(walletStrategy.args.metadata?.turnkey).toBeUndefined()
    expect(walletStrategy.args.metadata?.privy).toEqual(privy)
    expect(await walletStrategy.loadStrategy(Wallet.Turnkey)).toBeUndefined()
  })
})

describe('WalletStrategy.disconnect', () => {
  it('forgets cached Privy metadata before emitting disconnect', async () => {
    const walletStrategy = createWalletStrategy()
    const privy = { address: '0x02', getProvider: vi.fn() }
    const onDisconnect = vi.fn()

    await walletStrategy.setMetadata({ privy })
    await walletStrategy.setWallet(Wallet.Privy)
    const disconnect = walletStrategy.getStrategy().disconnect
    walletStrategy.on(
      WalletStrategyEmitterEventType.WalletStrategyDisconnect,
      () => onDisconnect(walletStrategy.args.metadata?.privy),
    )

    await walletStrategy.disconnect()

    expect(disconnect).toHaveBeenCalledOnce()
    expect(onDisconnect).toHaveBeenCalledExactlyOnceWith(undefined)
    expect(walletStrategy.args.metadata?.privy).toBeUndefined()
    expect(walletStrategy.args.metadata?.turnkey).toEqual({
      defaultOrganizationId: 'org',
      apiBaseUrl: 'url',
    })

    await walletStrategy.setMetadata({ derivationPath: 'path' })
    expect(
      (await createdArgs(walletStrategy, Wallet.PrivateKey)).metadata.privy,
    ).toBeUndefined()
  })

  it('keeps cached Privy metadata when another wallet disconnects', async () => {
    const walletStrategy = createWalletStrategy()
    const privy = { address: '0x02', getProvider: vi.fn() }

    await walletStrategy.setMetadata({ privy })
    await walletStrategy.setWallet(Wallet.Turnkey)
    await walletStrategy.disconnect()

    expect(walletStrategy.args.metadata?.privy).toEqual(privy)
  })

  it('keeps new Privy metadata set by a disconnect listener', async () => {
    const walletStrategy = createWalletStrategy()
    const privy = { address: '0x02', getProvider: vi.fn() }
    const nextPrivy = { address: '0x03', getProvider: vi.fn() }
    let metadataUpdate: Promise<void> | undefined

    await walletStrategy.setMetadata({ privy })
    await walletStrategy.setWallet(Wallet.Privy)
    walletStrategy.on(
      WalletStrategyEmitterEventType.WalletStrategyDisconnect,
      () => {
        metadataUpdate = walletStrategy.setMetadata({ privy: nextPrivy })
      },
    )

    await walletStrategy.disconnect()
    await metadataUpdate

    expect(walletStrategy.args.metadata?.privy).toEqual(nextPrivy)
  })
})
