import { getEventListeners } from 'node:events'
import { AbortError } from '@injectivelabs/utils'
import { RpcError } from '@protobuf-ts/runtime-rpc'
import { it, vi, expect, describe, afterEach } from 'vitest'
import {
  TransactionException,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import BaseGrpcConsumer from './BaseGrpcConsumer.js'
import { GrpcStatusCode } from '../../types/stream.js'
import type { RetryOptions } from '@injectivelabs/utils'
import type { UnaryCall, RpcOptions } from '@protobuf-ts/runtime-rpc'

const flushMicrotasks = async () => {
  for (let index = 0; index < 10; index += 1) {
    await Promise.resolve()
  }
}

const createCall = <TResponse extends object>(
  response: Promise<TResponse>,
): UnaryCall<object, TResponse> =>
  ({ response }) as unknown as UnaryCall<object, TResponse>

class TestGrpcConsumer extends BaseGrpcConsumer {
  protected module: string = 'test-module'

  public retryCall<TResponse>(
    grpcCall: () => Promise<TResponse>,
    retries?: number,
    delay?: number,
    signal?: AbortSignal,
  ) {
    return this.retry(grpcCall, retries, delay, signal)
  }

  public retryWithOptions<TResponse>(
    grpcCall: () => Promise<TResponse>,
    options?: RetryOptions,
  ) {
    return this.retry(grpcCall, options)
  }

  public executeCall<
    TRequest extends object = object,
    TResponse extends object = object,
  >(
    request: TRequest,
    clientMethod: (
      req: TRequest,
      options?: RpcOptions,
    ) => UnaryCall<TRequest, TResponse>,
    options?: { noRetry?: boolean; signal?: AbortSignal },
  ) {
    return this.executeGrpcCall(request, clientMethod, options)
  }

  public throwGrpcError(error: unknown, context: string): never {
    return this.handleGrpcError(error, context)
  }
}

describe('BaseGrpcConsumer', () => {
  const consumer = new TestGrpcConsumer('http://localhost:9090')

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('retry', () => {
    it('accepts retry options and leaves no listeners after a successful retry', async () => {
      vi.useFakeTimers()
      const controller = new AbortController()
      const grpcCall = vi
        .fn<() => Promise<string>>()
        .mockRejectedValueOnce(new RpcError('unavailable', 'UNAVAILABLE'))
        .mockResolvedValue('ok')
      const promise = consumer.retryWithOptions(grpcCall, {
        retries: 2,
        delay: 10,
        signal: controller.signal,
      })

      await vi.runAllTimersAsync()
      await expect(promise).resolves.toBe('ok')
      expect(grpcCall).toHaveBeenCalledTimes(2)
      expect(getEventListeners(controller.signal, 'abort')).toEqual([])
      expect(vi.getTimerCount()).toBe(0)
    })

    it('settles an active retry callback promptly on abort and observes its late rejection', async () => {
      const controller = new AbortController()
      let rejectCall!: (error: Error) => void
      const grpcCall = vi.fn(
        () =>
          new Promise<string>((_resolve, reject) => {
            rejectCall = reject
          }),
      )
      const pending = consumer.retryCall(grpcCall, 3, 10, controller.signal)
      const assertion = expect(pending).rejects.toMatchObject({
        name: 'AbortError',
        reason: 'retry stopped',
      })

      controller.abort('retry stopped')

      await assertion
      rejectCall(new RpcError('late transport failure', 'UNAVAILABLE'))
      await flushMicrotasks()
      expect(grpcCall).toHaveBeenCalledOnce()
    })

    it('retries retryable gRPC status codes', async () => {
      vi.useFakeTimers()

      const grpcCall = vi
        .fn<() => Promise<string>>()
        .mockRejectedValueOnce(new RpcError('unavailable', 'UNAVAILABLE'))
        .mockRejectedValueOnce(new RpcError('rate limited', '8'))
        .mockResolvedValueOnce('ok')

      const promise = consumer.retryCall(grpcCall, 3, 10)
      const assertion = expect(promise).resolves.toBe('ok')

      await vi.runAllTimersAsync()

      await assertion
      expect(grpcCall).toHaveBeenCalledTimes(3)
    })

    it('does not retry non-retryable gRPC status codes', async () => {
      const error = new RpcError('invalid argument', 'INVALID_ARGUMENT')
      const grpcCall = vi
        .fn<() => Promise<string>>()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce('ok')

      await expect(consumer.retryCall(grpcCall, 3, 10)).rejects.toBe(error)
      expect(grpcCall).toHaveBeenCalledTimes(1)
    })

    it('does not retry generic errors', async () => {
      const error = new Error('failed')
      const grpcCall = vi
        .fn<() => Promise<string>>()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce('ok')

      await expect(consumer.retryCall(grpcCall, 3, 10)).rejects.toBe(error)
      expect(grpcCall).toHaveBeenCalledTimes(1)
    })

    it('stops retrying after the configured retry count', async () => {
      vi.useFakeTimers()

      const error = new RpcError('unavailable', 'UNAVAILABLE')
      const grpcCall = vi.fn<() => Promise<string>>().mockRejectedValue(error)

      const promise = consumer.retryCall(grpcCall, 3, 10)
      const assertion = expect(promise).rejects.toBe(error)

      await vi.runAllTimersAsync()

      await assertion
      expect(grpcCall).toHaveBeenCalledTimes(3)
    })

    it('adds retry exhaustion details to wrapped errors', async () => {
      vi.useFakeTimers()

      const error = new RpcError('unavailable', 'UNAVAILABLE')
      const grpcCall = vi.fn<() => Promise<string>>().mockRejectedValue(error)

      const promise = consumer.retryCall(grpcCall, 3, 10)
      const assertion = expect(promise).rejects.toBe(error)

      await vi.runAllTimersAsync()
      await assertion

      try {
        consumer.throwGrpcError(error, 'fetchPositions')
        expect.unreachable('Expected handleGrpcError to throw')
      } catch (e: unknown) {
        expect(e).toBeInstanceOf(GrpcUnaryRequestException)

        const exception = e as GrpcUnaryRequestException

        expect(exception.context).toBe(
          'fetchPositions (baseUrl: http://localhost:9090)',
        )
        expect(exception.metadata).toMatchObject({
          wasRetried: true,
          retryAttempt: 3,
          retryMaxAttempts: 3,
          retryDelayMs: 10,
          retryStopReason: 'exhausted',
        })
      }
    })
  })

  describe('executeGrpcCall cancellation', () => {
    const unavailable = () => new RpcError('unavailable', 'UNAVAILABLE')

    it('normalizes AbortSignal.timeout to the shared local cancellation error', async () => {
      const signal = AbortSignal.timeout(10)
      const method = vi.fn(() => createCall(new Promise<object>(() => {})))
      const promise = consumer.executeCall({}, method, { signal })

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        code: 'ERR_CANCELED',
        reason: expect.objectContaining({ name: 'TimeoutError' }),
      })
      expect(method).toHaveBeenCalledOnce()
      expect(getEventListeners(signal, 'abort')).toEqual([])
    })

    it('keeps noRetry when a cancellation signal is also supplied', async () => {
      const controller = new AbortController()
      const method = vi.fn(() => createCall(Promise.reject(unavailable())))

      await expect(
        consumer.executeCall({}, method, {
          noRetry: true,
          signal: controller.signal,
        }),
      ).rejects.toBeInstanceOf(GrpcUnaryRequestException)
      expect(method).toHaveBeenCalledOnce()
      expect(getEventListeners(controller.signal, 'abort')).toEqual([])
    })

    it('forwards only per-call overrides and composes the constructor signal', async () => {
      const constructorController = new AbortController()
      const callController = new AbortController()
      const consumer = new TestGrpcConsumer('http://localhost:9090', {
        abort: constructorController.signal,
        interceptors: [{ name: 'test-interceptor' } as any],
        meta: { 'x-base': 'one' },
      })
      let capturedOptions: RpcOptions | undefined
      const method = vi.fn((_request: object, options?: RpcOptions) => {
        capturedOptions = options

        return createCall(Promise.resolve({ ok: true }))
      })

      await expect(
        consumer.executeCall({}, method, { signal: callController.signal }),
      ).resolves.toEqual({ ok: true })

      expect(capturedOptions?.abort).toBeInstanceOf(AbortSignal)
      expect(capturedOptions?.abort).not.toBe(constructorController.signal)
      expect(capturedOptions?.abort).not.toBe(callController.signal)
      expect(capturedOptions?.interceptors).toBeUndefined()
      expect(capturedOptions?.meta).toEqual({})
    })

    it('rejects a pre-aborted per-call signal without calling the client', async () => {
      const consumer = new TestGrpcConsumer('http://localhost:9090')
      const controller = new AbortController()
      const reason = { source: 'pre-aborted call' }
      const method = vi.fn((_request: object, _options?: RpcOptions) =>
        createCall(Promise.resolve({ ok: true })),
      )

      controller.abort(reason)

      await expect(
        consumer.executeCall({}, method, { signal: controller.signal }),
      ).rejects.toMatchObject({
        name: 'AbortError',
        code: 'ERR_CANCELED',
        reason,
      })
      expect(method).not.toHaveBeenCalled()
    })

    it('rejects a pre-aborted constructor signal without calling the client', async () => {
      const controller = new AbortController()
      const reason = new Error('constructor aborted')
      const method = vi.fn((_request: object, _options?: RpcOptions) =>
        createCall(Promise.resolve({ ok: true })),
      )

      controller.abort(reason)

      const consumer = new TestGrpcConsumer('http://localhost:9090', {
        abort: controller.signal,
      })

      await expect(consumer.executeCall({}, method)).rejects.toMatchObject({
        name: 'AbortError',
        reason,
      })
      expect(method).not.toHaveBeenCalled()
    })

    it('aborts an active call with the per-call reason', async () => {
      const consumer = new TestGrpcConsumer('http://localhost:9090')
      const controller = new AbortController()
      const reason = { source: 'active call' }
      let capturedSignal: AbortSignal | undefined
      const method = vi.fn((_request: object, options?: RpcOptions) => {
        capturedSignal = options?.abort

        return createCall(
          new Promise<{ ok: boolean }>((_resolve, reject) => {
            capturedSignal?.addEventListener(
              'abort',
              () => reject(new RpcError('transport cancelled', 'CANCELLED')),
              { once: true },
            )
          }),
        )
      })

      const promise = consumer.executeCall({}, method, {
        signal: controller.signal,
      })

      expect(capturedSignal).toBeDefined()

      controller.abort(reason)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        reason,
      })
    })

    it('aborts when the constructor signal aborts even with a live per-call signal', async () => {
      const constructorController = new AbortController()
      const callController = new AbortController()
      const consumer = new TestGrpcConsumer('http://localhost:9090', {
        abort: constructorController.signal,
      })
      const reason = { source: 'constructor active' }
      let capturedSignal: AbortSignal | undefined
      const method = vi.fn((_request: object, options?: RpcOptions) => {
        capturedSignal = options?.abort

        return createCall(
          new Promise<{ ok: boolean }>((_resolve, reject) => {
            capturedSignal?.addEventListener(
              'abort',
              () => reject(new RpcError('transport cancelled', 'CANCELLED')),
              { once: true },
            )
          }),
        )
      })

      const promise = consumer.executeCall({}, method, {
        signal: callController.signal,
      })

      constructorController.abort(reason)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        reason,
      })
      expect(callController.signal.aborted).toBe(false)
    })

    it('aborts during retry backoff without another attempt', async () => {
      vi.useFakeTimers()

      const consumer = new TestGrpcConsumer('http://localhost:9090')
      const controller = new AbortController()
      const reason = { source: 'grpc backoff' }
      const method = vi
        .fn<
          (
            request: object,
            options?: RpcOptions,
          ) => UnaryCall<object, { ok: boolean }>
        >()
        .mockImplementationOnce(() => createCall(Promise.reject(unavailable())))
        .mockImplementationOnce(() => createCall(Promise.resolve({ ok: true })))
      const promise = consumer.executeCall({}, method, {
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

      await vi.advanceTimersByTimeAsync(2000)

      await expect(promise).rejects.toMatchObject({
        name: 'AbortError',
        reason,
      })
      expect(settledPromptly).toBe(true)
      expect(method).toHaveBeenCalledTimes(1)
    })

    it('retains noRetry behavior', async () => {
      const consumer = new TestGrpcConsumer('http://localhost:9090')
      const method = vi.fn((_request: object, _options?: RpcOptions) =>
        createCall(Promise.reject(unavailable())),
      )

      try {
        await consumer.executeCall({}, method, { noRetry: true })
        expect.unreachable('Expected the call to fail')
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(GrpcUnaryRequestException)
        expect(error).not.toBeInstanceOf(AbortError)
      }

      expect(method).toHaveBeenCalledTimes(1)
    })

    it('does not treat server CANCELLED status as local cancellation', async () => {
      const consumer = new TestGrpcConsumer('http://localhost:9090')
      const method = vi.fn((_request: object, _options?: RpcOptions) =>
        createCall(
          Promise.reject(new RpcError('server cancelled', 'CANCELLED')),
        ),
      )

      try {
        await consumer.executeCall({}, method)
        expect.unreachable('Expected the call to fail')
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(GrpcUnaryRequestException)
        expect(error).not.toBeInstanceOf(AbortError)
        expect((error as GrpcUnaryRequestException).code).toBe(
          GrpcStatusCode.CANCELLED,
        )
      }
    })

    it('retains retry behavior for server ABORTED status', async () => {
      vi.useFakeTimers()

      const consumer = new TestGrpcConsumer('http://localhost:9090')
      const method = vi
        .fn<
          (
            request: object,
            options?: RpcOptions,
          ) => UnaryCall<object, { ok: boolean }>
        >()
        .mockImplementationOnce(() =>
          createCall(Promise.reject(new RpcError('server aborted', 'ABORTED'))),
        )
        .mockImplementationOnce(() => createCall(Promise.resolve({ ok: true })))
      const promise = consumer.executeCall({}, method)

      const assertion = expect(promise).resolves.toEqual({ ok: true })

      await vi.runAllTimersAsync()
      await assertion

      expect(method).toHaveBeenCalledTimes(2)
    })

    it('keeps the caller reason when a synchronous client aborts then throws an abort-shaped error', async () => {
      const errorFactories = [
        () =>
          Object.assign(new Error('canceled'), {
            name: 'CanceledError',
            code: 'ERR_CANCELED',
          }),
        () => new DOMException('canceled', 'AbortError'),
      ]

      for (const createError of errorFactories) {
        const consumer = new TestGrpcConsumer('http://localhost:9090')
        const controller = new AbortController()
        const reason = { source: createError.name }
        const method = vi.fn<
          (
            request: object,
            options?: RpcOptions,
          ) => UnaryCall<object, { ok: boolean }>
        >(() => {
          controller.abort(reason)
          throw createError()
        })

        await expect(
          consumer.executeCall({}, method, { signal: controller.signal }),
        ).rejects.toMatchObject({
          name: 'AbortError',
          reason,
        })
      }
    })

    it('handles synchronous errors without losing AbortError identity', async () => {
      const consumer = new TestGrpcConsumer('http://localhost:9090')
      const syncError = new Error('synchronous failure')
      const syncMethod = vi.fn((_request: object, _options?: RpcOptions) => {
        throw syncError
      })

      try {
        await consumer.executeCall({}, syncMethod)
        expect.unreachable('Expected the call to fail')
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(GrpcUnaryRequestException)
        expect((error as GrpcUnaryRequestException).originalMessage).toBe(
          'synchronous failure',
        )
      }

      const abortReason = { source: 'synchronous abort' }
      const abortError = new AbortError(abortReason)
      const abortMethod = vi.fn((_request: object, _options?: RpcOptions) => {
        throw abortError
      })

      await expect(consumer.executeCall({}, abortMethod)).rejects.toBe(
        abortError,
      )
    })
  })

  describe('handleGrpcError', () => {
    it('preserves generic, gRPC and chain error mapping without a DOMException global', () => {
      const descriptor = Object.getOwnPropertyDescriptor(
        globalThis,
        'DOMException',
      )!
      Reflect.deleteProperty(globalThis, 'DOMException')

      try {
        expect(() =>
          consumer.throwGrpcError(new Error('network failure'), 'fetch'),
        ).toThrow(GrpcUnaryRequestException)

        try {
          consumer.throwGrpcError(
            new RpcError('does not exist', 'NOT_FOUND'),
            'fetch',
          )
          expect.unreachable('Expected handleGrpcError to throw')
        } catch (error: unknown) {
          expect(error).toBeInstanceOf(GrpcUnaryRequestException)
          expect(error).toMatchObject({ code: GrpcStatusCode.NOT_FOUND })
          expect((error as Error).message).toContain('does not exist')
        }

        expect(() =>
          consumer.throwGrpcError(
            new RpcError(
              'chain failure {key:"ABCICode" value:"100"} {key:"Codespace" value:"exchange"}',
              'INVALID_ARGUMENT',
            ),
            'simulate',
          ),
        ).toThrow(TransactionException)
      } finally {
        Object.defineProperty(globalThis, 'DOMException', descriptor)
      }
    })

    it('enriches empty RpcError messages with method and service details', () => {
      const error = new RpcError('', 'NOT_FOUND')
      error.methodName = 'PrepareFeeGrant'
      error.serviceName = 'injective_exchange_rpc.InjectiveExchangeRPC'

      try {
        consumer.throwGrpcError(error, 'prepareFeeGrant')
        expect.unreachable('Expected handleGrpcError to throw')
      } catch (e: unknown) {
        expect(e).toBeInstanceOf(GrpcUnaryRequestException)

        const exception = e as GrpcUnaryRequestException
        const message =
          'PrepareFeeGrant on injective_exchange_rpc.InjectiveExchangeRPC failed with NOT_FOUND'

        expect(exception.message).toBe(message)
        expect(exception.originalMessage).toBe(message)
        expect(exception.code).toBe(GrpcStatusCode.NOT_FOUND)
        expect(exception.context).toBe(
          'prepareFeeGrant (baseUrl: http://localhost:9090, rpc: injective_exchange_rpc.InjectiveExchangeRPC/PrepareFeeGrant)',
        )
        expect(exception.metadata).toMatchObject({
          rawErrorName: 'RpcError',
          grpcStatusCode: 5,
          grpcStatusName: 'NOT_FOUND',
          isRetryableGrpcStatus: false,
        })
        expect(exception.contextModule).toBe('test-module')
        expect(exception.contextCode).toBeUndefined()
      }
    })

    it('falls back to context and module when RpcError method details are missing', () => {
      const error = new RpcError('', '5')

      try {
        consumer.throwGrpcError(error, 'prepareFeeGrant')
        expect.unreachable('Expected handleGrpcError to throw')
      } catch (e: unknown) {
        expect(e).toBeInstanceOf(GrpcUnaryRequestException)

        const exception = e as GrpcUnaryRequestException
        const message = 'prepareFeeGrant on test-module failed with NOT_FOUND'

        expect(exception.message).toBe(message)
        expect(exception.originalMessage).toBe(message)
        expect(exception.code).toBe(GrpcStatusCode.NOT_FOUND)
        expect(exception.context).toBe(
          'prepareFeeGrant (baseUrl: http://localhost:9090)',
        )
        expect(exception.metadata).toMatchObject({
          rawErrorCode: '5',
          grpcStatusCode: 5,
          grpcStatusName: 'NOT_FOUND',
        })
        expect(exception.contextModule).toBe('test-module')
        expect(exception.contextCode).toBeUndefined()
      }
    })

    it('adds base URL context to generic non-RpcError exceptions', () => {
      try {
        consumer.throwGrpcError(new Error('network failure'), 'prepareFeeGrant')
        expect.unreachable('Expected handleGrpcError to throw')
      } catch (e: unknown) {
        expect(e).toBeInstanceOf(GrpcUnaryRequestException)

        const exception = e as GrpcUnaryRequestException

        expect(exception.message).toBe('network failure')
        expect(exception.originalMessage).toBe('network failure')
        expect(exception.context).toBe(
          'prepareFeeGrant (baseUrl: http://localhost:9090)',
        )
        expect(exception.metadata).toMatchObject({
          rawErrorName: 'Error',
          rawErrorMessage: 'network failure',
        })
        expect(exception.contextModule).toBe('test-module')
        expect(exception.contextCode).toBeUndefined()
      }
    })

    it('keeps grpc-web wrapped fetch failure details', () => {
      const error = new RpcError('Failed to fetch', 'INTERNAL')
      error.methodName = 'Positions'
      error.serviceName =
        'injective_derivative_exchange_rpc.InjectiveDerivativeExchangeRPC'

      try {
        consumer.throwGrpcError(error, 'positions')
        expect.unreachable('Expected handleGrpcError to throw')
      } catch (e: unknown) {
        expect(e).toBeInstanceOf(GrpcUnaryRequestException)

        const exception = e as GrpcUnaryRequestException

        expect(exception.context).toContain(
          'rpc: injective_derivative_exchange_rpc.InjectiveDerivativeExchangeRPC/Positions',
        )
        expect(exception.metadata).toMatchObject({
          rawErrorName: 'RpcError',
          rawErrorMessage: 'Failed to fetch',
          rawErrorCode: 'INTERNAL',
          grpcStatusCode: 13,
          grpcStatusName: 'INTERNAL',
        })
      }
    })

    it('preserves ABCI error parsing for non-empty RpcError messages', () => {
      const error = new RpcError(
        'failed to execute message; message index: 0: chain failure: invalid request {key:"ABCICode" value:"100"} {key:"Codespace" value:"exchange"}',
        'INVALID_ARGUMENT',
      )
      error.methodName = 'PrepareFeeGrant'
      error.serviceName = 'injective_exchange_rpc.InjectiveExchangeRPC'

      try {
        consumer.throwGrpcError(error, 'prepareFeeGrant')
        expect.unreachable('Expected handleGrpcError to throw')
      } catch (e: unknown) {
        expect(e).toBeInstanceOf(TransactionException)

        const exception = e as TransactionException

        expect(exception.code).toBe(GrpcStatusCode.INVALID_ARGUMENT)
        expect(exception.context).toBe('prepareFeeGrant')
        expect(exception.contextModule).toBe('exchange')
        expect(exception.contextCode).toBe(100)
        expect(exception.originalMessage).toBe('chain failure')
      }
    })
  })
})
