import { it, vi, expect, describe, afterEach } from 'vitest'
import { TxGrpcApi, CosmosTxV1Beta1TxPb } from '@injectivelabs/sdk-ts/core/tx'
import {
  WalletException,
  TransactionException,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import {
  broadcastTxRaw,
  broadcastTxRawAsTransactionException,
} from './broadcast.js'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type { BroadcastTxRawOptions } from './broadcast.js'

const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
  signatures: [new Uint8Array([1])],
})
const options = (broadcastGrpc?: string): BroadcastTxRawOptions => ({
  txTimeout: 7,
  txInclusion: { pollingInterval: 100 },
  onBroadcast: vi.fn(),
  endpoints: {
    grpc: 'https://query.example.test',
    rest: 'https://lcd.example.test',
    broadcastGrpc,
  },
})

afterEach(() => vi.restoreAllMocks())

describe('broadcastTxRaw', () => {
  it.each([undefined, 'https://broadcast.example.test'])(
    'forwards the optional broadcast endpoint %s with lifecycle options',
    async (broadcastGrpc) => {
      const response = { txHash: 'confirmed', code: 0 } as TxResponse
      const broadcast = vi
        .spyOn(TxGrpcApi.prototype, 'broadcast')
        .mockImplementation(async function () {
          expect(this['endpoint']).toBe('https://query.example.test')

          return response
        })
      const opts = options(broadcastGrpc)

      expect(await broadcastTxRaw(txRaw, opts)).toBe(response)
      expect(broadcast).toHaveBeenCalledWith(txRaw, {
        broadcastEndpoint: broadcastGrpc,
        txTimeout: 7,
        pollingInterval: 100,
        onBroadcast: opts.onBroadcast,
      })
    },
  )

  it('requires endpoints', async () => {
    await expect(broadcastTxRaw(txRaw, {})).rejects.toBeInstanceOf(
      WalletException,
    )
  })

  it('throws a TransactionException for a non-zero code', async () => {
    vi.spyOn(TxGrpcApi.prototype, 'broadcast').mockResolvedValue({
      code: 5,
      rawLog: 'failed',
      codespace: 'sdk',
    } as TxResponse)

    await expect(broadcastTxRaw(txRaw, options())).rejects.toMatchObject({
      contextCode: 5,
      contextModule: 'sdk',
    })
  })
})

describe('broadcastTxRawAsTransactionException', () => {
  it('wraps transport failures and keeps cancellation untouched', async () => {
    const broadcast = vi.spyOn(TxGrpcApi.prototype, 'broadcast')

    broadcast.mockRejectedValueOnce(
      new GrpcUnaryRequestException(new Error('unavailable')),
    )
    await expect(
      broadcastTxRawAsTransactionException(txRaw, options()),
    ).rejects.toBeInstanceOf(TransactionException)

    const abort = Object.assign(new Error('stop'), { name: 'AbortError' })

    broadcast.mockRejectedValueOnce(abort)
    await expect(
      broadcastTxRawAsTransactionException(txRaw, options()),
    ).rejects.toBe(abort)
  })
})
