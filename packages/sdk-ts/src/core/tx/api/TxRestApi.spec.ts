import {
  TransactionException,
  HttpRequestException,
} from '@injectivelabs/exceptions'
import { TxRestApi } from './TxRestApi.js'
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
