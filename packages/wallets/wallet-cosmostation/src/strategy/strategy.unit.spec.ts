import { it, vi, expect, describe, afterEach } from 'vitest'
import { TxGrpcApi, CosmosTxV1Beta1TxPb } from '@injectivelabs/sdk-ts/core/tx'
import { Cosmostation } from './strategy.js'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'

const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
  signatures: [new Uint8Array([1])],
})

afterEach(() => vi.restoreAllMocks())

describe('Cosmostation.sendTransaction', () => {
  it('submits through the broadcast override instead of the extension', async () => {
    const strategy = new Cosmostation({ chainId: 'injective-1' as any })
    const provider = vi.spyOn(strategy as any, 'getProvider')
    const response = { txHash: 'confirmed', code: 0 } as TxResponse
    const broadcast = vi
      .spyOn(TxGrpcApi.prototype, 'broadcast')
      .mockResolvedValue(response)
    const onBroadcast = vi.fn()

    expect(
      await strategy.sendTransaction(txRaw, {
        address: 'inj1test',
        chainId: 'injective-1' as any,
        txTimeout: 7,
        onBroadcast,
        endpoints: {
          grpc: 'https://query.example.test',
          rest: 'https://lcd.example.test',
          broadcastGrpc: 'https://broadcast.example.test',
        },
      }),
    ).toBe(response)
    expect(provider).not.toHaveBeenCalled()
    expect(broadcast).toHaveBeenCalledWith(txRaw, {
      broadcastEndpoint: 'https://broadcast.example.test',
      txTimeout: 7,
      onBroadcast,
    })
  })

  it('uses the extension when no override is set', async () => {
    const strategy = new Cosmostation({ chainId: 'injective-1' as any })
    const request = vi.fn().mockResolvedValue({
      tx_response: { code: 0, txhash: 'EXT_HASH' },
    })

    vi.spyOn(strategy as any, 'getProvider').mockReturnValue({ request })
    const broadcast = vi.spyOn(TxGrpcApi.prototype, 'broadcast')

    const result = await strategy.sendTransaction(txRaw, {
      address: 'inj1test',
      chainId: 'injective-1' as any,
      endpoints: {
        grpc: 'https://query.example.test',
        rest: 'https://lcd.example.test',
      },
    })

    expect(result.txHash).toBe('EXT_HASH')
    expect(request).toHaveBeenCalledOnce()
    expect(broadcast).not.toHaveBeenCalled()
  })
})
