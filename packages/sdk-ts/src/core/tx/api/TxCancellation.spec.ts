import { getEventListeners } from 'node:events'
import { AbortError, HttpClient } from '@injectivelabs/utils'
import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb'
import {
  HttpRequestException,
  TransactionException,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { TxGrpcApi } from './TxGrpcApi.js'
import { TxRestApi } from './TxRestApi.js'
import { waitTxBroadcasted } from './utils.js'
import { TxInclusionStrategy } from '../types/tx.js'
import { TxClient } from '../utils/classes/TxClient.js'
import { getTxObservationSignals } from './TxInclusion.js'
import { subscribeToTendermintTxEvent } from './TxEventInclusion.js'
import { TxObservationAbortError } from './TxObservationAbortError.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type {
  TxResponse,
  TxConcreteApi,
  TxClientBroadcastOptions,
} from '../types/tx.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeTxResponse = (txHash = 'ABC123'): TxResponse => ({
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
  logs: [],
})

const makeTxRaw = () =>
  CosmosTxV1Beta1TxPb.TxRaw.create({
    bodyBytes: new Uint8Array([1]),
    authInfoBytes: new Uint8Array([2]),
    signatures: [new Uint8Array([3])],
  })

const makeTxHash = () => {
  const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
    bodyBytes: new Uint8Array([1]),
    authInfoBytes: new Uint8Array([2]),
    signatures: [new Uint8Array([3])],
  })

  return TxClient.hash(txRaw)
}

const flushMicrotasks = async () => {
  await Promise.resolve()
  await Promise.resolve()
  await Promise.resolve()
}

const makeDeferred = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

class ControlledWebSocket extends EventTarget {
  public readyState = 0
  public readonly sent: string[] = []
  public closed = false

  constructor(
    private readonly options: {
      autoOpen?: boolean
      autoAck?: boolean
    } = {},
  ) {
    super()

    if (options.autoOpen !== false) {
      queueMicrotask(() => this.open())
    }
  }

  open() {
    if (this.closed || this.readyState !== 0) {
      return
    }

    this.readyState = 1
    this.dispatchEvent(new Event('open'))
  }

  send(data: string) {
    if (this.closed) {
      return
    }

    this.sent.push(data)

    if (this.options.autoAck === false) {
      return
    }

    const request = JSON.parse(data)

    queueMicrotask(() => this.ack(request.id))
  }

  ack(id: string) {
    if (this.closed) {
      return
    }

    this.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          id,
          jsonrpc: '2.0',
          result: {},
        }),
      }),
    )
  }

  emitTx(txHash: string, code = 0) {
    if (this.closed) {
      return
    }

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
                      code,
                      log: code === 0 ? '' : 'failed',
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

  close() {
    if (this.closed) {
      return
    }

    this.closed = true
    this.readyState = 3
    this.dispatchEvent(new Event('close'))
  }
}

const expectAbortError = (promise: Promise<unknown>, reason?: unknown) =>
  expect(promise).rejects.toMatchObject({
    name: 'AbortError',
    code: 'ERR_CANCELED',
    ...(reason === undefined ? {} : { reason }),
  })

const prepareEventInclusion = async ({
  api,
  txHash,
  socket,
  signal,
  strategy = TxInclusionStrategy.TendermintEvent,
  onFallback,
}: {
  api: TxGrpcApi | TxRestApi
  txHash: string
  socket: ControlledWebSocket
  signal?: AbortSignal
  strategy?: TxInclusionStrategy
  onFallback?: (error: Error) => void
}) =>
  api.prepareTxInclusionWait({
    txHash,
    timeout: 5000,
    signal,
    options: {
      inclusionStrategy: strategy,
      eventInclusion: {
        rpcEndpoint: 'http://localhost:26657',
        webSocketFactory: () => socket as unknown as WebSocket,
        onFallback,
      },
    },
  })

// ---------------------------------------------------------------------------
// fetchTx
// ---------------------------------------------------------------------------

describe('tx observation cancellation: fetchTx', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('REST forwards the per-call signal, keeps params intact and preserves the reason', async () => {
    const api = new TxRestApi('https://lcd.injective.network')
    const controller = new AbortController()
    const reason = { source: 'rest-fetchTx' }
    let receivedSignal: AbortSignal | undefined
    let receivedParams: unknown

    vi.spyOn(api.httpClient, 'get').mockImplementation(((
      _endpoint: string,
      params: unknown,
      config: any,
    ) => {
      receivedParams = params
      receivedSignal = config.signal

      return new Promise(() => {
        // Deliberately ignores cancellation so the SDK race must settle it.
      })
    }) as any)

    const promise = api.fetchTx(
      'ABC',
      { pagination: { limit: 1 } },
      { signal: controller.signal },
    )

    await flushMicrotasks()

    expect(receivedParams).toEqual({ pagination: { limit: 1 } })
    expect(receivedSignal).toBe(controller.signal)

    controller.abort(reason)

    await expectAbortError(promise, reason)
  })

  it('gRPC forwards the signal to executeGrpcCall and does not wrap cancellation', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const controller = new AbortController()
    const reason = new Error('grpc-fetchTx')
    let callSignal: AbortSignal | undefined

    vi.spyOn(api as any, 'executeGrpcCall').mockImplementation((async (
      _request: unknown,
      _method: unknown,
      options: RequestOptions,
    ) => {
      callSignal = options.signal

      return await new Promise(() => {
        // Ignores transport cancellation.
      })
    }) as any)

    const promise = api.fetchTx('ABC', { signal: controller.signal })

    await flushMicrotasks()

    expect(callSignal).toBe(controller.signal)

    controller.abort(reason)

    await expectAbortError(promise, reason)
    expect(callSignal?.aborted).toBe(true)
  })

  it('gRPC also accepts the common third RequestOptions placeholder', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const controller = new AbortController()
    const reason = new Error('third arg')
    let callSignal: AbortSignal | undefined

    vi.spyOn(api as any, 'executeGrpcCall').mockImplementation((async (
      _request: unknown,
      _method: unknown,
      options: RequestOptions,
    ) => {
      callSignal = options.signal

      return await new Promise(() => {
        // Ignores transport cancellation.
      })
    }) as any)

    const promise = api.fetchTx('ABC', undefined, {
      signal: controller.signal,
    })

    await flushMicrotasks()
    controller.abort(reason)

    await expectAbortError(promise, reason)
    expect(callSignal?.aborted).toBe(true)
  })

  it('common TxConcreteApi REST call uses undefined params and cancellable options third without serializing the signal', async () => {
    const concreteApi = new TxRestApi('https://lcd.injective.network')
    const api: TxConcreteApi = concreteApi
    const controller = new AbortController()
    const reason = new Error('common rest fetchTx')
    let receivedParams: unknown
    let receivedSignal: AbortSignal | undefined

    vi.spyOn(concreteApi.httpClient, 'get').mockImplementation(((
      _endpoint: string,
      params: unknown,
      config: any,
    ) => {
      receivedParams = params
      receivedSignal = config.signal

      return new Promise(() => {
        // Ignores cancellation.
      })
    }) as any)

    const promise = api.fetchTx('ABC', undefined, {
      signal: controller.signal,
    })

    await flushMicrotasks()

    expect(receivedParams).toEqual({})
    expect(Object.keys(receivedParams as object)).toHaveLength(0)
    expect(receivedSignal).toBe(controller.signal)

    controller.abort(reason)

    await expectAbortError(promise, reason)
  })

  it('common TxConcreteApi gRPC call uses undefined params and cancellable options third', async () => {
    const concreteApi = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const api: TxConcreteApi = concreteApi
    const controller = new AbortController()
    const reason = new Error('common grpc fetchTx')
    let callSignal: AbortSignal | undefined

    vi.spyOn(concreteApi as any, 'executeGrpcCall').mockImplementation((async (
      _request: unknown,
      _method: unknown,
      options: RequestOptions,
    ) => {
      callSignal = options.signal

      return await new Promise(() => {
        // Ignores cancellation.
      })
    }) as any)

    const promise = api.fetchTx('ABC', undefined, {
      signal: controller.signal,
    })

    await flushMicrotasks()

    expect(callSignal).toBe(controller.signal)

    controller.abort(reason)

    await expectAbortError(promise, reason)
    expect(callSignal?.aborted).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// simulate
// ---------------------------------------------------------------------------

describe('tx observation cancellation: simulate', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('gRPC active cancellation aborts the request without TransactionException wrapping', async () => {
    const concreteApi = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const api: TxConcreteApi = concreteApi
    const controller = new AbortController()
    const reason = new Error('grpc simulate abort')
    let callSignal: AbortSignal | undefined

    vi.spyOn(concreteApi as any, 'executeGrpcCall').mockImplementation((async (
      _request: unknown,
      _method: unknown,
      options: RequestOptions,
    ) => {
      callSignal = options.signal

      return await new Promise(() => {
        // Ignores cancellation.
      })
    }) as any)

    const promise = api.simulate(makeTxRaw(), {
      signal: controller.signal,
    })

    await flushMicrotasks()

    expect(callSignal).toBe(controller.signal)

    controller.abort(reason)

    await expectAbortError(promise, reason)
    expect(callSignal?.aborted).toBe(true)
  })

  it('gRPC pre-abort rejects before starting simulation', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const controller = new AbortController()
    const reason = new Error('grpc simulate pre-abort')
    const execute = vi.spyOn(api as any, 'executeGrpcCall')

    controller.abort(reason)

    await expectAbortError(
      api.simulate(makeTxRaw(), { signal: controller.signal }),
      reason,
    )
    expect(execute).not.toHaveBeenCalled()
  })

  it('gRPC preserves ordinary simulation errors as TransactionException', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')

    vi.spyOn(api as any, 'executeGrpcCall').mockRejectedValue(
      new Error('simulation failed'),
    )

    await expect(api.simulate(makeTxRaw())).rejects.toBeInstanceOf(
      TransactionException,
    )
  })

  it('REST active cancellation forwards the signal and keeps it out of the request body', async () => {
    const concreteApi = new TxRestApi('https://lcd.injective.network')
    const api: TxConcreteApi = concreteApi
    const controller = new AbortController()
    const reason = new Error('rest simulate abort')
    let requestBody: any
    let callSignal: AbortSignal | undefined

    vi.spyOn(concreteApi.httpClient, 'post').mockImplementation(((
      _endpoint: string,
      body: any,
      config: any,
    ) => {
      requestBody = body
      callSignal = config.signal

      return new Promise(() => {
        // Ignores cancellation.
      })
    }) as any)

    const promise = api.simulate(makeTxRaw(), {
      signal: controller.signal,
    })

    await flushMicrotasks()

    expect(callSignal).toBe(controller.signal)
    expect(requestBody.signal).toBeUndefined()
    expect(Object.keys(requestBody)).toEqual(['tx_bytes'])

    controller.abort(reason)

    await expectAbortError(promise, reason)
    expect(callSignal?.aborted).toBe(true)
  })

  it('REST pre-abort rejects before starting simulation', async () => {
    const api = new TxRestApi('https://lcd.injective.network')
    const controller = new AbortController()
    const reason = new Error('rest simulate pre-abort')
    const post = vi.spyOn(api.httpClient, 'post')

    controller.abort(reason)

    await expectAbortError(
      api.simulate(makeTxRaw(), { signal: controller.signal }),
      reason,
    )
    expect(post).not.toHaveBeenCalled()
  })

  it('REST preserves ordinary simulation errors as TransactionException', async () => {
    const api = new TxRestApi('https://lcd.injective.network')

    vi.spyOn(api as any, 'postRaw').mockRejectedValue(
      new Error('simulation failed'),
    )

    await expect(api.simulate(makeTxRaw())).rejects.toBeInstanceOf(
      TransactionException,
    )
  })
})

// ---------------------------------------------------------------------------
// Read/simulation signal cleanup
// ---------------------------------------------------------------------------

describe.each(['REST', 'gRPC'])(
  '%s transaction read signal cleanup',
  (transport) => {
    it.each(
      (['fetchTx', 'simulate'] as const).flatMap((method) =>
        ['success', 'failure'].map((outcome) => ({ method, outcome })),
      ),
    )(
      'releases both signal listeners after $method $outcome',
      async ({ method, outcome }) => {
        const client = new AbortController()
        const request = new AbortController()
        const api =
          transport === 'REST'
            ? new TxRestApi('https://unused.invalid')
            : new TxGrpcApi('https://unused.invalid', { abort: client.signal })

        if (api instanceof TxRestApi) {
          api.httpClient.setConfig({ signal: client.signal })
        }

        const call =
          api instanceof TxRestApi
            ? vi.spyOn(api.httpClient, method === 'fetchTx' ? 'get' : 'post')
            : vi.spyOn(api as any, 'executeGrpcCall')
        if (outcome === 'failure') {
          call.mockRejectedValue(new Error('request failed'))
        } else {
          call.mockResolvedValue({
            txResponse: {
              code: 0,
              txhash: 'ABC',
              height: '1',
              gasWanted: '1',
              gasUsed: '1',
            },
            result: {},
            gasInfo: { gasWanted: '1', gasUsed: '1' },
            data: {
              tx_response: {
                code: 0,
                txhash: 'ABC',
                height: '1',
                gas_wanted: '1',
                gas_used: '1',
              },
              result: { data: '', log: '', events: [] },
              gas_info: { gas_wanted: '1', gas_used: '1' },
            },
          })
        }
        const options = { signal: request.signal }
        const pending =
          method === 'fetchTx'
            ? api.fetchTx('ABC', undefined, options)
            : api.simulate(makeTxRaw(), options)

        if (outcome === 'success') {
          await expect(pending).resolves.toBeDefined()
        } else {
          await expect(pending).rejects.toBeInstanceOf(Error)
        }
        for (const controller of [client, request]) {
          expect(controller.signal.aborted).toBe(false)
          expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
        }
      },
    )
  },
)

// ---------------------------------------------------------------------------
// fetchTxPoll
// ---------------------------------------------------------------------------

describe('tx observation cancellation: fetchTxPoll', () => {
  it.each([
    ['REST', 'request'],
    ['REST', 'backoff'],
    ['gRPC', 'request'],
    ['gRPC', 'backoff'],
  ])(
    '%s stops promptly when aborted during polling %s',
    async (transport, phase) => {
      vi.useFakeTimers()
      const api =
        transport === 'REST'
          ? new TxRestApi('https://lcd.injective.network')
          : new TxGrpcApi('https://sentry.tm.injective.network:443')
      const controller = new AbortController()
      const fetchTx = vi.spyOn(api as any, 'fetchTx')

      if (phase === 'request') {
        fetchTx.mockImplementation(() => new Promise(() => {}))
      } else {
        fetchTx.mockRejectedValue(new Error('not found'))
      }

      const promise = api.fetchTxPoll({
        txHash: 'CANCEL_POLL',
        abortSignal: controller.signal,
        timeout: 10000,
        pollingInterval: 1000,
      })
      const assertion = expectAbortError(promise, 'stop polling')

      await vi.advanceTimersByTimeAsync(300)
      expect(fetchTx).toHaveBeenCalled()
      const callsBeforeAbort = fetchTx.mock.calls.length
      controller.abort('stop polling')

      await assertion
      expect(vi.getTimerCount()).toBe(0)
      await vi.advanceTimersByTimeAsync(10000)
      expect(fetchTx).toHaveBeenCalledTimes(callsBeforeAbort)
    },
  )

  afterEach(() => {
    vi.useRealTimers()
  })

  it('a REST attempt deadline aborts that attempt only and the next poll succeeds', async () => {
    vi.useFakeTimers()

    const api = new TxRestApi('https://lcd.injective.network')
    const txResponse = makeTxResponse('REST_ATTEMPT')
    const signals: AbortSignal[] = []

    vi.spyOn(api, 'fetchTx').mockImplementation(
      async (_txHash, _params, options) => {
        signals.push(options?.signal as AbortSignal)

        if (signals.length === 1) {
          return await new Promise<TxResponse>(() => {
            // First attempt is deliberately stuck.
          })
        }

        return txResponse
      },
    )

    const promise = api.fetchTxPoll({
      txHash: 'REST_ATTEMPT',
      timeout: 10000,
      pollingInterval: 0,
    })

    await vi.advanceTimersByTimeAsync(3000)

    await expect(promise).resolves.toBe(txResponse)
    expect(signals.length).toBeGreaterThanOrEqual(2)
    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('a gRPC attempt deadline aborts both dual branches and the next poll succeeds', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txResponse = makeTxResponse('GRPC_ATTEMPT')
    const signals: AbortSignal[] = []

    vi.spyOn(api as any, 'fetchTx').mockImplementation((async (
      _txHash: string,
      options?: RequestOptions,
    ) => {
      signals.push(options?.signal as AbortSignal)

      if (signals.length <= 2) {
        return await new Promise<TxResponse>(() => {
          // Both branches of the first attempt are stuck.
        })
      }

      return txResponse
    }) as any)

    const promise = api.fetchTxPoll({
      txHash: 'GRPC_ATTEMPT',
      timeout: 10000,
      pollingInterval: 0,
    })

    // First attempt: both branches time out. The next attempt waits for its
    // own 300ms stagger before both observations settle.
    await vi.advanceTimersByTimeAsync(3000)
    await vi.advanceTimersByTimeAsync(300)

    await expect(promise).resolves.toBe(txResponse)
    expect(signals.length).toBeGreaterThanOrEqual(4)
    expect(signals[0].aborted).toBe(true)
    expect(signals[1].aborted).toBe(true)
    expect(signals[2].aborted).toBe(false)
    expect(signals[3].aborted).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('overall timeout stays a timeout error and aborts the active attempt', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const signals: AbortSignal[] = []

    vi.spyOn(api as any, 'fetchTx').mockImplementation((async (
      _txHash: string,
      options?: RequestOptions,
    ) => {
      signals.push(options?.signal as AbortSignal)

      return await new Promise<TxResponse>(() => {
        // Never resolves.
      })
    }) as any)

    const promise = api.fetchTxPoll({
      txHash: 'NEVER',
      timeout: 1000,
      pollingInterval: 0,
    })
    const assertion = expect(promise).rejects.toThrow(GrpcUnaryRequestException)

    await vi.advanceTimersByTimeAsync(1100)
    await assertion

    await expect(promise).rejects.toThrow(/1000ms/)
    expect(signals.every((signal) => signal.aborted)).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not extend the overall deadline by a long polling interval', async () => {
    vi.useFakeTimers()

    const api = new TxRestApi('https://lcd.injective.network')

    vi.spyOn(api, 'fetchTx').mockRejectedValue(
      new HttpRequestException(new Error('not found'), {
        context: 'TxRestApi',
        contextModule: 'fetch-tx',
      }),
    )

    const promise = api.fetchTxPoll({
      txHash: 'LONG_INTERVAL',
      timeout: 1000,
      pollingInterval: 5000,
    })
    const assertion = expect(promise).rejects.toThrow(HttpRequestException)

    await vi.advanceTimersByTimeAsync(1100)
    await assertion

    await expect(promise).rejects.toThrow(/1000ms/)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('custom cancellation reason is preserved and no fetch starts afterwards', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const controller = new AbortController()
    const reason = { source: 'poll-user' }
    const signals: AbortSignal[] = []
    const fetchTx = vi.spyOn(api as any, 'fetchTx').mockImplementation((async (
      _txHash: string,
      options?: RequestOptions,
    ) => {
      signals.push(options?.signal as AbortSignal)

      return await new Promise<TxResponse>(() => {
        // Never resolves.
      })
    }) as any)

    const promise = api.fetchTxPoll({
      txHash: 'CUSTOM_REASON',
      signal: controller.signal,
      timeout: 10000,
      pollingInterval: 0,
    })

    await flushMicrotasks()
    controller.abort(reason)

    await expectAbortError(promise, reason)
    expect(fetchTx).toHaveBeenCalledTimes(1)
    expect(signals[0].aborted).toBe(true)

    await vi.advanceTimersByTimeAsync(10000)
    expect(fetchTx).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('pre-aborted alias signal rejects before starting a fetch', async () => {
    const api = new TxRestApi('https://lcd.injective.network')
    const controller = new AbortController()
    const reason = new Error('already aborted')
    const fetchTx = vi.spyOn(api, 'fetchTx')

    controller.abort(reason)

    await expectAbortError(
      api.fetchTxPoll({
        txHash: 'PRE_ABORTED',
        signal: controller.signal,
        timeout: 5000,
      }),
      reason,
    )
    expect(fetchTx).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Tendermint subscription
// ---------------------------------------------------------------------------

describe('tx observation cancellation: Tendermint subscription', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('aborting before the subscription ACK rejects promptly and closes the socket', async () => {
    vi.useFakeTimers()

    const controller = new AbortController()
    const reason = new Error('pre-ack abort')
    let socket: ControlledWebSocket | undefined

    const subscriptionPromise = subscribeToTendermintTxEvent({
      txHash: makeTxHash(),
      timeout: 5000,
      endpoint: 'http://localhost:26657',
      signal: controller.signal,
      webSocketFactory: () => {
        socket = new ControlledWebSocket({ autoOpen: false })

        return socket as unknown as WebSocket
      },
    })

    controller.abort(reason)

    await expectAbortError(subscriptionPromise, reason)
    expect(socket?.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('close settles a pending wait, reuses the wait promise and ignores late events', async () => {
    vi.useFakeTimers()

    const txHash = makeTxHash()
    let socket: ControlledWebSocket | undefined

    const subscription = await subscribeToTendermintTxEvent({
      txHash,
      timeout: 5000,
      endpoint: 'http://localhost:26657',
      webSocketFactory: () => {
        socket = new ControlledWebSocket()

        return socket as unknown as WebSocket
      },
    })

    const firstWait = subscription.wait()
    const secondWait = subscription.wait()

    expect(secondWait).toBe(firstWait)

    subscription.close()

    await expectAbortError(firstWait)
    await expectAbortError(subscription.wait())
    expect(socket?.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)

    socket?.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({ result: {} }),
      }),
    )
    await flushMicrotasks()

    await expectAbortError(firstWait)
  })

  it('abort closes the socket and rejects a pending wait with the caller reason', async () => {
    vi.useFakeTimers()

    const txHash = makeTxHash()
    const controller = new AbortController()
    const reason = { source: 'event-user' }
    let socket: ControlledWebSocket | undefined

    const subscription = await subscribeToTendermintTxEvent({
      txHash,
      timeout: 5000,
      endpoint: 'http://localhost:26657',
      signal: controller.signal,
      webSocketFactory: () => {
        socket = new ControlledWebSocket()

        return socket as unknown as WebSocket
      },
    })

    const waitPromise = subscription.wait()

    controller.abort(reason)

    await expectAbortError(waitPromise, reason)
    expect(socket?.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Inclusion waiter preparation / polling
// ---------------------------------------------------------------------------

describe('tx observation cancellation: inclusion preparation', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('collects every observation signal alias in one place', () => {
    const [signal, abortSignal, eventSignal, requestSignal] = Array.from(
      { length: 4 },
      () => new AbortController().signal,
    )

    expect(
      getTxObservationSignals(
        { signal, abortSignal, eventInclusion: { signal: eventSignal } },
        { signal: requestSignal },
      ),
    ).toEqual([signal, abortSignal, eventSignal, requestSignal])
    expect(getTxObservationSignals()).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ])
  })

  it('pre-aborted prepare rejects before polling and before fallback', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const controller = new AbortController()
    const reason = new Error('prepare aborted')
    const onFallback = vi.fn()
    const fetchTxPoll = vi.spyOn(api, 'fetchTxPoll')

    controller.abort(reason)

    await expectAbortError(
      api.prepareTxInclusionWait({
        txHash: 'PREPARE',
        signal: controller.signal,
        options: {
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          eventInclusion: { onFallback },
        },
      }),
      reason,
    )
    expect(onFallback).not.toHaveBeenCalled()
    expect(fetchTxPoll).not.toHaveBeenCalled()
  })

  it('aborting subscription readiness does not fall back or start polling', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const controller = new AbortController()
    const reason = new Error('readiness aborted')
    const onFallback = vi.fn()
    const fetchTxPoll = vi.spyOn(api, 'fetchTxPoll')
    let socket: ControlledWebSocket | undefined

    const preparePromise = api.prepareTxInclusionWait({
      txHash: makeTxHash(),
      timeout: 5000,
      signal: controller.signal,
      options: {
        inclusionStrategy: TxInclusionStrategy.TendermintEvent,
        eventInclusion: {
          rpcEndpoint: 'http://localhost:26657',
          onFallback,
          webSocketFactory: () => {
            socket = new ControlledWebSocket({ autoOpen: false })

            return socket as unknown as WebSocket
          },
        },
      },
    })

    await flushMicrotasks()
    controller.abort(reason)

    await expectAbortError(preparePromise, reason)
    expect(onFallback).not.toHaveBeenCalled()
    expect(fetchTxPoll).not.toHaveBeenCalled()
    expect(socket?.readyState).toBe(3)
  })

  it('closing a polling waiter before wait rejects wait-after-close', async () => {
    const api = new TxRestApi('https://lcd.injective.network')
    const fetchTxPoll = vi.spyOn(api, 'fetchTxPoll')
    const waiter = await api.prepareTxInclusionWait({
      txHash: 'POLL_CLOSE',
      timeout: 5000,
    })

    waiter.close()

    await expectAbortError(waiter.wait())
    expect(fetchTxPoll).not.toHaveBeenCalled()
  })

  it('closing a polling waiter settles a pending wait even if polling ignores the signal', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    let pollSignal: AbortSignal | undefined

    vi.spyOn(api, 'fetchTxPoll').mockImplementation(async ({ abortSignal }) => {
      pollSignal = abortSignal

      return await new Promise<TxResponse>(() => {
        // Deliberately ignores cancellation.
      })
    })

    const waiter = await api.prepareTxInclusionWait({
      txHash: 'POLL_PENDING_CLOSE',
      timeout: 5000,
    })
    const waitPromise = waiter.wait()

    expect(waiter.wait()).toBe(waitPromise)

    await flushMicrotasks()
    waiter.close()

    expect(waiter.wait()).toBe(waitPromise)
    await expectAbortError(waitPromise)
    expect(pollSignal?.aborted).toBe(true)
  })

  it('aborting before wait rejects a polling waiter without fetching', async () => {
    const api = new TxRestApi('https://lcd.injective.network')
    const controller = new AbortController()
    const reason = new Error('wait aborted')
    const fetchTxPoll = vi.spyOn(api, 'fetchTxPoll')
    const waiter = await api.prepareTxInclusionWait({
      txHash: 'ABORT_BEFORE_WAIT',
      timeout: 5000,
      signal: controller.signal,
    })

    controller.abort(reason)

    await expectAbortError(waiter.wait(), reason)
    expect(fetchTxPoll).not.toHaveBeenCalled()
  })

  it('composes an inclusion-options signal into the waiter lifetime', async () => {
    const api = new TxRestApi('https://lcd.injective.network')
    const controller = new AbortController()
    const reason = new Error('options signal aborted')
    const fetchTxPoll = vi.spyOn(api, 'fetchTxPoll')
    const waiter = await api.prepareTxInclusionWait({
      txHash: 'OPTIONS_SIGNAL',
      timeout: 5000,
      options: { signal: controller.signal },
    })

    controller.abort(reason)

    await expectAbortError(waiter.wait(), reason)
    expect(fetchTxPoll).not.toHaveBeenCalled()
  })

  it('composes the inclusion-options abortSignal alias', async () => {
    const api = new TxRestApi('https://lcd.injective.network')
    const controller = new AbortController()
    const reason = new Error('options alias aborted')
    const fetchTxPoll = vi.spyOn(api, 'fetchTxPoll')
    const waiter = await api.prepareTxInclusionWait({
      txHash: 'OPTIONS_ALIAS',
      timeout: 5000,
      options: { abortSignal: controller.signal },
    })

    controller.abort(reason)

    await expectAbortError(waiter.wait(), reason)
    expect(fetchTxPoll).not.toHaveBeenCalled()
  })
})

// ---------------------------------------------------------------------------
// Client-wide constructor abort
// ---------------------------------------------------------------------------

describe('tx observation cancellation: client-wide constructor abort', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('cancels polling backoff promptly with the constructor abort reason', async () => {
    vi.useFakeTimers()

    const controller = new AbortController()
    const reason = { source: 'constructor-backoff' }
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443', {
      abort: controller.signal,
    })
    const fetchTx = vi.spyOn(api as any, 'fetchTx').mockRejectedValue(
      new GrpcUnaryRequestException(new Error('not found'), {
        context: 'TxGrpcApi',
        contextModule: 'fetch-tx',
      }),
    )

    const promise = api.fetchTxPoll({
      txHash: 'CONSTRUCTOR_BACKOFF',
      timeout: 10000,
      pollingInterval: 1000,
    })
    const assertion = expectAbortError(promise, reason)

    await vi.advanceTimersByTimeAsync(300)

    expect(fetchTx).toHaveBeenCalledTimes(2)

    controller.abort(reason)

    await assertion
    expect(vi.getTimerCount()).toBe(0)
  })

  it('rejects a pre-aborted constructor signal before polling starts', async () => {
    const controller = new AbortController()
    const reason = new Error('constructor pre-abort')
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443', {
      abort: controller.signal,
    })
    const fetchTx = vi.spyOn(api as any, 'fetchTx')

    controller.abort(reason)

    await expectAbortError(
      api.fetchTxPoll({ txHash: 'CONSTRUCTOR_PRE_ABORT', timeout: 5000 }),
      reason,
    )
    expect(fetchTx).not.toHaveBeenCalled()
  })

  it('settles a prepared event waiter when the constructor signal aborts', async () => {
    vi.useFakeTimers()

    const controller = new AbortController()
    const reason = new Error('constructor pending event')
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443', {
      abort: controller.signal,
    })
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const fetchTx = vi.spyOn(api as any, 'fetchTx')
    const waiter = await prepareEventInclusion({ api, txHash, socket })
    const waitPromise = waiter.wait()

    await flushMicrotasks()
    controller.abort(reason)

    await expectAbortError(waitPromise, reason)
    expect(fetchTx).not.toHaveBeenCalled()
    expect(socket.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cancels pending event subscription preparation without fallback', async () => {
    vi.useFakeTimers()

    const controller = new AbortController()
    const reason = new Error('constructor preparation')
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443', {
      abort: controller.signal,
    })
    const onFallback = vi.fn()
    const fetchTxPoll = vi.spyOn(api, 'fetchTxPoll')
    let socket: ControlledWebSocket | undefined

    const preparePromise = api.prepareTxInclusionWait({
      txHash: makeTxHash(),
      timeout: 5000,
      options: {
        inclusionStrategy: TxInclusionStrategy.TendermintEvent,
        eventInclusion: {
          rpcEndpoint: 'http://localhost:26657',
          onFallback,
          webSocketFactory: () => {
            socket = new ControlledWebSocket({ autoOpen: false })

            return socket as unknown as WebSocket
          },
        },
      },
    })

    await flushMicrotasks()
    controller.abort(reason)

    await expectAbortError(preparePromise, reason)
    expect(onFallback).not.toHaveBeenCalled()
    expect(fetchTxPoll).not.toHaveBeenCalled()
    expect(socket?.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Event inclusion waiter
// ---------------------------------------------------------------------------

describe('REST observation client cancellation scope', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  const createApi = () => {
    const constructor = new AbortController()
    const config = new AbortController()
    const request = new AbortController()
    const api = new TxRestApi('https://unused.invalid')
    api.httpClient = new HttpClient('https://unused.invalid', {
      signal: constructor.signal,
    })
    api.httpClient.setConfig({ signal: config.signal })
    return { api, constructor, config, request }
  }

  it.each(['constructor', 'config'] as const)(
    'cancels backoff promptly through the %s signal',
    async (source) => {
      vi.useFakeTimers()
      const scope = createApi()
      const fetchTx = vi
        .spyOn(scope.api, 'fetchTx')
        .mockRejectedValue(new Error('not found'))
      const pending = scope.api.fetchTxPoll({
        txHash: makeTxHash(),
        timeout: 500,
        pollingInterval: 1000,
      })
      const outcome = pending.catch((error: unknown) => error)
      await vi.advanceTimersByTimeAsync(0)
      expect(fetchTx).toHaveBeenCalledTimes(1)
      scope[source].abort('cancel backoff')
      await vi.advanceTimersByTimeAsync(500)
      await expect(outcome).resolves.toMatchObject({
        name: 'AbortError',
        reason: 'cancel backoff',
      })
      expect(fetchTx).toHaveBeenCalledTimes(1)
      expect(vi.getTimerCount()).toBe(0)
      for (const controller of [scope.constructor, scope.config]) {
        expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
      }
    },
  )

  it.each(['constructor', 'config'] as const)(
    'rejects a pre-aborted %s signal before opening an event socket',
    async (source) => {
      const scope = createApi()
      scope[source].abort('already cancelled')
      const socket = new ControlledWebSocket()
      const factory = vi.fn(() => socket as unknown as WebSocket)
      const pending = scope.api.prepareTxInclusionWait({
        txHash: makeTxHash(),
        options: {
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          eventInclusion: {
            rpcEndpoint: 'https://unused.invalid',
            webSocketFactory: factory,
          },
        },
      })
      const result = await pending.catch((error: unknown) => error)
      if (result && typeof result === 'object' && 'close' in result)
        (result as { close(): void }).close()
      expect(result).toMatchObject({
        name: 'AbortError',
        reason: 'already cancelled',
      })
      expect(factory).not.toHaveBeenCalled()
      for (const controller of [scope.constructor, scope.config]) {
        expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
      }
    },
  )

  it.each(['constructor', 'config', 'request'] as const)(
    'releases a prepared event waiter when %s aborts before wait',
    async (source) => {
      const scope = createApi()
      const socket = new ControlledWebSocket()
      const fallback = vi.fn()
      const waiter = await prepareEventInclusion({
        api: scope.api,
        txHash: makeTxHash(),
        socket,
        signal: scope.request.signal,
        onFallback: fallback,
      })
      expect(
        getEventListeners(scope.constructor.signal, 'abort').length,
      ).toBeGreaterThan(0)
      scope[source].abort('prepared cancellation')
      const closedOnAbort = socket.closed
      for (const controller of [
        scope.constructor,
        scope.config,
        scope.request,
      ]) {
        expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
      }
      // Cleanup is safe even if the cancellation assertion fails.
      waiter.close()
      await expectAbortError(waiter.wait(), 'prepared cancellation')
      expect(closedOnAbort).toBe(true)
      expect(fallback).not.toHaveBeenCalled()
      for (const controller of [
        scope.constructor,
        scope.config,
        scope.request,
      ]) {
        expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
      }
    },
  )

  it('cancels an event handshake without fallback and releases both client signals', async () => {
    vi.useFakeTimers()
    const scope = createApi()
    const socket = new ControlledWebSocket({ autoOpen: false })
    const fallback = vi.fn()
    const pending = prepareEventInclusion({
      api: scope.api,
      txHash: makeTxHash(),
      socket,
      onFallback: fallback,
    })
    const outcome = pending.catch((error: unknown) => error)
    scope.config.abort('handshake cancellation')
    await vi.advanceTimersByTimeAsync(5000)
    const result = await outcome
    if (result && typeof result === 'object' && 'close' in result)
      (result as { close(): void }).close()
    expect(result).toMatchObject({
      name: 'AbortError',
      reason: 'handshake cancellation',
    })
    expect(fallback).not.toHaveBeenCalled()
    expect(socket.closed).toBe(true)
    for (const controller of [scope.constructor, scope.config]) {
      expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
    }
  })

  it('releases client signals when event preparation fails', async () => {
    const scope = createApi()
    await expect(
      scope.api.prepareTxInclusionWait({
        txHash: makeTxHash(),
        options: {
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          eventInclusion: { fallbackToPolling: false },
        },
      }),
    ).rejects.toBeInstanceOf(HttpRequestException)
    for (const controller of [scope.constructor, scope.config]) {
      expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
    }
  })

  it('releases a polling waiter client scope on request abort before wait', async () => {
    const scope = createApi()
    const poll = vi.spyOn(scope.api, 'fetchTxPoll')
    const waiter = await scope.api.prepareTxInclusionWait({
      txHash: makeTxHash(),
      signal: scope.request.signal,
    })
    scope.request.abort('before wait')
    for (const controller of [scope.constructor, scope.config, scope.request]) {
      expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
    }
    await expectAbortError(waiter.wait(), 'before wait')
    expect(poll).not.toHaveBeenCalled()
  })

  describe.each(['constructor', 'config'] as const)(
    '%s broadcast cancellation',
    (source) => {
      it.each(['before submission', 'after submission'] as const)(
        'preserves the first reason %s and retains only submitted hashes',
        async (phase) => {
          const scope = createApi()
          const txHash = makeTxHash()
          const broadcast = vi
            .spyOn(scope.api as any, 'broadcastTx')
            .mockResolvedValue({ tx_response: { code: 0, txhash: txHash } })
          const abort = () => {
            scope[source].abort('first reason')
            scope.request.abort('second reason')
          }
          const pending = scope.api.broadcast(makeTxRaw(), {
            signal: scope.request.signal,
            onBroadcast: phase === 'after submission' ? abort : undefined,
          })
          if (phase === 'before submission') abort()
          const error = await pending.catch((e: unknown) => e)
          expect(error).toMatchObject({
            name: 'AbortError',
            reason: 'first reason',
          })
          if (phase === 'before submission') {
            expect(broadcast).not.toHaveBeenCalled()
            expect(error).not.toHaveProperty('txHash')
          } else {
            expect(broadcast).toHaveBeenCalledOnce()
            expect(error).toBeInstanceOf(TxObservationAbortError)
            expect(error).toMatchObject({ txHash })
          }
          for (const controller of [
            scope.constructor,
            scope.config,
            scope.request,
          ]) {
            expect(getEventListeners(controller.signal, 'abort')).toHaveLength(
              0,
            )
          }
        },
      )
    },
  )

  it.each(['success', 'failure', 'close', 'abort'] as const)(
    'releases client scope listeners after waiter %s',
    async (outcome) => {
      const scope = createApi()
      const response = makeTxResponse()
      const error = new Error('poll failed')
      const poll = vi.spyOn(scope.api, 'fetchTxPoll')
      if (outcome === 'success') poll.mockResolvedValue(response)
      else if (outcome === 'failure') poll.mockRejectedValue(error)
      else poll.mockImplementation(() => new Promise(() => {}))
      const waiter = await scope.api.prepareTxInclusionWait({
        txHash: makeTxHash(),
        signal: scope.request.signal,
      })
      expect(
        getEventListeners(scope.constructor.signal, 'abort').length,
      ).toBeGreaterThan(0)
      const pending = waiter.wait()
      const result = pending.catch((error: unknown) => error)
      if (outcome === 'close') waiter.close()
      if (outcome === 'abort') scope.config.abort('waiting cancellation')
      if (outcome === 'success') await expect(result).resolves.toBe(response)
      else if (outcome === 'failure') await expect(result).resolves.toBe(error)
      else await expect(result).resolves.toMatchObject({ name: 'AbortError' })
      for (const controller of [
        scope.constructor,
        scope.config,
        scope.request,
      ]) {
        expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
      }
      waiter.close()
    },
  )
})

describe('tx observation cancellation: event inclusion waiter', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('abort before wait closes the subscription and rejects with the caller reason', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const controller = new AbortController()
    const reason = { source: 'event-wait-preabort' }
    const fetchTx = vi.spyOn(api as any, 'fetchTx')

    const waiter = await prepareEventInclusion({
      api,
      txHash,
      socket,
      signal: controller.signal,
    })

    expect(socket.readyState).toBe(1)

    controller.abort(reason)

    await expectAbortError(waiter.wait(), reason)
    expect(fetchTx).not.toHaveBeenCalled()
    expect(socket.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('close before wait settles/wait-after-close and closes the socket', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const waiter = await prepareEventInclusion({ api, txHash, socket })

    waiter.close()

    await expectAbortError(waiter.wait())
    await expectAbortError(waiter.wait())
    expect(socket.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('closing while waiting for the event settles the wait promptly', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const waiter = await prepareEventInclusion({ api, txHash, socket })
    const waitPromise = waiter.wait()

    await flushMicrotasks()
    waiter.close()

    expect(waiter.wait()).toBe(waitPromise)
    await expectAbortError(waitPromise)
    expect(socket.readyState).toBe(3)

    socket.emitTx(txHash)
    await flushMicrotasks()

    await expectAbortError(waitPromise)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('aborting an event-only waiter does not invoke onFallback or poll', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const controller = new AbortController()
    const reason = new Error('event abort no fallback')
    const onFallback = vi.fn()
    const fetchTxPoll = vi.spyOn(api, 'fetchTxPoll')

    const waiter = await prepareEventInclusion({
      api,
      txHash,
      socket,
      signal: controller.signal,
      onFallback,
    })
    const waitPromise = waiter.wait()

    await flushMicrotasks()
    controller.abort(reason)

    await expectAbortError(waitPromise, reason)
    expect(onFallback).not.toHaveBeenCalled()
    expect(fetchTxPoll).not.toHaveBeenCalled()
    expect(socket.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('still falls back to polling on an event timeout (not a cancellation)', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const txResponse = makeTxResponse('EVENT_TIMEOUT_FALLBACK')
    const onFallback = vi.fn()

    vi.spyOn(api, 'fetchTxPoll').mockResolvedValue(txResponse)

    const waiter = await api.prepareTxInclusionWait({
      txHash,
      timeout: 5000,
      options: {
        inclusionStrategy: TxInclusionStrategy.TendermintEvent,
        eventInclusion: {
          rpcEndpoint: 'http://localhost:26657',
          timeout: 50,
          onFallback,
          webSocketFactory: () => socket as unknown as WebSocket,
        },
      },
    })
    const waitPromise = waiter.wait()

    await vi.advanceTimersByTimeAsync(50)

    await expect(waitPromise).resolves.toBe(txResponse)
    expect(onFallback).toHaveBeenCalledTimes(1)
    expect(socket.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cancels the final fetch started after the tx event', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const controller = new AbortController()
    const reason = { source: 'final-fetch' }
    const fetchSignals: AbortSignal[] = []

    vi.spyOn(api as any, 'fetchTx').mockImplementation((async (
      _hash: string,
      options?: RequestOptions,
    ) => {
      fetchSignals.push(options?.signal as AbortSignal)

      return await new Promise<TxResponse>(() => {
        // Final fetch is deliberately stuck.
      })
    }) as any)

    const waiter = await prepareEventInclusion({
      api,
      txHash,
      socket,
      signal: controller.signal,
    })
    const waitPromise = waiter.wait()

    socket.emitTx(txHash)
    await flushMicrotasks()

    expect(fetchSignals).toHaveLength(1)
    expect(fetchSignals[0].aborted).toBe(false)

    controller.abort(reason)

    await expectAbortError(waitPromise, reason)
    expect(fetchSignals[0].aborted).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('aborting before a hash-mismatch wait does not notify fallback or poll', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const controller = new AbortController()
    const reason = new Error('mismatch pre-abort')
    const onFallback = vi.fn()
    const fetchTxPoll = vi.spyOn(api, 'fetchTxPoll')

    const waiter = await prepareEventInclusion({
      api,
      txHash,
      socket,
      signal: controller.signal,
      onFallback,
    })

    controller.abort(reason)

    await expectAbortError(waiter.wait('A'.repeat(64)), reason)
    expect(onFallback).not.toHaveBeenCalled()
    expect(fetchTxPoll).not.toHaveBeenCalled()
    expect(socket.readyState).toBe(3)
  })

  it('hash-mismatch polling is cancelled by the inherited signal', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const includedTxHash = 'A'.repeat(64)
    const socket = new ControlledWebSocket()
    const controller = new AbortController()
    const reason = new Error('hash mismatch abort')
    const onFallback = vi.fn()
    let pollSignal: AbortSignal | undefined
    const fetchTxPoll = vi
      .spyOn(api, 'fetchTxPoll')
      .mockImplementation(async ({ abortSignal }) => {
        pollSignal = abortSignal

        return await new Promise<TxResponse>(() => {
          // Ignores cancellation.
        })
      })

    const waiter = await prepareEventInclusion({
      api,
      txHash,
      socket,
      signal: controller.signal,
      onFallback,
    })
    const waitPromise = waiter.wait(includedTxHash)

    await flushMicrotasks()

    expect(fetchTxPoll).toHaveBeenCalledWith({
      txHash: includedTxHash,
      timeout: 5000,
      abortSignal: expect.any(Object),
    })
    expect(onFallback).toHaveBeenCalledTimes(1)

    controller.abort(reason)

    await expectAbortError(waitPromise, reason)
    expect(pollSignal?.aborted).toBe(true)
    expect(fetchTxPoll).toHaveBeenCalledTimes(1)
    expect(onFallback).toHaveBeenCalledTimes(1)
  })
})

// ---------------------------------------------------------------------------
// Dual event + poll observation
// ---------------------------------------------------------------------------

describe.each([
  { name: 'gRPC', Api: TxGrpcApi },
  { name: 'REST', Api: TxRestApi },
])('$name inclusion cancellation ownership', ({ Api }) => {
  it.each(
    ['factory', 'subscribe', 'final-fetch', 'dual-event', 'dual-poll'].flatMap(
      (stage) =>
        ['AbortError', 'ERR_CANCELED'].map((shape) => ({ stage, shape })),
    ),
  )(
    'allows fallback or a sibling winner after an unrelated $shape at $stage',
    async ({ stage, shape }) => {
      const api = new Api('https://unused.invalid')
      const controller = new AbortController()
      const txHash = makeTxHash()
      const response = makeTxResponse(txHash)
      const dependencyError =
        shape === 'AbortError'
          ? new DOMException('dependency aborted', 'AbortError')
          : Object.assign(new Error('dependency cancelled'), {
              code: 'ERR_CANCELED',
            })
      const onFallback = vi.fn()
      const pollResult = makeDeferred<TxResponse>()
      const poll = vi.spyOn(api, 'fetchTxPoll').mockImplementation(async () => {
        if (stage === 'dual-poll') throw dependencyError
        return stage === 'dual-event' ? pollResult.promise : response
      })
      vi.spyOn(api as any, 'fetchTx').mockImplementation(async () => {
        if (stage === 'final-fetch' || stage === 'dual-event')
          throw dependencyError
        return response
      })
      let socket: ControlledWebSocket | undefined
      const waiter = await api.prepareTxInclusionWait({
        txHash,
        timeout: 5000,
        signal: controller.signal,
        options: {
          inclusionStrategy: stage.startsWith('dual-')
            ? TxInclusionStrategy.TendermintEventAndPoll
            : TxInclusionStrategy.TendermintEvent,
          eventInclusion: {
            rpcEndpoint: 'http://unused.invalid',
            onFallback,
            webSocketFactory: () => {
              if (stage === 'factory') throw dependencyError
              socket = new ControlledWebSocket()
              if (stage === 'subscribe')
                vi.spyOn(socket, 'send').mockImplementation(() => {
                  throw dependencyError
                })
              return socket as unknown as WebSocket
            },
          },
        },
      })
      try {
        let settled = false
        const pending = waiter.wait().finally(() => {
          settled = true
        })
        const assertion = expect(pending).resolves.toEqual(response)
        void assertion.catch(() => undefined)
        if (stage === 'dual-poll') {
          await new Promise<void>((resolve) => setImmediate(resolve))
          expect(settled).toBe(false)
          expect(socket?.closed).toBe(false)
        }
        socket?.emitTx(txHash)
        if (stage === 'dual-event') {
          await new Promise<void>((resolve) => setImmediate(resolve))
          expect(settled).toBe(false)
          pollResult.resolve(response)
        }
        await assertion
        expect(controller.signal.aborted).toBe(false)
        expect(poll).toHaveBeenCalledOnce()
        expect(onFallback).toHaveBeenCalledTimes(stage === 'dual-poll' ? 0 : 1)
        expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
      } finally {
        waiter.close()
      }
    },
  )
})

describe('tx observation cancellation: dual inclusion', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('close settles both branches, closes the socket and rejects wait-after-close', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    let pollSignal: AbortSignal | undefined
    const fetchTx = vi.spyOn(api as any, 'fetchTx')

    vi.spyOn(api, 'fetchTxPoll').mockImplementation(async ({ abortSignal }) => {
      pollSignal = abortSignal

      return await new Promise<TxResponse>(() => {
        // Deliberately ignores cancellation.
      })
    })

    const waiter = await prepareEventInclusion({
      api,
      txHash,
      socket,
      strategy: TxInclusionStrategy.TendermintEventAndPoll,
    })
    const waitPromise = waiter.wait()

    await flushMicrotasks()

    expect(pollSignal?.aborted).toBe(false)

    waiter.close()

    await expectAbortError(waitPromise)
    await expectAbortError(waiter.wait())
    expect(pollSignal?.aborted).toBe(true)
    expect(socket.readyState).toBe(3)
    expect(fetchTx).not.toHaveBeenCalled()

    socket.emitTx(txHash)
    await flushMicrotasks()

    await expectAbortError(waitPromise)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('external abort preserves the reason and cancels both branches', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const controller = new AbortController()
    const reason = { source: 'dual-abort' }
    const onFallback = vi.fn()
    let pollSignal: AbortSignal | undefined

    vi.spyOn(api, 'fetchTxPoll').mockImplementation(async ({ abortSignal }) => {
      pollSignal = abortSignal

      return await new Promise<TxResponse>(() => {
        // Never resolves.
      })
    })

    const waiter = await prepareEventInclusion({
      api,
      txHash,
      socket,
      signal: controller.signal,
      strategy: TxInclusionStrategy.TendermintEventAndPoll,
      onFallback,
    })
    const waitPromise = waiter.wait()

    await flushMicrotasks()
    controller.abort(reason)

    await expectAbortError(waitPromise, reason)
    expect(pollSignal?.aborted).toBe(true)
    expect(socket.readyState).toBe(3)
    expect(onFallback).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('a poll winner cancels the event final fetch without changing the result', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txHash = makeTxHash()
    const socket = new ControlledWebSocket()
    const pollTx = makeTxResponse('POLL_WINNER')
    const pollDeferred = makeDeferred<TxResponse>()
    let eventFetchSignal: AbortSignal | undefined

    vi.spyOn(api, 'fetchTxPoll').mockReturnValue(pollDeferred.promise)
    vi.spyOn(api as any, 'fetchTx').mockImplementation((async (
      _hash: string,
      options?: RequestOptions,
    ) => {
      eventFetchSignal = options?.signal as AbortSignal

      return await new Promise<TxResponse>(() => {
        // Event branch final fetch must be cancelled by the poll winner.
      })
    }) as any)

    const waiter = await prepareEventInclusion({
      api,
      txHash,
      socket,
      strategy: TxInclusionStrategy.TendermintEventAndPoll,
    })
    const waitPromise = waiter.wait()

    socket.emitTx(txHash)
    await flushMicrotasks()

    expect(eventFetchSignal?.aborted).toBe(false)

    pollDeferred.resolve(pollTx)

    await expect(waitPromise).resolves.toBe(pollTx)
    expect(eventFetchSignal?.aborted).toBe(true)
    expect(socket.readyState).toBe(3)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('dual fetch waits for a pending branch and prefers `a` over a faster `b`', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const aTx = makeTxResponse('BRANCH_A')
    const bTx = makeTxResponse('BRANCH_B')
    const aDeferred = makeDeferred<TxResponse>()
    let calls = 0
    let settled = false

    vi.spyOn(api as any, 'fetchTx').mockImplementation((async (
      _txHash: string,
    ) => {
      calls += 1

      if (calls === 1) {
        return await aDeferred.promise
      }

      return bTx
    }) as any)

    const promise = api.fetchTxPoll({
      txHash: 'DUAL_ORDER',
      timeout: 10000,
      pollingInterval: 0,
    })

    promise.then(
      () => {
        settled = true
      },
      () => {
        settled = true
      },
    )

    await vi.advanceTimersByTimeAsync(300)

    // Branch b has returned, but branch a is still pending: Promise.all
    // semantics require waiting for both and preferring a.
    expect(calls).toBe(2)
    expect(settled).toBe(false)

    aDeferred.resolve(aTx)

    await expect(promise).resolves.toBe(aTx)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not hide a transaction failure behind an earlier branch success', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const aTx = makeTxResponse('EARLY_SUCCESS')
    const txError = new TransactionException(new Error('execution reverted'), {
      contextCode: 5,
      contextModule: 'sdk',
    })
    let calls = 0

    vi.spyOn(api as any, 'fetchTx').mockImplementation((async () => {
      calls += 1

      if (calls === 1) {
        return aTx
      }

      throw txError
    }) as any)

    const promise = api.fetchTxPoll({
      txHash: 'EARLY_SUCCESS_LATE_FAILURE',
      timeout: 10000,
      pollingInterval: 0,
    })
    const assertion = expect(promise).rejects.toBe(txError)

    await vi.advanceTimersByTimeAsync(300)
    await assertion
    expect(vi.getTimerCount()).toBe(0)
  })

  it('a transaction failure remains terminal even before the other branch starts', async () => {
    vi.useFakeTimers()

    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txError = new TransactionException(new Error('execution reverted'), {
      contextCode: 5,
      contextModule: 'sdk',
    })

    vi.spyOn(api as any, 'fetchTx').mockRejectedValue(txError)

    const promise = api.fetchTxPoll({
      txHash: 'FAILED_TX',
      timeout: 10000,
      pollingInterval: 0,
    })
    const assertion = expect(promise).rejects.toBe(txError)

    await vi.advanceTimersByTimeAsync(0)
    await assertion
    expect(vi.getTimerCount()).toBe(0)
  })

  it('propagates onFallback errors, cancels polling and never leaves the parent pending', async () => {
    vi.useFakeTimers()

    const unhandled: unknown[] = []
    const onUnhandled = (error: unknown) => unhandled.push(error)
    process.on('unhandledRejection', onUnhandled)

    try {
      const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
      const txHash = makeTxHash()
      const socket = new ControlledWebSocket()
      const fallbackError = new Error('onFallback boom')
      let pollSignal: AbortSignal | undefined

      vi.spyOn(api, 'fetchTxPoll').mockImplementation(
        async ({ abortSignal }) => {
          pollSignal = abortSignal

          return await new Promise<TxResponse>((_resolve, reject) => {
            abortSignal?.addEventListener(
              'abort',
              () => reject(new Error('poll aborted')),
              { once: true },
            )
          })
        },
      )

      const waiter = await api.prepareTxInclusionWait({
        txHash,
        timeout: 5000,
        options: {
          inclusionStrategy: TxInclusionStrategy.TendermintEventAndPoll,
          eventInclusion: {
            rpcEndpoint: 'http://localhost:26657',
            timeout: 50,
            onFallback: () => {
              throw fallbackError
            },
            webSocketFactory: () => socket as unknown as WebSocket,
          },
        },
      })
      const waitPromise = waiter.wait()
      const assertion = expect(waitPromise).rejects.toBe(fallbackError)

      await flushMicrotasks()

      expect(pollSignal?.aborted).toBe(false)

      await vi.advanceTimersByTimeAsync(50)
      await assertion

      expect(pollSignal?.aborted).toBe(true)
      expect(socket.readyState).toBe(3)

      await vi.advanceTimersByTimeAsync(0)
      await flushMicrotasks()

      expect(unhandled).toEqual([])
      expect(vi.getTimerCount()).toBe(0)
    } finally {
      process.off('unhandledRejection', onUnhandled)
    }
  })
})

// ---------------------------------------------------------------------------
// Broadcast inclusion observation
// ---------------------------------------------------------------------------

describe('tx observation cancellation: broadcast inclusion', () => {
  describe.each(['REST', 'gRPC'])(
    '%s pre-submission cancellation',
    (transport) => {
      const createApi = () =>
        transport === 'REST'
          ? new TxRestApi('https://lcd.injective.network')
          : new TxGrpcApi('https://sentry.tm.injective.network:443')

      it.each(['plain', 'decorated'] as const)(
        'retains recovery information for a %s onBroadcast cancellation',
        async (shape) => {
          const api = createApi()
          const txHash = makeTxHash()
          const reason = { source: 'onBroadcast' }
          const cancellation =
            shape === 'decorated'
              ? new TxObservationAbortError(txHash, reason)
              : new AbortError(reason)
          const controller = new AbortController()
          vi.spyOn(
            api as any,
            api instanceof TxRestApi ? 'broadcastTx' : 'executeGrpcCall',
          ).mockResolvedValue({
            tx_response: { txhash: txHash, code: 0 },
            txResponse: { txhash: txHash, code: 0 },
          })
          const poll = vi.spyOn(api, 'fetchTxPoll')
          const error = await api
            .broadcast(makeTxRaw(), {
              signal: controller.signal,
              onBroadcast: () => {
                throw cancellation
              },
            })
            .catch((e: unknown) => e)
          expect(error).toBeInstanceOf(TxObservationAbortError)
          expect(error).toMatchObject({ txHash, reason })
          if (shape === 'decorated') expect(error).toBe(cancellation)
          expect(poll).not.toHaveBeenCalled()
          expect(getEventListeners(controller.signal, 'abort')).toHaveLength(0)
        },
      )

      it.each(
        (
          ['requestOptions', 'signal', 'abortSignal', 'eventInclusion'] as const
        ).flatMap((source) =>
          ['synchronous', 'microtask'].map((timing) => ({ source, timing })),
        ),
      )(
        'skips submission for $source cancellation in the $timing gap',
        async ({ source, timing }) => {
          const api = createApi()
          const controller = new AbortController()
          const onBroadcast = vi.fn()
          const options: TxClientBroadcastOptions = { onBroadcast }
          const requestOptions: RequestOptions = {}

          if (source === 'requestOptions') {
            requestOptions.signal = controller.signal
          } else if (source === 'eventInclusion') {
            options.eventInclusion = { signal: controller.signal }
          } else {
            options[source] = controller.signal
          }

          const broadcast = vi
            .spyOn(
              api as any,
              api instanceof TxRestApi ? 'broadcastTx' : 'executeGrpcCall',
            )
            .mockResolvedValue({
              tx_response: { txhash: makeTxHash(), code: 0 },
              txResponse: { txhash: makeTxHash(), code: 0 },
            })
          const poll = vi.spyOn(api, 'fetchTxPoll')
          const reason = { source, timing }
          const pending = api.broadcast(makeTxRaw(), options, requestOptions)

          if (timing === 'microtask') {
            queueMicrotask(() => controller.abort(reason))
          } else {
            controller.abort(reason)
          }

          await expectAbortError(pending, reason)
          await expect(pending).rejects.not.toHaveProperty('txHash')
          expect(broadcast).not.toHaveBeenCalled()
          expect(onBroadcast).not.toHaveBeenCalled()
          expect(poll).not.toHaveBeenCalled()
        },
      )

      it('closes a prepared event waiter when cancellation precedes submission', async () => {
        const api = createApi()
        const controller = new AbortController()
        const socket = new ControlledWebSocket()
        const prepare = api.prepareTxInclusionWait.bind(api)
        vi.spyOn(api, 'prepareTxInclusionWait').mockImplementation(
          async (...args) => {
            const waiter = await prepare(...args)
            controller.abort('prepared but not submitted')

            return waiter
          },
        )
        const broadcast = vi
          .spyOn(
            api as any,
            api instanceof TxRestApi ? 'broadcastTx' : 'executeGrpcCall',
          )
          .mockRejectedValue(new Error('unexpected broadcast'))
        const onFallback = vi.fn()
        const pending = api.broadcast(
          makeTxRaw(),
          {
            inclusionStrategy: TxInclusionStrategy.TendermintEvent,
            eventInclusion: {
              rpcEndpoint: 'http://localhost:26657',
              webSocketFactory: () => socket as unknown as WebSocket,
              onFallback,
            },
          },
          { signal: controller.signal },
        )

        await expectAbortError(pending, 'prepared but not submitted')
        await expect(pending).rejects.not.toHaveProperty('txHash')
        expect(broadcast).not.toHaveBeenCalled()
        expect(onFallback).not.toHaveBeenCalled()
        expect(socket.closed).toBe(true)
      })

      it('preserves the first cancellation reason when multiple sources abort before submission', async () => {
        const api = createApi()
        const first = new AbortController()
        const second = new AbortController()
        const broadcast = vi
          .spyOn(
            api as any,
            api instanceof TxRestApi ? 'broadcastTx' : 'executeGrpcCall',
          )
          .mockRejectedValue(new Error('unexpected broadcast'))
        const pending = api.broadcast(
          makeTxRaw(),
          {
            abortSignal: first.signal,
          },
          { signal: second.signal },
        )

        first.abort('first cancellation')
        second.abort('second cancellation')

        await expectAbortError(pending, 'first cancellation')
        expect(broadcast).not.toHaveBeenCalled()
      })

      it.each(['success', 'failure'])(
        'releases composed signal listeners after broadcast %s',
        async (outcome) => {
          const api = createApi()
          const first = new AbortController()
          const second = new AbortController()
          const tx = makeTxResponse(makeTxHash())
          const broadcast = vi.spyOn(
            api as any,
            api instanceof TxRestApi ? 'broadcastTx' : 'executeGrpcCall',
          )

          if (outcome === 'success') {
            broadcast.mockResolvedValue({
              tx_response: { txhash: tx.txHash, code: 0 },
              txResponse: { txhash: tx.txHash, code: 0 },
            })
          } else {
            broadcast.mockRejectedValue(new Error('mutation failed'))
          }
          vi.spyOn(api, 'fetchTxPoll').mockResolvedValue(tx)
          const pending = api.broadcast(
            makeTxRaw(),
            {
              signal: first.signal,
            },
            { signal: second.signal },
          )

          if (outcome === 'success') {
            await expect(pending).resolves.toBe(tx)
          } else {
            await expect(pending).rejects.toThrow('mutation failed')
          }

          for (const controller of [first, second]) {
            expect(controller.signal.aborted).toBe(false)
            expect(getEventListeners(controller.signal, 'abort')).toHaveLength(
              0,
            )
          }
        },
      )
    },
  )

  it.each([
    ['REST', 'pre-aborted'],
    ['REST', 'handshake'],
    ['gRPC', 'pre-aborted'],
    ['gRPC', 'handshake'],
  ])(
    '%s returns plain AbortError for %s preparation without broadcasting',
    async (transport, phase) => {
      const api =
        transport === 'REST'
          ? new TxRestApi('https://lcd.injective.network')
          : new TxGrpcApi('https://sentry.tm.injective.network:443')
      const controller = new AbortController()
      const socket = new ControlledWebSocket({ autoOpen: false })
      const webSocketFactory = vi.fn(() => socket as unknown as WebSocket)
      const onBroadcast = vi.fn()
      const onFallback = vi.fn()
      const broadcast = vi
        .spyOn(
          api as any,
          api instanceof TxRestApi ? 'broadcastTx' : 'executeGrpcCall',
        )
        .mockRejectedValue(new Error('unexpected broadcast'))
      const poll = vi.spyOn(api, 'fetchTxPoll')
      const reason = { source: 'cancel preparation' }

      if (phase === 'pre-aborted') {
        controller.abort(reason)
      }

      const promise = api.broadcast(
        makeTxRaw(),
        {
          onBroadcast,
          inclusionStrategy: TxInclusionStrategy.TendermintEvent,
          eventInclusion: {
            rpcEndpoint: 'http://localhost:26657',
            webSocketFactory,
            onFallback,
          },
        },
        { signal: controller.signal },
      )

      if (phase === 'handshake') {
        expect(webSocketFactory).toHaveBeenCalledOnce()
        controller.abort(reason)
      }

      await expect(promise).rejects.toBeInstanceOf(AbortError)
      await expect(promise).rejects.not.toBeInstanceOf(TxObservationAbortError)
      await expect(promise).rejects.not.toHaveProperty('txHash')
      await expectAbortError(promise, reason)
      expect(broadcast).not.toHaveBeenCalled()
      expect(onBroadcast).not.toHaveBeenCalled()
      expect(onFallback).not.toHaveBeenCalled()
      expect(poll).not.toHaveBeenCalled()

      if (phase === 'pre-aborted') {
        expect(webSocketFactory).not.toHaveBeenCalled()
      } else {
        expect(socket.closed).toBe(true)
      }
    },
  )

  it.each([
    ['REST', 'poll'],
    ['REST', 'broadcast'],
    ['gRPC', 'poll'],
    ['gRPC', 'broadcast'],
  ])(
    '%s preserves the txHash when aborting during %s',
    async (transport, phase) => {
      const api =
        transport === 'REST'
          ? new TxRestApi('https://lcd.injective.network')
          : new TxGrpcApi('https://sentry.tm.injective.network:443')
      const controller = new AbortController()
      const txRaw = makeTxRaw()
      const serverTxHash = 'SERVER_HASH'
      const response =
        api instanceof TxRestApi
          ? { tx_response: { txhash: serverTxHash, code: 0 } }
          : { txResponse: { txhash: serverTxHash, code: 0 } }
      const mutation = makeDeferred<typeof response>()
      const broadcast = vi
        .spyOn(
          api as any,
          api instanceof TxRestApi ? 'broadcastTx' : 'executeGrpcCall',
        )
        .mockReturnValue(mutation.promise)
      const poll = vi
        .spyOn(api, 'fetchTxPoll')
        .mockImplementation(() => new Promise(() => {}))
      const onBroadcast = vi.fn()
      const promise = api.broadcast(
        txRaw,
        { onBroadcast },
        { signal: controller.signal },
      )
      const assertion = expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        code: 'ERR_CANCELED',
        reason: 'stop observation',
        txHash: serverTxHash,
      })

      await vi.waitFor(() => expect(broadcast).toHaveBeenCalledOnce())

      if (phase === 'poll') {
        mutation.resolve(response)
        await vi.waitFor(() => expect(poll).toHaveBeenCalledOnce())
      }

      controller.abort('stop observation')
      mutation.resolve(response)

      await assertion
      await expect(promise).rejects.toBeInstanceOf(TxObservationAbortError)
      expect(onBroadcast).toHaveBeenCalledWith(serverTxHash)
      expect(broadcast).toHaveBeenCalledOnce()
    },
  )

  afterEach(() => {
    vi.useRealTimers()
  })

  it('aborts inclusion observation without cancelling or wrapping the broadcast', async () => {
    const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
    const txRaw = CosmosTxV1Beta1TxPb.TxRaw.create({
      bodyBytes: new Uint8Array([1]),
      authInfoBytes: new Uint8Array([2]),
      signatures: [new Uint8Array([3])],
    })
    const txHash = TxClient.hash(txRaw)
    const controller = new AbortController()
    const reason = new Error('broadcast inclusion abort')
    let pollSignal: AbortSignal | undefined

    const executeSpy = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        txResponse: {
          txhash: txHash,
          code: 0,
          rawLog: '',
          codespace: '',
          height: '0',
          gasWanted: '0',
          gasUsed: '0',
        },
      })

    vi.spyOn(api, 'fetchTxPoll').mockImplementation(async ({ abortSignal }) => {
      pollSignal = abortSignal

      return await new Promise<TxResponse>(() => {
        // Inclusion observation deliberately ignores cancellation.
      })
    })

    const promise = api.broadcast(
      txRaw,
      { inclusionStrategy: TxInclusionStrategy.Poll },
      { signal: controller.signal },
    )

    await flushMicrotasks()

    expect(pollSignal?.aborted).toBe(false)

    controller.abort(reason)

    await expectAbortError(promise, reason)
    expect(pollSignal?.aborted).toBe(true)

    // The mutation RPC is intentionally invoked without the observation signal.
    expect(executeSpy).toHaveBeenCalledTimes(1)
    expect(executeSpy.mock.calls[0]).toHaveLength(2)
  })
})

// ---------------------------------------------------------------------------
// Exposed helper
// ---------------------------------------------------------------------------

describe('tx observation cancellation: waitTxBroadcasted', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('forwards and composes cancellation into waitForTxInclusion', async () => {
    const controller = new AbortController()
    const requestController = new AbortController()
    const reason = new Error('helper abort')
    let forwardedSignal: AbortSignal | undefined
    const waitSpy = vi
      .spyOn(TxGrpcApi.prototype, 'waitForTxInclusion')
      .mockImplementation(async (args) => {
        forwardedSignal = args.signal

        return await new Promise<TxResponse>((_resolve, reject) => {
          args.signal?.addEventListener(
            'abort',
            () => {
              reject(
                Object.assign(new Error(), {
                  name: 'AbortError',
                  code: 'ERR_CANCELED',
                  reason: args.signal?.reason,
                }),
              )
            },
            { once: true },
          )
        })
      })

    const promise = waitTxBroadcasted(
      'WAIT_HELPER',
      {
        endpoints: { grpc: 'https://grpc', rest: 'https://rest' },
        txTimeout: 1,
        signal: controller.signal,
      },
      { signal: requestController.signal },
    )

    await flushMicrotasks()

    expect(waitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ txHash: 'WAIT_HELPER' }),
      { signal: requestController.signal },
    )
    expect(forwardedSignal).toBeDefined()
    expect(forwardedSignal?.aborted).toBe(false)

    controller.abort(reason)

    await expectAbortError(promise, reason)
  })
})

// ---------------------------------------------------------------------------
// No unhandled rejections from closing unpublished waits
// ---------------------------------------------------------------------------

describe('tx observation cancellation: resource hygiene', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('closing an event waiter before wait does not leak unhandled rejections', async () => {
    const unhandled: unknown[] = []
    const onUnhandled = (error: unknown) => unhandled.push(error)

    process.on('unhandledRejection', onUnhandled)

    try {
      const api = new TxGrpcApi('https://sentry.tm.injective.network:443')
      const txHash = makeTxHash()
      const socket = new ControlledWebSocket()
      const waiter = await prepareEventInclusion({ api, txHash, socket })

      waiter.close()

      await new Promise((resolve) => setImmediate(resolve))
      await flushMicrotasks()

      expect(unhandled).toEqual([])
      expect(socket.readyState).toBe(3)
    } finally {
      process.off('unhandledRejection', onUnhandled)
    }
  })

  it('does not surface a gRPC/HTTP not-found error when polling was cancelled', async () => {
    const api = new TxRestApi('https://lcd.injective.network')
    const controller = new AbortController()
    const reason = new Error('cancel before not found')
    const notFound = new HttpRequestException(new Error('not found'), {
      context: 'TxRestApi',
      contextModule: 'fetch-tx',
    })

    vi.spyOn(api, 'fetchTx').mockRejectedValue(notFound)

    const promise = api.fetchTxPoll({
      txHash: 'NOT_FOUND_CANCEL',
      signal: controller.signal,
      timeout: 5000,
    })

    await flushMicrotasks()
    controller.abort(reason)

    await expectAbortError(promise, reason)
  })
})
