import {
  TransactionException,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { TxGrpcApi } from './TxGrpcApi.js'
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

    const result = await txApi.fetchTxPoll('FOUND_FAST', 5000)
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

    const result = await txApi.fetchTxPoll('FOUND_SLOW', 10000)
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
    await expect(txApi.fetchTxPoll('NEVER_FOUND', timeout)).rejects.toThrow(
      GrpcUnaryRequestException,
    )
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

    await expect(txApi.fetchTxPoll('NEVER_FOUND', 1000)).rejects.toThrow(
      /1000ms/,
    )
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

    const promise = txApi.fetchTxPoll('HUNG_NODE', timeout)
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
})
