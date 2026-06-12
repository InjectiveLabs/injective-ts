import { vi } from 'vitest'
import { Wallet } from '@injectivelabs/wallet-base'
import {
  waitTxBroadcasted,
  CosmosTxV1Beta1TxPb,
} from '@injectivelabs/sdk-ts/core/tx'
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
