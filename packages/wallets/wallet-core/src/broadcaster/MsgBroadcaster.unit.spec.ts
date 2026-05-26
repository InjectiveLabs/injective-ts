import { vi } from 'vitest'
import { Network } from '@injectivelabs/networks'
import { TransactionException } from '@injectivelabs/exceptions'
import { PrivateKey } from '@injectivelabs/sdk-ts/core/accounts'
import { WalletStrategyEmitterEventType } from '@injectivelabs/wallet-base'
import { TxGrpcApi, CosmosTxV1Beta1TxPb } from '@injectivelabs/sdk-ts/core/tx'
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
