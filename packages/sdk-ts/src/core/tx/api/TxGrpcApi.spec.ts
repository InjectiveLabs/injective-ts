import {
  TransactionException,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import * as CosmosTxV1Beta1ServicePb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/service_pb'
import { TxGrpcApi } from './TxGrpcApi.js'
import { TxInclusionStrategy } from '../types/tx.js'
import { TxClient } from '../utils/classes/TxClient.js'
import type { TxResponse } from '../types/tx.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a minimal TxResponse stub */
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

/** Delays for `ms` milliseconds */
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

describe('TxGrpcApi V2 Migration', () => {
  let txApi: TxGrpcApi
  const endpoint = 'https://sentry.tm.injective.network:443'

  beforeEach(() => {
    txApi = new TxGrpcApi(endpoint)
  })

  describe('constructor', () => {
    it('should initialize with endpoint', () => {
      expect(txApi).toBeDefined()
      expect(txApi['endpoint']).toBe(endpoint)
      expect(txApi['client']).toBeDefined()
    })
  })

  describe('setMetadata', () => {
    it('should set metadata correctly', () => {
      const metadata = { 'x-api-key': 'test-key' }
      txApi.setMetadata(metadata)
      expect(txApi['metadata']).toEqual(metadata)
    })
  })

  describe('clearMetadata', () => {
    it('should clear metadata', () => {
      txApi.setMetadata({ 'x-api-key': 'test-key' })
      txApi.clearMetadata()
      expect(txApi['metadata']).toBeUndefined()
    })
  })

  describe('fetchTx', () => {
    it('should handle invalid transaction hash', async () => {
      const txHash = 'INVALID_HASH'
      await expect(txApi.fetchTx(txHash)).rejects.toThrow()
    })
  })

  describe('simulate', () => {
    it('should handle simulation with invalid tx', async () => {
      const mockTxRaw = {
        bodyBytes: new Uint8Array(),
        authInfoBytes: new Uint8Array(),
        signatures: [],
      }

      // This should throw an error due to invalid transaction format
      await expect(txApi.simulate(mockTxRaw as any)).rejects.toThrow()
    })
  })

  describe('broadcast', () => {
    it('should handle broadcasting with invalid tx', async () => {
      const mockTxRaw = {
        bodyBytes: new Uint8Array(),
        authInfoBytes: new Uint8Array(),
        signatures: [new Uint8Array()],
      }

      // This should throw an error due to invalid transaction format
      await expect(txApi.broadcast(mockTxRaw as any)).rejects.toThrow()
    })
  })

  describe('broadcastBlock', () => {
    it('should handle block broadcasting with invalid tx', async () => {
      const mockTxRaw = {
        bodyBytes: new Uint8Array(),
        authInfoBytes: new Uint8Array(),
        signatures: [new Uint8Array()],
      }

      // This should throw an error due to invalid transaction format
      await expect(txApi.broadcastBlock(mockTxRaw as any)).rejects.toThrow()
    })
  })
})

// ---------------------------------------------------------------------------
// fetchTxPoll unit tests
// ---------------------------------------------------------------------------

describe('TxGrpcApi.fetchTxPoll', () => {
  let txApi: TxGrpcApi

  beforeEach(() => {
    txApi = new TxGrpcApi('https://sentry.tm.injective.network:443')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns TxResponse immediately when tx is found on the first poll', async () => {
    const txResponse = makeTxResponse('FOUND_FAST')
    vi.spyOn(txApi as any, 'fetchTx').mockResolvedValue(txResponse)

    const result = await txApi.fetchTxPoll({
      txHash: 'FOUND_FAST',
      timeout: 5000,
    })
    expect(result.txHash).toBe('FOUND_FAST')
  })

  it('returns TxResponse when tx is found on a subsequent poll', async () => {
    const txResponse = makeTxResponse('FOUND_SLOW')
    let callCount = 0

    vi.spyOn(txApi as any, 'fetchTx').mockImplementation(async () => {
      callCount += 1
      if (callCount < 3) {
        // First two calls: tx not found yet
        throw new GrpcUnaryRequestException(new Error('not found'), {
          context: 'TxGrpcApi',
          contextModule: 'fetch-tx',
        })
      }
      return txResponse
    })

    const result = await txApi.fetchTxPoll({
      txHash: 'FOUND_SLOW',
      timeout: 10000,
    })
    expect(result.txHash).toBe('FOUND_SLOW')
  })

  it('throws GrpcUnaryRequestException (timeout) when tx is never included — deadline is respected', async () => {
    // fetchTx is always fast but tx is never found
    vi.spyOn(txApi as any, 'fetchTx').mockRejectedValue(
      new GrpcUnaryRequestException(new Error('not found'), {
        context: 'TxGrpcApi',
        contextModule: 'fetch-tx',
      }),
    )

    const timeout = 1500
    const start = Date.now()
    await expect(
      txApi.fetchTxPoll({ txHash: 'NEVER_FOUND', timeout }),
    ).rejects.toThrow(GrpcUnaryRequestException)
    const elapsed = Date.now() - start

    // Should throw close to the deadline — allow 500 ms tolerance for CI
    expect(elapsed).toBeGreaterThanOrEqual(timeout - 100)
    expect(elapsed).toBeLessThan(timeout + 500)
  })

  it('timeout error message contains the timeout value', async () => {
    vi.spyOn(txApi as any, 'fetchTx').mockRejectedValue(
      new GrpcUnaryRequestException(new Error('not found'), {
        context: 'TxGrpcApi',
        contextModule: 'fetch-tx',
      }),
    )

    await expect(
      txApi.fetchTxPoll({ txHash: 'NEVER_FOUND', timeout: 1000 }),
    ).rejects.toThrow(/1000ms/)
  })

  // Bug 2 regression: the polling loop must not overshoot the deadline by a
  // full CALL_TIMEOUT (3 000 ms) when gRPC is slow.
  it('[Bug 2] does not overshoot the deadline by more than a small tolerance when gRPC is slow', async () => {
    vi.useFakeTimers()

    vi.spyOn(txApi as any, 'fetchTx').mockImplementation(async () => {
      await delay(60000) // effectively infinite
      throw new GrpcUnaryRequestException(new Error('hung'), {
        context: 'TxGrpcApi',
        contextModule: 'fetch-tx',
      })
    })

    const timeout = 2000
    const start = Date.now()

    const promise = txApi.fetchTxPoll({ txHash: 'HUNG_NODE', timeout })
    const assertion = expect(promise).rejects.toThrow(GrpcUnaryRequestException)

    await vi.advanceTimersByTimeAsync(timeout + 100)
    await assertion

    const elapsed = Date.now() - start
    expect(elapsed).toBeLessThan(timeout + 600)
  })
})

// ---------------------------------------------------------------------------
// broadcast event ordering tests
// ---------------------------------------------------------------------------

describe('TxGrpcApi.broadcast event ordering', () => {
  let txApi: TxGrpcApi

  beforeEach(() => {
    txApi = new TxGrpcApi('https://sentry.tm.injective.network:443')
  })

  it('fires onBroadcast after SYNC success and before fetchTxPoll', async () => {
    const events: string[] = []
    const txResponse = makeTxResponse('ORDER_TEST')

    vi.spyOn(txApi as any, 'executeGrpcCall').mockResolvedValue({
      txResponse: {
        txhash: 'ORDER_TEST',
        code: 0,
        rawLog: '',
        codespace: '',
        height: '0',
        gasWanted: '0',
        gasUsed: '0',
      },
    })

    vi.spyOn(txApi, 'fetchTxPoll').mockImplementation(async () => {
      events.push('fetchTxPoll:start')
      return txResponse
    })

    const mockTxRaw = {
      bodyBytes: new Uint8Array(),
      authInfoBytes: new Uint8Array(),
      signatures: [new Uint8Array()],
    }

    await txApi.broadcast(mockTxRaw as any, {
      onBroadcast: () => {
        events.push('onBroadcast')
      },
    })

    expect(events).toEqual(['onBroadcast', 'fetchTxPoll:start'])
  })

  it('allows polling waiter to be cancelled', async () => {
    let pollAbortSignal: AbortSignal | undefined
    const fetchTxPoll = vi
      .spyOn(txApi, 'fetchTxPoll')
      .mockImplementation(async ({ abortSignal }) => {
        if (!abortSignal) {
          throw new Error('missing abort signal')
        }

        pollAbortSignal = abortSignal

        return await new Promise<TxResponse>((_resolve, reject) => {
          abortSignal.addEventListener(
            'abort',
            () => {
              reject(new Error('poll aborted'))
            },
            { once: true },
          )
        })
      })

    const waiter = await txApi.prepareTxInclusionWait('POLL_CANCEL', 1000)
    const waitPromise = waiter.wait()

    expect(fetchTxPoll).toHaveBeenCalledWith({
      txHash: 'POLL_CANCEL',
      timeout: 1000,
      abortSignal: expect.any(Object),
    })
    expect(pollAbortSignal?.aborted).toBe(false)

    waiter.close()

    expect(pollAbortSignal?.aborted).toBe(true)
    await expect(waitPromise).rejects.toThrow('poll aborted')
  })

  it('does not fire onBroadcast when SYNC broadcast returns non-zero code', async () => {
    const onBroadcast = vi.fn()

    vi.spyOn(txApi as any, 'executeGrpcCall').mockResolvedValue({
      txResponse: {
        txhash: 'FAIL_SYNC',
        code: 5,
        rawLog: 'out of gas',
        codespace: 'sdk',
        height: '0',
        gasWanted: '0',
        gasUsed: '0',
      },
    })

    const mockTxRaw = {
      bodyBytes: new Uint8Array(),
      authInfoBytes: new Uint8Array(),
      signatures: [new Uint8Array()],
    }

    await expect(
      txApi.broadcast(mockTxRaw as any, { onBroadcast }),
    ).rejects.toThrow(TransactionException)

    expect(onBroadcast).not.toHaveBeenCalled()
  })

  it('subscribes before async broadcast and resolves inclusion from the tx event', async () => {
    const txRaw = makeTxRaw()
    const txHash = TxClient.hash(txRaw)
    const socket = new FakeWebSocket()
    const txResponse = makeTxResponse(txHash)
    const fetchTxPoll = vi.spyOn(txApi, 'fetchTxPoll')
    const fetchTx = vi.spyOn(txApi, 'fetchTx').mockResolvedValue(txResponse)

    vi.spyOn(txApi as any, 'executeGrpcCall').mockImplementation(async () => {
      expect(socket.subscriptionReady).toBe(true)

      queueMicrotask(() => {
        socket.emitTx(txHash)
      })

      return {
        txResponse: {
          txhash: txHash,
          code: 0,
          rawLog: '',
          codespace: '',
          height: '0',
          gasWanted: '0',
          gasUsed: '0',
        },
      }
    })

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

  it('allows hash-mismatch fallback polling to be cancelled', async () => {
    const txRaw = makeTxRaw()
    const txHash = TxClient.hash(txRaw)
    const includedTxHash = 'A'.repeat(64)
    const socket = new FakeWebSocket()
    let pollAbortSignal: AbortSignal | undefined
    const fetchTxPoll = vi
      .spyOn(txApi, 'fetchTxPoll')
      .mockImplementation(async ({ abortSignal }) => {
        if (!abortSignal) {
          throw new Error('missing abort signal')
        }

        pollAbortSignal = abortSignal

        return await new Promise<TxResponse>((_resolve, reject) => {
          abortSignal.addEventListener(
            'abort',
            () => {
              reject(new Error('poll aborted'))
            },
            { once: true },
          )
        })
      })

    const waiter = await txApi.prepareTxInclusionWait(txHash, 1000, {
      inclusionStrategy: TxInclusionStrategy.TendermintEvent,
      eventInclusion: {
        rpcEndpoint: 'http://localhost:26657',
        webSocketFactory: () => socket as unknown as WebSocket,
      },
    })
    const waitPromise = waiter.wait(includedTxHash)

    await Promise.resolve()

    expect(fetchTxPoll).toHaveBeenCalledWith({
      txHash: includedTxHash,
      timeout: 1000,
      abortSignal: expect.any(Object),
    })
    expect(pollAbortSignal?.aborted).toBe(false)

    waiter.close()

    expect(pollAbortSignal?.aborted).toBe(true)
    await expect(waitPromise).rejects.toThrow('poll aborted')
  })

  it('races event and polling when dual inclusion is enabled', async () => {
    const txRaw = makeTxRaw()
    const txHash = TxClient.hash(txRaw)
    const socket = new FakeWebSocket()
    const txResponse = makeTxResponse(txHash)
    let pollAbortSignal: AbortSignal | undefined
    const fetchTxPoll = vi
      .spyOn(txApi, 'fetchTxPoll')
      .mockImplementation(async ({ abortSignal }) => {
        pollAbortSignal = abortSignal

        return await new Promise<TxResponse>(() => {
          // Keep polling pending so the event side wins deterministically.
        })
      })
    const fetchTx = vi.spyOn(txApi, 'fetchTx').mockResolvedValue(txResponse)

    vi.spyOn(txApi as any, 'executeGrpcCall').mockImplementation(
      async (request: unknown) => {
        const broadcastRequest =
          request as CosmosTxV1Beta1ServicePb.BroadcastTxRequest

        expect(socket.subscriptionReady).toBe(true)
        expect(broadcastRequest.mode).toBe(
          CosmosTxV1Beta1ServicePb.BroadcastMode.ASYNC,
        )

        queueMicrotask(() => {
          socket.emitTx(txHash)
        })

        return {
          txResponse: {
            txhash: txHash,
            code: 0,
            rawLog: '',
            codespace: '',
            height: '0',
            gasWanted: '0',
            gasUsed: '0',
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
    expect(fetchTx).toHaveBeenCalledWith(txHash)
    expect(fetchTxPoll).toHaveBeenCalledWith({
      txHash,
      timeout: expect.any(Number),
      abortSignal: expect.any(Object),
    })
    expect(pollAbortSignal?.aborted).toBe(true)
  })

  it('falls back to sync polling when event inclusion has no rpc endpoint', async () => {
    const txRaw = makeTxRaw()
    const txHash = TxClient.hash(txRaw)
    const onFallback = vi.fn()
    const txResponse = makeTxResponse(txHash)

    vi.spyOn(txApi as any, 'executeGrpcCall').mockImplementation(
      async (request: unknown) => {
        const broadcastRequest =
          request as CosmosTxV1Beta1ServicePb.BroadcastTxRequest

        expect(broadcastRequest.mode).toBe(
          CosmosTxV1Beta1ServicePb.BroadcastMode.SYNC,
        )

        return {
          txResponse: {
            txhash: txHash,
            code: 0,
            rawLog: '',
            codespace: '',
            height: '0',
            gasWanted: '0',
            gasUsed: '0',
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
