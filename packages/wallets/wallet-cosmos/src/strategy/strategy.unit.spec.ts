import { vi } from 'vitest'
import { Wallet } from '@injectivelabs/wallet-base'
import { AbortError, isAbortError } from '@injectivelabs/utils'
import {
  TransactionException,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import {
  waitTxBroadcasted,
  CosmosTxV1Beta1TxPb,
  TxObservationAbortError,
} from '@injectivelabs/sdk-ts/core/tx'
import { CosmosWallet } from '../wallet.js'
import { CosmosWalletStrategy } from './strategy.js'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'

vi.mock('@injectivelabs/sdk-ts/core/tx', async () => {
  const actual = await vi.importActual<
    typeof import('@injectivelabs/sdk-ts/core/tx')
  >('@injectivelabs/sdk-ts/core/tx')

  return {
    ...actual,
    waitTxBroadcasted: vi.fn(),
  }
})

const makeTxResponse = (txHash: string): TxResponse =>
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
    logs: [],
  }) as TxResponse

describe('CosmosWalletStrategy.sendTransaction', () => {
  describe.each(['strategy', 'sync', 'block'] as const)(
    'real provider through %s',
    (entry) => {
      const send = () => {
        const args = { wallet: Wallet.Keplr, chainId: 'injective-1' as any }
        const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create()
        if (entry !== 'strategy') {
          const wallet = new CosmosWallet(args)
          return entry === 'sync'
            ? wallet.broadcastTx(txRaw)
            : wallet.broadcastTxBlock(txRaw)
        }
        return new CosmosWalletStrategy(args).sendTransaction(txRaw, {
          address: 'inj1test',
          chainId: args.chainId,
          endpoints: {
            grpc: 'http://unused.invalid',
            rest: 'http://unused.invalid',
          },
        })
      }

      it.each(
        ['enable', 'sendTx'].flatMap((phase) =>
          ['SDK', 'native'].map((shape) => ({ phase, shape })),
        ),
      )(
        'preserves $shape cancellation from $phase',
        async ({ phase, shape }) => {
          const cancellation =
            shape === 'SDK'
              ? new AbortError({ source: phase })
              : new DOMException('cancelled', 'AbortError')
          const provider = {
            enable: vi.fn().mockResolvedValue(undefined),
            sendTx: vi.fn().mockResolvedValue(new Uint8Array(32)),
          }
          provider[phase as 'enable' | 'sendTx'].mockRejectedValue(cancellation)
          vi.stubGlobal('window', { keplr: provider })
          const error = await send().catch((e: unknown) => e)
          expect(error).toBe(cancellation)
          expect(error).not.toHaveProperty('txHash')
          expect(waitTxBroadcasted).not.toHaveBeenCalled()
          if (phase === 'enable') expect(provider.sendTx).not.toHaveBeenCalled()
          else expect(provider.sendTx).toHaveBeenCalledOnce()
        },
      )

      it('keeps ordinary provider failures as wallet/transaction failures', async () => {
        vi.stubGlobal('window', {
          keplr: {
            enable: vi.fn().mockResolvedValue(undefined),
            sendTx: vi.fn().mockRejectedValue(new Error('provider failed')),
          },
        })
        const error = await send().catch((e: unknown) => e)
        expect(error).toBeInstanceOf(
          entry === 'strategy' ? TransactionException : CosmosWalletException,
        )
        expect(isAbortError(error)).toBe(false)
        expect(waitTxBroadcasted).not.toHaveBeenCalled()
      })
    },
  )

  it.each(['provider', 'observation', 'decorated', 'onBroadcast'] as const)(
    'preserves cancellation from %s with a hash only after submission',
    async (phase) => {
      const txHash = 'PROVIDER_HASH'
      const reason = { source: phase }
      const cancellation =
        phase === 'decorated'
          ? new TxObservationAbortError(txHash, reason)
          : new AbortError(reason)
      const strategy = new CosmosWalletStrategy({
        wallet: Wallet.Keplr,
        chainId: 'injective-1' as any,
      })
      const broadcast = vi.fn()
      if (phase === 'provider') broadcast.mockRejectedValue(cancellation)
      else broadcast.mockResolvedValue(txHash)
      vi.spyOn(strategy as any, 'getCurrentCosmosWallet').mockReturnValue({
        broadcastTx: broadcast,
      })
      vi.mocked(waitTxBroadcasted).mockRejectedValue(cancellation)
      const error = await strategy
        .sendTransaction(CosmosTxV1Beta1TxPb.TxRaw.create(), {
          address: 'inj1test',
          chainId: 'injective-1' as any,
          onBroadcast:
            phase === 'onBroadcast'
              ? () => {
                  throw cancellation
                }
              : undefined,
          endpoints: {
            grpc: 'http://unused.invalid',
            rest: 'http://unused.invalid',
          },
        })
        .catch((e: unknown) => e)
      expect(isAbortError(error)).toBe(true)
      expect(error).toMatchObject({ reason, code: 'ERR_CANCELED' })
      if (phase === 'provider') {
        expect(error).toBe(cancellation)
        expect(error).not.toHaveProperty('txHash')
        expect(waitTxBroadcasted).not.toHaveBeenCalled()
      } else {
        expect(error).toBeInstanceOf(TxObservationAbortError)
        expect(error).toMatchObject({ txHash })
        if (phase === 'decorated') expect(error).toBe(cancellation)
        if (phase === 'onBroadcast')
          expect(waitTxBroadcasted).not.toHaveBeenCalled()
      }
    },
  )

  it('fires onBroadcast after provider broadcast and before confirmation wait', async () => {
    const events: string[] = []
    const txHash = 'PROVIDER_HASH'
    const txInclusion = { pollingInterval: 100 }
    const strategy = new CosmosWalletStrategy({
      wallet: Wallet.Keplr,
      chainId: 'injective-1' as any,
    })
    const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
      bodyBytes: new Uint8Array([1]),
      authInfoBytes: new Uint8Array([2]),
      signatures: [new Uint8Array([3])],
    })
    const onBroadcast = vi.fn((broadcastTxHash: string) => {
      events.push(`onBroadcast:${broadcastTxHash}`)
    })

    vi.spyOn(strategy as any, 'getCurrentCosmosWallet').mockReturnValue({
      broadcastTx: vi.fn().mockImplementation(async () => {
        events.push('provider:broadcast')

        return txHash
      }),
    })
    vi.mocked(waitTxBroadcasted).mockImplementation(async () => {
      events.push('wait:start')

      return makeTxResponse(txHash)
    })

    await strategy.sendTransaction(txRaw, {
      onBroadcast,
      txInclusion,
      txTimeout: 10,
      address: 'inj1test',
      chainId: 'injective-1' as any,
      endpoints: {
        grpc: 'http://localhost:9901',
        rest: 'http://localhost:10337',
      },
    })

    expect(events).toEqual([
      'provider:broadcast',
      'onBroadcast:PROVIDER_HASH',
      'wait:start',
    ])
    expect(waitTxBroadcasted).toHaveBeenCalledWith(
      txHash,
      expect.objectContaining({
        onBroadcast,
        txInclusion,
      }),
    )
  })
})
