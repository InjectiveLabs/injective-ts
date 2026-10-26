import { StatusCodes } from 'http-status-codes'
import { HttpRequestException } from '@injectivelabs/exceptions'
import { AbortError } from '../abort.js'
import HttpRestClient from './HttpRestClient.js'
import type {
  AxiosAdapter,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'

const flushMicrotasks = async () => {
  for (let index = 0; index < 10; index += 1) {
    await Promise.resolve()
  }
}

const createDeferred = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })

  return { promise, resolve, reject }
}

const createResponse = <T>(
  config: InternalAxiosRequestConfig,
  data: T,
): AxiosResponse<T> => ({
  config,
  data,
  headers: {},
  status: 200,
  statusText: 'OK',
})

const createAdapter = <T>(data: T) => {
  const adapter: AxiosAdapter = async (config) => createResponse(config, data)

  return { adapter }
}

const createPendingAdapter = () => {
  const calls: InternalAxiosRequestConfig[] = []

  const adapter: AxiosAdapter = (config) => {
    calls.push(config)

    return new Promise((_resolve, reject) => {
      const signal = config.signal as AbortSignal | undefined

      const onAbort = () => {
        reject(
          Object.assign(new Error('canceled'), {
            config,
            code: 'ERR_CANCELED',
            name: 'CanceledError',
            reason: signal?.reason,
          }),
        )
      }

      if (signal?.aborted) {
        onAbort()

        return
      }

      signal?.addEventListener('abort', onAbort, { once: true })
    })
  }

  return { adapter, calls }
}

const createServerError = (
  config: InternalAxiosRequestConfig,
  status: number,
  message = 'server failure',
) =>
  Object.assign(new Error(message), {
    config,
    isAxiosError: true,
    response: {
      config,
      data: { message },
      headers: {},
      status,
      statusText: 'Server Error',
    },
  })

const createRejectingAdapter = (
  factory: (config: InternalAxiosRequestConfig) => unknown,
) => {
  const calls: InternalAxiosRequestConfig[] = []

  const adapter: AxiosAdapter = async (config) => {
    calls.push(config)

    throw factory(config)
  }

  return { adapter, calls }
}

describe('HttpRestClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('requests', () => {
    it('forwards final per-call config and preserves server status errors', async () => {
      const { adapter, calls } = createRejectingAdapter((config) =>
        createServerError(config, 503, 'service unavailable'),
      )
      const client = new HttpRestClient('http://api.test', { adapter })

      try {
        await client.get('/path', {}, { headers: { 'X-Call': 'yes' } })
        expect.unreachable('Expected the request to fail')
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpRequestException)
        expect(error).not.toBeInstanceOf(AbortError)
        expect((error as HttpRequestException).code).toBe(503)
        expect((error as HttpRequestException).originalMessage).toBe(
          'service unavailable',
        )
      }

      expect(calls[0].headers.get('X-Call')).toBe('yes')
    })

    it('does not treat arbitrary server statuses as local cancellation', async () => {
      for (const status of [400, 499, 503]) {
        const { adapter } = createRejectingAdapter((config) =>
          createServerError(config, status),
        )
        const client = new HttpRestClient('http://api.test', { adapter })

        try {
          await client.get('/path')
          expect.unreachable('Expected the request to fail')
        } catch (error: unknown) {
          expect(error).toBeInstanceOf(HttpRequestException)
          expect(error).not.toBeInstanceOf(AbortError)
          expect((error as HttpRequestException).code).toBe(status)
        }
      }
    })

    it('keeps existing request-timeout handling separate from cancellation', async () => {
      const { adapter } = createRejectingAdapter((config) =>
        Object.assign(new Error('timeout'), {
          code: 'ECONNABORTED',
          config,
          isAxiosError: true,
        }),
      )
      const client = new HttpRestClient('http://api.test', { adapter })

      try {
        await client.get('/path')
        expect.unreachable('Expected the request to fail')
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpRequestException)
        expect(error).not.toBeInstanceOf(AbortError)
        expect((error as HttpRequestException).code).toBe(
          StatusCodes.REQUEST_TOO_LONG,
        )
      }
    })

    it('aborts an active get request with the caller reason', async () => {
      const controller = new AbortController()
      const { adapter, calls } = createPendingAdapter()
      const client = new HttpRestClient('http://api.test', { adapter })
      const reason = { source: 'get' }

      const promise = client.get('/path', {}, { signal: controller.signal })

      await vi.waitFor(() => expect(calls).toHaveLength(1))

      controller.abort(reason)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        code: 'ERR_CANCELED',
        reason,
      })
    })

    it('aborts an active post request with the caller reason', async () => {
      const controller = new AbortController()
      const { adapter, calls } = createPendingAdapter()
      const client = new HttpRestClient('http://api.test', { adapter })
      const reason = new Error('post cancelled')

      const promise = client.post('/path', {}, { signal: controller.signal })

      await vi.waitFor(() => expect(calls).toHaveLength(1))

      controller.abort(reason)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        reason,
      })
    })

    it('rejects pre-aborted requests without dispatching them', async () => {
      const controller = new AbortController()
      const { adapter, calls } = createPendingAdapter()
      const client = new HttpRestClient('http://api.test', { adapter })

      controller.abort('already aborted')

      await expect(
        client.get('/path', {}, { signal: controller.signal }),
      ).rejects.toMatchObject({
        name: 'AbortError',
        reason: 'already aborted',
      })
      expect(calls).toHaveLength(0)
    })
  })

  describe('null per-call config', () => {
    it('preserves the pre-aborted constructor reason for get', async () => {
      const controller = new AbortController()
      const reason = { source: 'null get constructor' }
      const { adapter, calls } = createPendingAdapter()
      const client = new HttpRestClient('http://api.test', {
        adapter,
        signal: controller.signal,
      })

      controller.abort(reason)

      await expect(client.get('/path', {}, null as any)).rejects.toMatchObject({
        name: 'AbortError',
        code: 'ERR_CANCELED',
        reason,
      })
      expect(calls).toHaveLength(0)
    })

    it('preserves the pre-aborted setConfig reason for post', async () => {
      const controller = new AbortController()
      const reason = { source: 'null post setConfig' }
      const { adapter, calls } = createPendingAdapter()
      const client = new HttpRestClient('http://api.test', { adapter })

      client.setConfig({ signal: controller.signal })
      controller.abort(reason)

      await expect(client.post('/path', {}, null as any)).rejects.toMatchObject(
        {
          name: 'AbortError',
          code: 'ERR_CANCELED',
          reason,
        },
      )
      expect(calls).toHaveLength(0)
    })

    it('preserves the active constructor abort reason for get', async () => {
      const controller = new AbortController()
      const reason = { source: 'active null get' }
      const { adapter, calls } = createPendingAdapter()
      const client = new HttpRestClient('http://api.test', {
        adapter,
        signal: controller.signal,
      })
      const promise = client.get('/path', {}, null as any)

      await vi.waitFor(() => expect(calls).toHaveLength(1))

      controller.abort(reason)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        code: 'ERR_CANCELED',
        reason,
      })
    })

    it('preserves the active setConfig abort reason for post', async () => {
      const controller = new AbortController()
      const reason = { source: 'active null post' }
      const { adapter, calls } = createPendingAdapter()
      const client = new HttpRestClient('http://api.test', { adapter })

      client.setConfig({ signal: controller.signal })

      const promise = client.post('/path', {}, null as any)

      await vi.waitFor(() => expect(calls).toHaveLength(1))

      controller.abort(reason)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        code: 'ERR_CANCELED',
        reason,
      })
    })

    it('preserves HttpRequestException handling for ordinary get/post errors', async () => {
      const { adapter } = createRejectingAdapter((config) =>
        createServerError(config, 503, 'service unavailable'),
      )
      const client = new HttpRestClient('http://api.test', { adapter })

      for (const request of [
        () => client.get('/path', {}, null as any),
        () => client.post('/path', {}, null as any),
      ]) {
        try {
          await request()
          expect.unreachable('Expected the request to fail')
        } catch (error: unknown) {
          expect(error).toBeInstanceOf(HttpRequestException)
          expect(error).not.toBeInstanceOf(AbortError)
          expect(error).not.toBeInstanceOf(TypeError)
          expect((error as HttpRequestException).code).toBe(503)
          expect((error as HttpRequestException).originalMessage).toBe(
            'service unavailable',
          )
        }
      }
    })

    it('wraps non-axios ordinary get/post errors without TypeError', async () => {
      const { adapter } = createRejectingAdapter(
        () => new Error('plain failure'),
      )
      const client = new HttpRestClient('http://api.test', { adapter })

      for (const request of [
        () => client.get('/path', {}, null as any),
        () => client.post('/path', {}, null as any),
      ]) {
        try {
          await request()
          expect.unreachable('Expected the request to fail')
        } catch (error: unknown) {
          expect(error).toBeInstanceOf(HttpRequestException)
          expect(error).not.toBeInstanceOf(AbortError)
          expect(error).not.toBeInstanceOf(TypeError)
          expect((error as HttpRequestException).originalMessage).toBe(
            'plain failure',
          )
        }
      }
    })
  })

  describe('retry', () => {
    it('retries transient failures and then resolves', async () => {
      vi.useFakeTimers()

      let attempts = 0
      const retryingAdapter: AxiosAdapter = async (config) => {
        attempts += 1

        if (attempts === 1) {
          throw createServerError(config, 503, 'temporarily unavailable')
        }

        return createResponse(config, 'ok')
      }
      const client = new HttpRestClient('http://api.test', {
        adapter: retryingAdapter,
      })
      const promise = client.retry(() => client.get('/path'), 3, 10)

      await vi.runAllTimersAsync()

      await expect(promise).resolves.toMatchObject({ data: 'ok' })
      expect(attempts).toBe(2)
    })

    it('aborts during backoff without another attempt', async () => {
      vi.useFakeTimers()

      const controller = new AbortController()
      const reason = { source: 'backoff' }
      const callback = vi
        .fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('transient'))
        .mockRejectedValueOnce(new Error('should not be called'))
      const { adapter } = createAdapter('unused')
      const client = new HttpRestClient('http://api.test', { adapter })
      const promise = client.retry(callback, 3, 10000, {
        signal: controller.signal,
      })
      let settled = false

      promise.then(
        () => {
          settled = true
        },
        () => {
          settled = true
        },
      )

      await flushMicrotasks()

      controller.abort(reason)
      await flushMicrotasks()

      const settledPromptly = settled

      await vi.advanceTimersByTimeAsync(10000)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        reason,
      })
      expect(settledPromptly).toBe(true)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('aborts an active callback even when it ignores the signal', async () => {
      const controller = new AbortController()
      const reason = { source: 'active retry callback' }
      const callback = vi.fn(() => new Promise<string>(() => undefined))
      const { adapter } = createAdapter('unused')
      const client = new HttpRestClient('http://api.test', { adapter })
      const promise = client.retry(callback, 3, 10, {
        signal: controller.signal,
      })

      await flushMicrotasks()
      controller.abort(reason)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        reason,
      })
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('rejects pre-aborted retries without invoking the callback', async () => {
      const controller = new AbortController()
      const callback = vi.fn<() => Promise<string>>()
      const { adapter } = createAdapter('unused')
      const client = new HttpRestClient('http://api.test', { adapter })

      controller.abort('pre-aborted retry')

      await expect(
        client.retry(callback, 3, 10, { signal: controller.signal }),
      ).rejects.toMatchObject({
        name: 'AbortError',
        reason: 'pre-aborted retry',
      })
      expect(callback).not.toHaveBeenCalled()
    })

    it('does not retry AbortError from the callback and preserves its reason', async () => {
      const reason = { source: 'callback' }
      const error = new AbortError(reason)
      const callback = vi.fn<() => Promise<string>>().mockRejectedValue(error)
      const { adapter } = createAdapter('unused')
      const client = new HttpRestClient('http://api.test', { adapter })

      await expect(client.retry(callback, 3, 10)).rejects.toBe(error)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('retains the existing no-retry behavior for request timeouts', async () => {
      const error = new HttpRequestException(new Error('timeout'), {
        code: StatusCodes.REQUEST_TOO_LONG,
      })
      const callback = vi.fn<() => Promise<string>>().mockRejectedValue(error)
      const { adapter } = createAdapter('unused')
      const client = new HttpRestClient('http://api.test', { adapter })

      await expect(client.retry(callback, 3, 10)).rejects.toBe(error)
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('composes constructor signals into retry backoff', async () => {
      vi.useFakeTimers()

      const controller = new AbortController()
      const reason = { source: 'constructor retry' }
      const { adapter } = createAdapter('unused')
      const client = new HttpRestClient('http://api.test', {
        adapter,
        signal: controller.signal,
      })
      const promise = client.retry(
        () => Promise.reject(new Error('transient')),
        3,
        10000,
      )
      let settled = false

      promise.then(
        () => {
          settled = true
        },
        () => {
          settled = true
        },
      )

      await flushMicrotasks()

      controller.abort(reason)
      await flushMicrotasks()

      const settledPromptly = settled

      await vi.advanceTimersByTimeAsync(10000)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        reason,
      })
      expect(settledPromptly).toBe(true)
    })

    it('does not retarget an in-flight retry when shared config changes', async () => {
      vi.useFakeTimers()

      const originalController = new AbortController()
      const laterController = new AbortController()
      let attempts = 0
      const adapter: AxiosAdapter = async (config) => {
        attempts += 1

        if (attempts === 1) {
          throw createServerError(config, 503, 'temporarily unavailable')
        }

        return createResponse(config, { balances: [] })
      }
      const client = new HttpRestClient('http://api.test', {
        adapter,
        signal: originalController.signal,
      })
      const promise = client.retry(
        (requestConfig) => client.get('/path', {}, requestConfig),
        3,
        10000,
      )

      await vi.advanceTimersByTimeAsync(0)

      client.setConfig({ adapter, signal: laterController.signal })
      laterController.abort('unrelated client configuration')

      await vi.runAllTimersAsync()

      await expect(promise).resolves.toMatchObject({
        data: { balances: [] },
      })
      expect(attempts).toBe(2)
      expect(originalController.signal.aborted).toBe(false)
    })

    it('pins the absence of a signal when the retry starts uncancellable', async () => {
      vi.useFakeTimers()

      const laterController = new AbortController()
      const calls: InternalAxiosRequestConfig[] = []
      const adapter: AxiosAdapter = async (config) => {
        calls.push(config)

        if (calls.length === 1) {
          throw createServerError(config, 503, 'temporarily unavailable')
        }

        return createResponse(config, 'ok')
      }
      const client = new HttpRestClient('http://api.test', { adapter })
      const promise = client.retry(
        (requestConfig) => client.get('/path', {}, requestConfig),
        3,
        10,
      )

      await vi.advanceTimersByTimeAsync(0)

      client.setConfig({ adapter, signal: laterController.signal })
      laterController.abort('unrelated client configuration')

      await vi.runAllTimersAsync()

      await expect(promise).resolves.toMatchObject({ data: 'ok' })
      expect(calls[1].signal).toBeUndefined()
    })

    it('passes the pinned retry signal to the actual HTTP adapter', async () => {
      const controller = new AbortController()
      const reason = { source: 'adapter cancellation' }
      const { adapter, calls } = createPendingAdapter()
      const client = new HttpRestClient('http://api.test', { adapter })
      const promise = client.retry(
        (requestConfig) => client.get('/path', {}, requestConfig),
        3,
        10,
        { signal: controller.signal },
      )

      await vi.waitFor(() => expect(calls).toHaveLength(1))

      const transportSignal = calls[0].signal as AbortSignal

      expect(transportSignal).toBe(controller.signal)

      controller.abort(reason)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        reason,
      })
      expect(transportSignal.aborted).toBe(true)
    })

    it('keeps pinned cancellation across async callbacks and applies header refreshes', async () => {
      vi.useFakeTimers()

      const originalController = new AbortController()
      const laterController = new AbortController()
      const gate = createDeferred<void>()
      const gateReached = createDeferred<void>()
      const calls: InternalAxiosRequestConfig[] = []
      let attempt = 0
      const adapter: AxiosAdapter = async (config) => {
        calls.push(config)

        if (config.url === '/first') {
          throw createServerError(config, 503, 'temporarily unavailable')
        }

        return createResponse(config, { ok: true })
      }
      const client = new HttpRestClient('http://api.test', {
        adapter,
        headers: { 'X-Auth': 'old' },
        signal: originalController.signal,
      })
      const promise = client.retry(
        async (requestConfig) => {
          attempt += 1

          if (attempt === 1) {
            return client.get('/first', {}, requestConfig)
          }

          gateReached.resolve()
          await gate.promise

          return client.get('/second', {}, requestConfig)
        },
        3,
        10,
      )

      await vi.runAllTimersAsync()
      await gateReached.promise

      client.setConfig({
        adapter,
        headers: { 'X-Auth': 'refreshed' },
        signal: laterController.signal,
      })
      laterController.abort('unrelated client configuration')
      gate.resolve()

      await vi.runAllTimersAsync()

      await expect(promise).resolves.toMatchObject({ data: { ok: true } })

      const secondCall = calls.find((call) => call.url === '/second')

      expect(attempt).toBe(2)
      expect(secondCall).toBeDefined()
      expect(secondCall?.signal).toBe(originalController.signal)
      expect(secondCall?.headers.get('X-Auth')).toBe('refreshed')
      expect(originalController.signal.aborted).toBe(false)
    })

    it('gives a reentrant nested operation its own current config signal', async () => {
      const originalController = new AbortController()
      const nestedController = new AbortController()
      const signals = new Map<string, AbortSignal | undefined>()
      const adapter: AxiosAdapter = async (config) => {
        signals.set(config.url || '', config.signal as AbortSignal | undefined)

        return createResponse(config, 'ok')
      }
      const client = new HttpRestClient('http://api.test')

      client.setConfig({
        adapter,
        signal: originalController.signal,
      })

      let nestedRequest: Promise<unknown> | undefined
      const promise = client.retry(
        (requestConfig) => {
          client.setConfig({
            adapter,
            signal: nestedController.signal,
          })
          nestedRequest = client.get('/nested', {}, {})

          return client.get('/pinned', {}, requestConfig)
        },
        3,
        10,
      )

      await expect(promise).resolves.toMatchObject({ data: 'ok' })
      await expect(nestedRequest).resolves.toMatchObject({ data: 'ok' })

      expect(signals.get('/nested')).toBe(nestedController.signal)
      expect(signals.get('/pinned')).toBe(originalController.signal)
    })

    it('keeps legacy zero-argument callbacks working', async () => {
      const callback = vi.fn<() => Promise<string>>(() =>
        Promise.resolve('legacy result'),
      )
      const { adapter } = createAdapter('unused')
      const client = new HttpRestClient('http://api.test', { adapter })

      await expect(client.retry(callback, 3, 10)).resolves.toBe('legacy result')
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('keeps Function-typed callbacks source-compatible', async () => {
      const callback: Function = () => Promise.resolve('function result')
      const { adapter } = createAdapter('unused')
      const client = new HttpRestClient('http://api.test', { adapter })

      await expect(client.retry(callback, 3, 10)).resolves.toBe(
        'function result',
      )
    })

    it('keeps server failures distinct from scoped cancellation', async () => {
      const controller = new AbortController()
      const { adapter } = createRejectingAdapter((config) =>
        createServerError(config, 503, 'server unavailable'),
      )
      const client = new HttpRestClient('http://api.test', { adapter })
      const promise = client.retry(
        (requestConfig) => client.get('/path', {}, requestConfig),
        1,
        10,
        { signal: controller.signal },
      )

      try {
        await promise
        expect.unreachable('Expected the request to fail')
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(HttpRequestException)
        expect(error).not.toBeInstanceOf(AbortError)
        expect((error as HttpRequestException).code).toBe(503)
      }
    })

    it('does not acquire another request signal while retrying', async () => {
      vi.useFakeTimers()

      const retryController = new AbortController()
      const otherController = new AbortController()
      const callback = vi
        .fn<() => Promise<string>>()
        .mockRejectedValueOnce(new Error('transient'))
        .mockResolvedValue('unexpected')
      const { adapter } = createAdapter('unused')
      const client = new HttpRestClient('http://api.test', { adapter })
      const promise = client.retry(callback, 3, 10000, {
        signal: retryController.signal,
      })
      let settled = false

      promise.then(
        () => {
          settled = true
        },
        () => {
          settled = true
        },
      )

      await flushMicrotasks()

      client.setConfig({ signal: otherController.signal })
      otherController.abort('other request')

      await flushMicrotasks()
      expect(settled).toBe(false)

      retryController.abort('own request')

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        reason: 'own request',
      })
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})
