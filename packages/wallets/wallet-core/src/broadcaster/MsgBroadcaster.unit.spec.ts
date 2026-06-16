import { vi } from 'vitest'
import { Network } from '@injectivelabs/networks'
import { TransactionException } from '@injectivelabs/exceptions'
import { ChainGrpcAuthApi } from '@injectivelabs/sdk-ts/client/chain'
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

  it('direct signs PrivateKeyCosmos fee delegation without reading a Cosmos wallet adapter', async () => {
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

    expect(mockStrategy.getCosmosWallet).not.toHaveBeenCalled()
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

    expect(mockStrategy.getCosmosWallet).toHaveBeenCalledWith('injective-888')
    expect(disableGasCheck).toHaveBeenCalledWith('injective-888')
    expect(enableGasCheck).toHaveBeenCalledWith('injective-888')
  })
})
