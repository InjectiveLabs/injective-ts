import { RpcError } from '@protobuf-ts/runtime-rpc'
import { it, vi, expect, describe, afterEach } from 'vitest'
import {
  TransactionException,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import BaseGrpcConsumer from './BaseGrpcConsumer.js'
import { GrpcStatusCode } from '../../types/stream.js'

class TestGrpcConsumer extends BaseGrpcConsumer {
  protected module: string = 'test-module'

  public retryCall<TResponse>(
    grpcCall: () => Promise<TResponse>,
    retries?: number,
    delay?: number,
  ) {
    return this.retry(grpcCall, retries, delay)
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

  describe('handleGrpcError', () => {
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
