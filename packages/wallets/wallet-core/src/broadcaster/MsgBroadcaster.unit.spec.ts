import { vi, afterEach } from 'vitest'
import { Network } from '@injectivelabs/networks'
import { TransactionException } from '@injectivelabs/exceptions'
import { PublicKey, PrivateKey } from '@injectivelabs/sdk-ts/core/accounts'
import { IndexerGrpcWeb3GwApi } from '@injectivelabs/sdk-ts/client/indexer'
import {
  Wallet,
  WalletStrategyEmitterEventType,
} from '@injectivelabs/wallet-base'
import {
  TxClient,
  TxGrpcApi,
  TxInclusionStrategy,
  CosmosTxV1Beta1TxPb,
} from '@injectivelabs/sdk-ts/core/tx'
import {
  ChainGrpcAuthApi,
  ChainGrpcTxFeesApi,
  ChainGrpcTendermintApi,
} from '@injectivelabs/sdk-ts/client/chain'
import { MsgBroadcaster } from './MsgBroadcaster.js'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type { MsgBroadcasterOptions } from './types.js'
import type BaseWalletStrategy from '../strategy/BaseWalletStrategy.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeTxResponse = (txHash = 'TEST_HASH'): TxResponse =>
  ({
    txHash,
    height: 100,
    code: 0,
    rawLog: '',
    gasWanted: 100000,
    gasUsed: 80000,
    events: [],
    data: '',
    info: '',
    codespace: '',
    timestamp: '',
    txhash: txHash,
    logs: [],
  }) as unknown as TxResponse

const makeValidTxRawBytes = () => {
  const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
    bodyBytes: new Uint8Array(),
    authInfoBytes: new Uint8Array(),
    signatures: [],
  })
  return CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRaw)
}

const makeMessage = () =>
  ({
    toBinary: () => new Uint8Array(),
    toDirectSign: () => ({ type: '/cosmos.bank.v1beta1.MsgSend' }),
  }) as any

const makeDirectSignResponse = (pubKey = 'mockPubKeyBase64') => ({
  signed: {
    bodyBytes: new Uint8Array(),
    authInfoBytes: new Uint8Array(),
  },
  signature: {
    signature: 'bW9ja1NpZw==',
    pub_key: { value: pubKey, type: 'ed25519' },
  },
})

const makeBaseAccount = (overrides: Record<string, unknown> = {}) => ({
  accountNumber: 1,
  sequence: 1,
  pubKey: { key: 'mockPubKeyBase64' },
  ...overrides,
})

const createMockWalletStrategy = () =>
  ({
    wallet: 'keplr',
    getWallet: vi.fn().mockReturnValue('keplr'),
    getWalletDeviceType: vi.fn().mockResolvedValue('browser'),
    getPubKey: vi.fn().mockResolvedValue('mockPubKeyBase64'),
    getEthereumChainId: vi.fn().mockResolvedValue(undefined),
    signCosmosTransaction: vi.fn().mockResolvedValue(makeDirectSignResponse()),
    sendTransaction: vi.fn().mockResolvedValue({ txHash: 'MOCK_TX_HASH' }),
    getCosmosWallet: vi.fn(),
    emit: vi.fn().mockReturnValue(true),
  }) as unknown as BaseWalletStrategy

afterEach(() => {
  vi.restoreAllMocks()
})

describe('MsgBroadcaster options', () => {
  it('updates boolean options with explicit false values', () => {
    const broadcaster = new MsgBroadcaster({
      network: Network.Devnet,
      simulateTx: true,
      useDynamicBaseFee: true,
      walletStrategy: createMockWalletStrategy(),
      txTimeoutOnFeeDelegation: true,
    })

    broadcaster.setOptions({
      simulateTx: false,
      useDynamicBaseFee: false,
      txTimeoutOnFeeDelegation: false,
    })

    expect(broadcaster.simulateTx).toBe(false)
    expect(broadcaster.useDynamicBaseFee).toBe(false)
    expect(broadcaster.txTimeoutOnFeeDelegation).toBe(false)
  })

  it('skips dynamic base fee by default', async () => {
    const broadcaster = new MsgBroadcaster({
      network: Network.Devnet,
      walletStrategy: createMockWalletStrategy(),
    })
    const fetchEipBaseFee = vi
      .spyOn(ChainGrpcTxFeesApi.prototype, 'fetchEipBaseFee')
      .mockResolvedValue({ baseFee: '999' } as any)

    await (broadcaster as any).getStdFeeWithDynamicBaseFee({ gas: '400000' })

    expect(fetchEipBaseFee).not.toHaveBeenCalled()
  })

  it('fetches dynamic base fee when explicitly enabled', async () => {
    const broadcaster = new MsgBroadcaster({
      network: Network.Devnet,
      useDynamicBaseFee: true,
      walletStrategy: createMockWalletStrategy(),
    })
    const fetchEipBaseFee = vi
      .spyOn(ChainGrpcTxFeesApi.prototype, 'fetchEipBaseFee')
      .mockResolvedValue({ baseFee: '170000000' } as any)

    await (broadcaster as any).getStdFeeWithDynamicBaseFee({ gas: '400000' })

    expect(fetchEipBaseFee).toHaveBeenCalledOnce()
  })

  it('does not simulate or fetch dynamic base fee when both are disabled', async () => {
    const broadcaster = new MsgBroadcaster({
      network: Network.Devnet,
      simulateTx: false,
      useDynamicBaseFee: false,
      walletStrategy: createMockWalletStrategy(),
    })
    const fetchEipBaseFee = vi
      .spyOn(ChainGrpcTxFeesApi.prototype, 'fetchEipBaseFee')
      .mockResolvedValue({ baseFee: '170000000' } as any)
    const simulateTxWithSigners = vi.spyOn(
      broadcaster as any,
      'simulateTxWithSigners',
    )

    await (broadcaster as any).getTxWithSignersAndStdFee({
      chainId: 'injective-888',
      memo: '',
      message: [makeMessage()],
      timeoutHeight: 100,
      signers: {
        sequence: 1,
        accountNumber: 1,
        pubKey: 'mockPubKeyBase64',
      },
      fee: {
        amount: [{ denom: 'inj', amount: '64000000000000' }],
        gas: '400000',
      },
    })

    expect(fetchEipBaseFee).not.toHaveBeenCalled()
    expect(simulateTxWithSigners).not.toHaveBeenCalled()
  })
})

describe('MsgBroadcaster account and height details', () => {
  it('uses provided account details and latest height without RPC calls', async () => {
    const broadcaster = new MsgBroadcaster({
      network: Network.Devnet,
      walletStrategy: createMockWalletStrategy(),
    })
    const fetchAccount = vi.spyOn(ChainGrpcAuthApi.prototype, 'fetchAccount')
    const fetchLatestBlock = vi.spyOn(
      ChainGrpcTendermintApi.prototype,
      'fetchLatestBlock',
    )
    const baseAccount = makeBaseAccount()

    const result = await (broadcaster as any).fetchAccountAndBlockDetails({
      latestHeight: '123',
      address: 'inj1test',
      existingAccountDetails: baseAccount,
    })

    expect(result).toEqual({ latestHeight: '123', baseAccount })
    expect(fetchAccount).not.toHaveBeenCalled()
    expect(fetchLatestBlock).not.toHaveBeenCalled()
  })

  it('fetches account only when timeout height is provided', async () => {
    const broadcaster = new MsgBroadcaster({
      network: Network.Devnet,
      walletStrategy: createMockWalletStrategy(),
    })
    const baseAccount = makeBaseAccount()
    const fetchAccount = vi
      .spyOn(ChainGrpcAuthApi.prototype, 'fetchAccount')
      .mockResolvedValue({ baseAccount } as any)
    const fetchLatestBlock = vi.spyOn(
      ChainGrpcTendermintApi.prototype,
      'fetchLatestBlock',
    )

    const result = await (broadcaster as any).fetchAccountAndBlockDetails({
      timeoutHeight: '456',
      address: 'inj1test',
    })

    expect(result).toEqual({ latestHeight: undefined, baseAccount })
    expect(fetchAccount).toHaveBeenCalledOnce()
    expect(fetchLatestBlock).not.toHaveBeenCalled()
  })

  it('fetches account and latest block in parallel when neither height is provided', async () => {
    const broadcaster = new MsgBroadcaster({
      network: Network.Devnet,
      walletStrategy: createMockWalletStrategy(),
    })
    let isAccountFetchStarted = false
    let isLatestBlockFetchStarted = false
    let resolveAccountFetch: (value: unknown) => void = () => undefined
    let resolveLatestBlockFetch: (value: unknown) => void = () => undefined
    const accountFetchPromise = new Promise((resolve) => {
      resolveAccountFetch = resolve
    })
    const latestBlockFetchPromise = new Promise((resolve) => {
      resolveLatestBlockFetch = resolve
    })

    vi.spyOn(ChainGrpcAuthApi.prototype, 'fetchAccount').mockImplementation(
      () => {
        isAccountFetchStarted = true

        return accountFetchPromise as any
      },
    )
    vi.spyOn(
      ChainGrpcTendermintApi.prototype,
      'fetchLatestBlock',
    ).mockImplementation(() => {
      isLatestBlockFetchStarted = true

      return latestBlockFetchPromise as any
    })

    const resultPromise = (broadcaster as any).fetchAccountAndBlockDetails({
      address: 'inj1test',
    })
    await Promise.resolve()

    expect(isAccountFetchStarted).toBe(true)
    expect(isLatestBlockFetchStarted).toBe(true)

    const baseAccount = makeBaseAccount()
    resolveAccountFetch({ baseAccount })
    resolveLatestBlockFetch({ header: { height: '789' } })

    await expect(resultPromise).resolves.toEqual({
      baseAccount,
      latestHeight: '789',
    })
  })
})

// ---------------------------------------------------------------------------
// Event emission order tests
//
// Tests the broadcastWithFeePayerSig path which contains the full event
// lifecycle: PreparationStart → PreparationEnd → BroadcastStart →
// BroadcastSynced (via onBroadcast) → BroadcastEnd.
// ---------------------------------------------------------------------------

describe('MsgBroadcaster event emission order', () => {
  let broadcaster: MsgBroadcaster
  let mockStrategy: BaseWalletStrategy
  let validTxBytes: Uint8Array

  beforeEach(() => {
    mockStrategy = createMockWalletStrategy()
    validTxBytes = makeValidTxRawBytes()

    const options: MsgBroadcasterOptions = {
      network: Network.Devnet,
      walletStrategy: mockStrategy,
    }

    broadcaster = new MsgBroadcaster(options)

    // PrivateKey.fromHex is called early — mock before it's invoked
    vi.spyOn(PrivateKey, 'fromHex').mockReturnValue({
      toHex: () => '0x' + 'ab'.repeat(20),
      sign: vi.fn().mockResolvedValue(new Uint8Array(64)),
      toBech32: vi.fn().mockReturnValue('inj1test'),
      toAddress: vi.fn().mockReturnValue({ address: 'inj1test' }),
    } as any)
  })

  describe('broadcastWithFeePayerSig', () => {
    it('emits events in correct order: Preparation → Broadcast → Synced → End', async () => {
      vi.spyOn(TxGrpcApi.prototype, 'broadcast').mockImplementation(
        async (_txRaw, options) => {
          if (options?.onBroadcast) {
            options.onBroadcast('MOCK_TX_HASH')
          }
          return makeTxResponse('CONFIRMED_TX')
        },
      )

      await broadcaster.broadcastWithFeePayerSig({
        tx: validTxBytes,
        privateKey: '0x' + 'ab'.repeat(32),
        feePayerSig: 'bW9ja1NpZw==',
        accountNumber: 1,
      })

      const emitCalls = (
        mockStrategy.emit as ReturnType<typeof vi.fn>
      ).mock.calls.map((call: any[]) => call[0])

      expect(emitCalls).toEqual([
        WalletStrategyEmitterEventType.TransactionPreparationStart,
        WalletStrategyEmitterEventType.TransactionPreparationEnd,
        WalletStrategyEmitterEventType.TransactionBroadcastStart,
        WalletStrategyEmitterEventType.TransactionBroadcastSynced,
        WalletStrategyEmitterEventType.TransactionBroadcastEnd,
      ])
    })

    it('per-call txTimeoutInBlocks overrides the broadcaster default', async () => {
      broadcaster.txTimeout = 120

      const broadcastSpy = vi
        .spyOn(TxGrpcApi.prototype, 'broadcast')
        .mockResolvedValue(makeTxResponse('TIMEOUT_OVERRIDE'))

      await broadcaster.broadcastWithFeePayerSig({
        tx: validTxBytes,
        privateKey: '0x' + 'ab'.repeat(32),
        feePayerSig: 'bW9ja1NpZw==',
        accountNumber: 1,
        txTimeoutInBlocks: 5,
      })

      expect(broadcastSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ txTimeout: 5 }),
      )
    })

    it('passes configured tx inclusion options to the SDK broadcaster', async () => {
      const broadcastSpy = vi
        .spyOn(TxGrpcApi.prototype, 'broadcast')
        .mockResolvedValue(makeTxResponse('EVENT_INCLUSION'))

      broadcaster = new MsgBroadcaster({
        network: Network.Devnet,
        walletStrategy: mockStrategy,
        endpoints: {
          indexer: 'http://localhost:8888',
          grpc: 'http://localhost:9901',
          rest: 'http://localhost:10337',
          rpc: 'http://localhost:26657',
        },
        txInclusion: {
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          pollingInterval: 100,
        },
      })

      await broadcaster.broadcastWithFeePayerSig({
        tx: validTxBytes,
        privateKey: '0x' + 'ab'.repeat(32),
        feePayerSig: 'bW9ja1NpZw==',
        accountNumber: 1,
      })

      expect(broadcastSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          pollingInterval: 100,
          eventInclusion: expect.objectContaining({
            rpcEndpoint: 'http://localhost:26657',
          }),
        }),
      )
    })

    it('passes per-call tx inclusion options to the SDK broadcaster', async () => {
      const broadcastSpy = vi
        .spyOn(TxGrpcApi.prototype, 'broadcast')
        .mockResolvedValue(makeTxResponse('PER_CALL_INCLUSION'))

      broadcaster = new MsgBroadcaster({
        network: Network.Devnet,
        walletStrategy: mockStrategy,
        endpoints: {
          indexer: 'http://localhost:8888',
          grpc: 'http://localhost:9901',
          rest: 'http://localhost:10337',
          rpc: 'http://localhost:26657',
        },
        txInclusion: {
          inclusionStrategy: TxInclusionStrategy.Poll,
        },
      })

      await broadcaster.broadcastWithFeePayerSig({
        tx: validTxBytes,
        privateKey: '0x' + 'ab'.repeat(32),
        feePayerSig: 'bW9ja1NpZw==',
        accountNumber: 1,
        txInclusion: {
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
        },
      })

      expect(broadcastSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          eventInclusion: expect.objectContaining({
            rpcEndpoint: 'http://localhost:26657',
          }),
        }),
      )
    })

    it('prepares inclusion waiting with the hash computed from final tx bytes', async () => {
      const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
        bodyBytes: new Uint8Array([1]),
        authInfoBytes: new Uint8Array([2]),
        signatures: [new Uint8Array([3])],
      })
      const txHash = TxClient.hash(txRaw)
      const prepareSpy = vi
        .spyOn(TxGrpcApi.prototype, 'prepareTxInclusionWait')
        .mockResolvedValue({
          txHash,
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          close: vi.fn(),
          wait: vi.fn().mockResolvedValue(makeTxResponse(txHash)),
        })

      broadcaster = new MsgBroadcaster({
        network: Network.Devnet,
        walletStrategy: mockStrategy,
        endpoints: {
          indexer: 'http://localhost:8888',
          grpc: 'http://localhost:9901',
          rest: 'http://localhost:10337',
          rpc: 'http://localhost:26657',
        },
        txInclusion: {
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
        },
      })

      await (broadcaster as any).prepareTxInclusionWaiter({
        tx: {},
        timeout: 1000,
        txRawOrSignResponse: txRaw,
      })

      expect(prepareSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          txHash,
          timeout: 1000,
          options: expect.objectContaining({
            inclusionStrategy: TxInclusionStrategy.TendermintEvent,
            eventInclusion: expect.objectContaining({
              rpcEndpoint: 'http://localhost:26657',
            }),
          }),
        }),
      )
    })

    it('emits TransactionFail on broadcast error — no BroadcastEnd', async () => {
      vi.spyOn(TxGrpcApi.prototype, 'broadcast').mockRejectedValue(
        new TransactionException(new Error('node rejected tx')),
      )

      await expect(
        broadcaster.broadcastWithFeePayerSig({
          tx: validTxBytes,
          privateKey: '0x' + 'ab'.repeat(32),
          feePayerSig: 'bW9ja1NpZw==',
          accountNumber: 1,
        }),
      ).rejects.toThrow()

      const emitCalls = (
        mockStrategy.emit as ReturnType<typeof vi.fn>
      ).mock.calls.map((call: any[]) => call[0])

      expect(emitCalls).toContain(
        WalletStrategyEmitterEventType.TransactionFail,
      )
      expect(emitCalls).not.toContain(
        WalletStrategyEmitterEventType.TransactionBroadcastEnd,
      )
    })
  })

  describe('sendTransaction broadcast callback', () => {
    it('uses per-call timeout height when building direct sign transactions', async () => {
      const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
        bodyBytes: new Uint8Array([1]),
        authInfoBytes: new Uint8Array([2]),
        signatures: [new Uint8Array([3])],
      })
      const baseAccount = makeBaseAccount()
      const fetchAccountAndBlockDetails = vi
        .spyOn(broadcaster as any, 'fetchAccountAndBlockDetails')
        .mockResolvedValue({
          baseAccount,
          latestHeight: undefined,
        })
      const getTxWithSignersAndStdFee = vi
        .spyOn(broadcaster as any, 'getTxWithSignersAndStdFee')
        .mockResolvedValue({
          txRaw,
          stdFee: {},
        })

      vi.spyOn(
        broadcaster as any,
        'prepareTxInclusionWaiter',
      ).mockResolvedValue({
        txHash: 'MOCK_TX_HASH',
        inclusionStrategy: TxInclusionStrategy.Poll,
        close: vi.fn(),
        wait: vi.fn().mockResolvedValue(makeTxResponse('MOCK_TX_HASH')),
      })

      await (broadcaster as any).broadcastDirectSign({
        timeoutHeight: '999',
        msgs: makeMessage(),
        ethereumAddress: '0x0000000000000000000000000000000000000001',
        injectiveAddress: 'inj1test',
      })

      expect(fetchAccountAndBlockDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          timeoutHeight: '999',
          address: 'inj1test',
        }),
      )
      expect(getTxWithSignersAndStdFee).toHaveBeenCalledWith(
        expect.objectContaining({ timeoutHeight: 999 }),
      )
    })

    it('emits BroadcastSynced from onBroadcast before waiting for confirmation', async () => {
      const events: string[] = []
      const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
        bodyBytes: new Uint8Array([1]),
        authInfoBytes: new Uint8Array([2]),
        signatures: [new Uint8Array([3])],
      })
      const wait = vi.fn().mockImplementation(async () => {
        events.push('wait:start')

        return makeTxResponse('MOCK_TX_HASH')
      })

      broadcaster = new MsgBroadcaster({
        network: Network.Devnet,
        walletStrategy: mockStrategy,
        endpoints: {
          indexer: 'http://localhost:8888',
          grpc: 'http://localhost:9901',
          rest: 'http://localhost:10337',
          rpc: 'http://localhost:26657',
        },
        txInclusion: {
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          pollingInterval: 100,
        },
      })

      vi.spyOn(
        broadcaster as any,
        'fetchAccountAndBlockDetails',
      ).mockResolvedValue({
        latestHeight: '100',
        baseAccount: {
          accountNumber: 1,
          sequence: 1,
          pubKey: { key: 'mockPubKeyBase64' },
        },
      })
      vi.spyOn(
        broadcaster as any,
        'getTxWithSignersAndStdFee',
      ).mockResolvedValue({
        txRaw,
        stdFee: {},
      })
      vi.spyOn(
        broadcaster as any,
        'prepareTxInclusionWaiter',
      ).mockResolvedValue({
        txHash: 'MOCK_TX_HASH',
        inclusionStrategy: TxInclusionStrategy.TendermintEvent,
        close: vi.fn(),
        wait,
      })
      ;(mockStrategy.emit as ReturnType<typeof vi.fn>).mockImplementation(
        (event: string) => {
          events.push(event)

          return true
        },
      )
      ;(
        mockStrategy.sendTransaction as ReturnType<typeof vi.fn>
      ).mockImplementation(async (_transaction: unknown, options: any) => {
        events.push('sendTransaction:start')
        options.onBroadcast('MOCK_TX_HASH')
        events.push('sendTransaction:end')

        return makeTxResponse('MOCK_TX_HASH')
      })

      await (broadcaster as any).broadcastDirectSign({
        msgs: makeMessage(),
        ethereumAddress: '0x0000000000000000000000000000000000000001',
        injectiveAddress: 'inj1test',
      })

      const syncedEvents = events.filter(
        (event) =>
          event === WalletStrategyEmitterEventType.TransactionBroadcastSynced,
      )
      const syncedIndex = events.indexOf(
        WalletStrategyEmitterEventType.TransactionBroadcastSynced,
      )

      expect(syncedEvents).toHaveLength(1)
      expect(syncedIndex).toBeGreaterThan(
        events.indexOf('sendTransaction:start'),
      )
      expect(syncedIndex).toBeLessThan(events.indexOf('wait:start'))
      expect(mockStrategy.sendTransaction).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          onBroadcast: expect.any(Function),
          txInclusion: expect.objectContaining({
            inclusionStrategy: TxInclusionStrategy.TendermintEvent,
            pollingInterval: 100,
            eventInclusion: expect.objectContaining({
              rpcEndpoint: 'http://localhost:26657',
            }),
          }),
        }),
      )
    })
  })
})

describe('MsgBroadcaster direct sign fee delegation', () => {
  let broadcaster: MsgBroadcaster
  let mockStrategy: BaseWalletStrategy
  let disableGasCheck: ReturnType<typeof vi.fn>
  let enableGasCheck: ReturnType<typeof vi.fn>

  beforeEach(() => {
    disableGasCheck = vi.fn()
    enableGasCheck = vi.fn()
    mockStrategy = createMockWalletStrategy()
    ;(mockStrategy.getCosmosWallet as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        disableGasCheck,
        enableGasCheck,
      },
    )

    broadcaster = new MsgBroadcaster({
      network: Network.Devnet,
      walletStrategy: mockStrategy,
      endpoints: {
        indexer: 'http://localhost:8888',
        grpc: 'http://localhost:9901',
        rest: 'http://localhost:10337',
        rpc: 'http://localhost:26657',
      },
    })

    vi.spyOn(PublicKey, 'fromBase64').mockReturnValue({
      toAddress: () => ({ address: 'inj1feepayer' }),
      toBase64: () => 'mockFeePayerPubKeyBase64',
    } as any)
    vi.spyOn(ChainGrpcAuthApi.prototype, 'fetchAccount').mockResolvedValue({
      baseAccount: {
        accountNumber: 2,
        sequence: 3,
      },
    } as any)
    vi.spyOn(
      IndexerGrpcWeb3GwApi.prototype,
      'broadcastCosmosTxRequest',
    ).mockResolvedValue({ txHash: 'MOCK_TX_HASH' } as any)
    vi.spyOn(broadcaster as any, 'fetchFeePayerPubKey').mockResolvedValue(
      'mockFeePayerPubKeyBase64',
    )
    vi.spyOn(
      broadcaster as any,
      'fetchAccountAndBlockDetails',
    ).mockResolvedValue({
      latestHeight: '100',
      baseAccount: {
        accountNumber: 1,
        sequence: 1,
        pubKey: { key: 'mockPubKeyBase64' },
      },
    })
    vi.spyOn(broadcaster as any, 'getTxWithSignersAndStdFee').mockResolvedValue(
      {
        txRaw: CosmosTxV1Beta1TxPb.TxRaw.create({
          bodyBytes: new Uint8Array(),
          authInfoBytes: new Uint8Array(),
          signatures: [],
        }),
        stdFee: {},
      },
    )
    vi.spyOn(broadcaster as any, 'prepareTxInclusionWaiter').mockResolvedValue({
      txHash: 'MOCK_TX_HASH',
      inclusionStrategy: TxInclusionStrategy.Poll,
      close: vi.fn(),
      wait: vi.fn(),
    })
    vi.spyOn(
      broadcaster as any,
      'waitForPreparedTxInclusion',
    ).mockResolvedValue(makeTxResponse('MOCK_TX_HASH'))
  })

  it('direct signs PrivateKeyCosmos fee delegation through its Cosmos wallet adapter', async () => {
    Object.assign(mockStrategy, {
      wallet: Wallet.PrivateKeyCosmos,
      getWallet: vi.fn().mockReturnValue(Wallet.PrivateKeyCosmos),
    })

    await (broadcaster as any).broadcastDirectSignWithFeeDelegation({
      gas: { gas: 100000 },
      msgs: makeMessage(),
      ethereumAddress: '0x0000000000000000000000000000000000000001',
      injectiveAddress: 'inj1test',
    })

    expect(mockStrategy.getCosmosWallet).toHaveBeenCalledWith('injective-777')
    expect(mockStrategy.signCosmosTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        address: 'inj1test',
        accountNumber: 1,
      }),
    )
  })

  it('keeps Cosmos wallet adapter access for Keplr gas-check toggling', async () => {
    await (broadcaster as any).broadcastDirectSignWithFeeDelegation({
      gas: { gas: 100000 },
      msgs: makeMessage(),
      ethereumAddress: '0x0000000000000000000000000000000000000001',
      injectiveAddress: 'inj1test',
    })

    expect(mockStrategy.getCosmosWallet).toHaveBeenCalledWith('injective-777')
    expect(disableGasCheck).toHaveBeenCalledWith('injective-777')
    expect(enableGasCheck).toHaveBeenCalledWith('injective-777')
  })
})
