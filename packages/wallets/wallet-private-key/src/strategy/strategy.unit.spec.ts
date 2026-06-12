import { vi } from 'vitest'
import {
  TxGrpcApi,
  TxInclusionStrategy,
  CosmosTxV1Beta1TxPb,
} from '@injectivelabs/sdk-ts/core/tx'
import { PrivateKeyWallet } from './strategy.js'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'

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

describe('PrivateKeyWallet.sendTransaction', () => {
  it('forwards broadcast lifecycle options to TxGrpcApi.broadcast', async () => {
    const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
      bodyBytes: new Uint8Array([1]),
      authInfoBytes: new Uint8Array([2]),
      signatures: [new Uint8Array([3])],
    })
    const onBroadcast = vi.fn()
    const broadcastSpy = vi
      .spyOn(TxGrpcApi.prototype, 'broadcast')
      .mockResolvedValue(makeTxResponse('TX_GRPC_HASH'))
    const wallet = new PrivateKeyWallet({ chainId: 'injective-1' as any })

    await wallet.sendTransaction(txRaw, {
      onBroadcast,
      txTimeout: 7,
      address: 'inj1test',
      chainId: 'injective-1' as any,
      txInclusion: {
        inclusionStrategy: TxInclusionStrategy.TendermintEvent,
      },
      endpoints: {
        grpc: 'http://localhost:9901',
        rest: 'http://localhost:10337',
      },
    })

    expect(broadcastSpy).toHaveBeenCalledWith(
      txRaw,
      expect.objectContaining({
        txTimeout: 7,
        onBroadcast,
        inclusionStrategy: TxInclusionStrategy.TendermintEvent,
      }),
    )
  })
})
