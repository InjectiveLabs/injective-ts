import { RpcError } from '@protobuf-ts/runtime-rpc'
import { it, vi, expect, describe, afterEach } from 'vitest'
import BaseGrpcConsumer from './BaseGrpcConsumer.js'

class TestGrpcConsumer extends BaseGrpcConsumer {
  public retryCall<TResponse>(
    grpcCall: () => Promise<TResponse>,
    retries?: number,
    delay?: number,
  ) {
    return this.retry(grpcCall, retries, delay)
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
  })
})
