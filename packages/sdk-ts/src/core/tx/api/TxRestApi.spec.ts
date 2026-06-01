import {
  TransactionException,
  HttpRequestException,
} from '@injectivelabs/exceptions'
import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import { TxRestApi } from './TxRestApi.js'
import { TxInclusionStrategy } from '../types/tx.js'
import { TxClient } from '../utils/classes/TxClient.js'
import { BroadcastMode } from '../types/tx-rest-client.js'
import type { TxResponse } from '../types/tx.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeTxResponse = (txHash = 'ABC123'): TxResponse =>
  ({
    txHash,
    height: 1,
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
    tx: undefined,
  }) as unknown as TxResponse

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms))

class FakeWebSocket extends EventTarget {
  public readyState = 0
  public subscriptionReady = false

  constructor() {
    super()
    queueMicrotask(() => {
      this.readyState = 1
      this.dispatchEvent(new Event('open'))
    })
  }

  send(data: string) {
    const request = JSON.parse(data)
    queueMicrotask(() => {
      this.subscriptionReady = true
      this.dispatchEvent(
        new MessageEvent('message', {
          data: JSON.stringify({
            id: request.id,
            jsonrpc: '2.0',
            result: {},
          }),
        }),
      )
    })
  }

  close() {
    this.readyState = 3
  }

  emitTx(txHash: string) {
    this.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          jsonrpc: '2.0',
          params: {
            result: {
              data: {
                events: {
                  'tx.hash': [txHash],
                },
                value: {
                  TxResult: {
                    height: '123',
                    result: {
                      code: 0,
                      log: '',
                    },
                  },
                },
              },
            },
          },
        }),
      }),
    )
  }
}

const makeTxRaw = () =>
  CosmosTxV1Beta1TxPb.TxRaw.create({
    bodyBytes: new Uint8Array([1]),
    authInfoBytes: new Uint8Array([2]),
    signatures: [new Uint8Array([3])],
  })

// ---------------------------------------------------------------------------
// fetchTxPoll unit tests
// ---------------------------------------------------------------------------

describe('TxRestApi.fetchTxPoll', () => {
  let txApi: TxRestApi

  beforeEach(() => {
    txApi = new TxRestApi('https://lcd.injective.network')
  })

  it('returns TxResponse immediately when tx is found on the first poll', async () => {
    const txResponse = makeTxResponse('FOUND_FAST')
    vi.spyOn(txApi, 'fetchTx').mockResolvedValue(txResponse)

    const result = await txApi.fetchTxPoll('FOUND_FAST', 5000)
    expect(result.txHash).toBe('FOUND_FAST')
  })

  it('returns TxResponse when tx is found on a subsequent poll', async () => {
    const txResponse = makeTxResponse('FOUND_SLOW')
    let callCount = 0

    vi.spyOn(txApi, 'fetchTx').mockImplementation(async () => {
      callCount += 1
      if (callCount < 3) {
        throw new HttpRequestException(new Error('not found'), {
          context: 'TxRestApi',
          contextModule: 'fetch-tx',
        })
      }
      return txResponse
    })

    const result = await txApi.fetchTxPoll('FOUND_SLOW', 10000)
    expect(result.txHash).toBe('FOUND_SLOW')
  })

  it('throws HttpRequestException (timeout) when tx is never included — deadline is respected', async () => {
    vi.spyOn(txApi, 'fetchTx').mockRejectedValue(
      new HttpRequestException(new Error('not found'), {
        context: 'TxRestApi',
        contextModule: 'fetch-tx',
      }),
    )

    const timeout = 1500
    const start = Date.now()
    await expect(txApi.fetchTxPoll('NEVER_FOUND', timeout)).rejects.toThrow(
      HttpRequestException,
    )
    const elapsed = Date.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(timeout - 100)
    expect(elapsed).toBeLessThan(timeout + 500)
  })

  it('surfaces TransactionException immediately', async () => {
    const txError = new TransactionException(new Error('execution reverted'), {
      contextCode: 5,
      contextModule: 'sdk',
    })

    vi.spyOn(txApi, 'fetchTx').mockRejectedValue(txError)

    await expect(txApi.fetchTxPoll('FAIL_TX', 5000)).rejects.toThrow(
      TransactionException,
    )
  })

  // Validates the Promise.race guard added in Step 2 — a hung REST call
  // can no longer overshoot the deadline by the full HTTP timeout (15 s).
  it('does not overshoot the deadline by more than a small tolerance when REST call is slow', async () => {
    vi.spyOn(txApi, 'fetchTx').mockImplementation(async () => {
      await delay(60000) // effectively infinite
      throw new HttpRequestException(new Error('hung'), {
        context: 'TxRestApi',
        contextModule: 'fetch-tx',
      })
    })

    const timeout = 2000
    const start = Date.now()
    await expect(txApi.fetchTxPoll('HUNG_NODE', timeout)).rejects.toThrow(
      HttpRequestException,
    )
    const elapsed = Date.now() - start

    // Without the fix the loop overshoots by up to the HTTP timeout (15 000 ms).
    // With the fix the overshoot is bounded to a small scheduling tolerance.
    expect(elapsed).toBeLessThan(timeout + 600)
  })
})

describe('TxRestApi.broadcast event inclusion', () => {
  let txApi: TxRestApi

  beforeEach(() => {
    txApi = new TxRestApi('https://lcd.injective.network')
  })

  it('subscribes before async broadcast and resolves inclusion from the tx event', async () => {
    const txRaw = makeTxRaw()
    const txHash = TxClient.hash(txRaw)
    const socket = new FakeWebSocket()
    const txResponse = makeTxResponse(txHash)
    const fetchTxPoll = vi.spyOn(txApi, 'fetchTxPoll')
    const fetchTx = vi.spyOn(txApi, 'fetchTx').mockResolvedValue(txResponse)

    vi.spyOn(txApi as any, 'broadcastTx').mockImplementation(
      async (_txRaw, mode) => {
        expect(socket.subscriptionReady).toBe(true)
        expect(mode).toBe(BroadcastMode.Async)

        queueMicrotask(() => {
          socket.emitTx(txHash)
        })

        return {
          tx_response: {
            txhash: txHash,
            code: 0,
            raw_log: '',
            codespace: '',
            height: '0',
            gas_wanted: '0',
            gas_used: '0',
          },
        }
      },
    )

    const result = await txApi.broadcast(txRaw, {
      inclusionStrategy: TxInclusionStrategy.TendermintEvent,
      eventInclusion: {
        rpcEndpoint: 'http://localhost:26657',
        webSocketFactory: () => socket as unknown as WebSocket,
      },
    })

    expect(result.txHash).toBe(txHash)
    expect(fetchTx).toHaveBeenCalledWith(txHash)
    expect(fetchTxPoll).not.toHaveBeenCalled()
  })

  it('returns polling result first when dual inclusion polling wins', async () => {
    const txRaw = makeTxRaw()
    const txHash = TxClient.hash(txRaw)
    const socket = new FakeWebSocket()
    const txResponse = makeTxResponse(txHash)
    const fetchTx = vi.spyOn(txApi, 'fetchTx')
    const fetchTxPoll = vi
      .spyOn(txApi, 'fetchTxPoll')
      .mockResolvedValue(txResponse)

    vi.spyOn(txApi as any, 'broadcastTx').mockImplementation(
      async (_txRaw, mode) => {
        expect(socket.subscriptionReady).toBe(true)
        expect(mode).toBe(BroadcastMode.Async)

        return {
          tx_response: {
            txhash: txHash,
            code: 0,
            raw_log: '',
            codespace: '',
            height: '0',
            gas_wanted: '0',
            gas_used: '0',
          },
        }
      },
    )

    const result = await txApi.broadcast(txRaw, {
      inclusionStrategy: TxInclusionStrategy.TendermintEventAndPoll,
      eventInclusion: {
        rpcEndpoint: 'http://localhost:26657',
        webSocketFactory: () => socket as unknown as WebSocket,
      },
    })

    expect(result.txHash).toBe(txHash)
    expect(fetchTxPoll).toHaveBeenCalledWith(
      txHash,
      expect.any(Number),
      expect.any(Object),
    )
    expect(fetchTx).not.toHaveBeenCalled()
    expect(socket.readyState).toBe(3)
  })

  it('falls back to sync polling when event inclusion has no rpc endpoint', async () => {
    const txRaw = makeTxRaw()
    const txHash = TxClient.hash(txRaw)
    const onFallback = vi.fn()
    const txResponse = makeTxResponse(txHash)

    vi.spyOn(txApi as any, 'broadcastTx').mockImplementation(
      async (_txRaw, mode) => {
        expect(mode).toBe(BroadcastMode.Sync)

        return {
          tx_response: {
            txhash: txHash,
            code: 0,
            raw_log: '',
            codespace: '',
            height: '0',
            gas_wanted: '0',
            gas_used: '0',
          },
        }
      },
    )

    vi.spyOn(txApi, 'fetchTxPoll').mockResolvedValue(txResponse)

    const result = await txApi.broadcast(txRaw, {
      inclusionStrategy: TxInclusionStrategy.TendermintEvent,
      eventInclusion: { onFallback },
    })

    expect(result.txHash).toBe(txHash)
    expect(onFallback).toHaveBeenCalledOnce()
  })
})
