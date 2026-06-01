import { vi } from 'vitest'
import { Network } from '@injectivelabs/networks'
import { TransactionException } from '@injectivelabs/exceptions'
import { PrivateKey } from '@injectivelabs/sdk-ts/core/accounts'
import { WalletStrategyEmitterEventType } from '@injectivelabs/wallet-base'
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

const createMockWalletStrategy = () =>
  ({
    wallet: 'keplr',
    getWallet: vi.fn().mockReturnValue('keplr'),
    getWalletDeviceType: vi.fn().mockResolvedValue('browser'),
    getPubKey: vi.fn().mockResolvedValue('mockPubKeyBase64'),
    getEthereumChainId: vi.fn().mockResolvedValue(undefined),
    signCosmosTransaction: vi.fn().mockResolvedValue({
      signed: {
        bodyBytes: new Uint8Array(),
        authInfoBytes: new Uint8Array(),
      },
      signature: {
        signature: 'bW9ja1NpZw==',
        pub_key: { value: 'mockPubKeyBase64', type: 'ed25519' },
      },
    }),
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
        txHash,
        1000,
        expect.objectContaining({
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          eventInclusion: expect.objectContaining({
            rpcEndpoint: 'http://localhost:26657',
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
})
